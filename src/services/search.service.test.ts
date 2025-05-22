import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { ComposerSearchResult } from "@/db/schema/composersSearchResults.schema";
import { searchService } from "./search.service";

// Mock data
const mockComposers: ComposerSearchResult[] = [
	{
		id: 1,
		firstName: "Ludwig",
		lastName: "Beethoven",
		slug: "ludwig-van-beethoven",
	},
	{
		id: 2,
		firstName: "Wolfgang",
		lastName: "Mozart",
		slug: "wolfgang-amadeus-mozart",
	},
	{
		id: 3,
		firstName: "Johann",
		lastName: "Bach",
		slug: "johann-sebastian-bach",
	},
	{
		id: 4,
		firstName: "Franz",
		lastName: "Schubert",
		slug: "franz-schubert",
	},
];

// Mock the cache service
const mockCacheService = {
	setCache: mock(() => {}),
	getCache: mock(),
};

// Mock the repository
const mockComposerSearchResultsRepository = {
	getComposerSearchResults: mock(() => Promise.resolve(mockComposers)),
};

// Mock the modules
mock.module("./cache.service", () => ({
	cacheService: mockCacheService,
}));

mock.module("./repositories/composersSearchResults.repository", () => ({
	composerSearchResultsRepository: mockComposerSearchResultsRepository,
}));

// Mock Fuse.js
const mockFuseSearch = mock(() => [
	{ item: mockComposers[0] },
	{ item: mockComposers[1] },
]);

class MockFuse {
	search = mockFuseSearch;
}

mock.module("fuse.js", () => ({
	default: MockFuse,
}));

describe("searchService", () => {
	beforeEach(() => {
		// Reset all mocks before each test
		mockCacheService.setCache.mockReset();
		mockCacheService.getCache.mockReset();
		mockComposerSearchResultsRepository.getComposerSearchResults.mockReset();
		mockFuseSearch.mockReset();

		// Reset default return values
		mockCacheService.getCache.mockReturnValue(null);
		mockComposerSearchResultsRepository.getComposerSearchResults.mockResolvedValue(
			mockComposers,
		);
		mockFuseSearch.mockReturnValue([
			{ item: mockComposers[0] },
			{ item: mockComposers[1] },
		]);
	});

	describe("cacheComposers", () => {
		it("should fetch composers from repository and cache them", async () => {
			// Act
			const result = await searchService.cacheComposers();

			// Assert
			expect(result).toEqual(mockComposers);
			expect(
				mockComposerSearchResultsRepository.getComposerSearchResults,
			).toHaveBeenCalledTimes(1);
			expect(mockCacheService.setCache).toHaveBeenCalledWith(
				"composers",
				mockComposers,
			);
			expect(mockCacheService.setCache).toHaveBeenCalledTimes(1);
		});

		it("should propagate repository errors", async () => {
			// Arrange
			const expectedError = new Error("Database connection failed");
			mockComposerSearchResultsRepository.getComposerSearchResults.mockRejectedValue(
				expectedError,
			);

			// Act & Assert
			await expect(searchService.cacheComposers()).rejects.toThrow(
				"Database connection failed",
			);
			expect(
				mockComposerSearchResultsRepository.getComposerSearchResults,
			).toHaveBeenCalledTimes(1);
			expect(mockCacheService.setCache).not.toHaveBeenCalled();
		});

		it("should return empty array when repository returns empty array", async () => {
			// Arrange
			mockComposerSearchResultsRepository.getComposerSearchResults.mockResolvedValue(
				[],
			);

			// Act
			const result = await searchService.cacheComposers();

			// Assert
			expect(result).toEqual([]);
			expect(mockCacheService.setCache).toHaveBeenCalledWith("composers", []);
		});
	});

	describe("searchComposers", () => {
		it("should search composers using Fuse.js and return results", async () => {
			// Arrange
			const query = "beethoven";
			mockCacheService.getCache.mockReturnValue(mockComposers);

			// Act
			const result = await searchService.searchComposers(query);

			// Assert
			expect(result).toEqual([mockComposers[0], mockComposers[1]]);
			expect(mockFuseSearch).toHaveBeenCalledWith(query);
		});

		it("should limit results to 5 items", async () => {
			// Arrange
			const query = "composer";
			const manyResults = Array.from({ length: 10 }, (_, i) => ({
				item: { ...mockComposers[0], id: i },
			}));
			mockFuseSearch.mockReturnValue(manyResults);
			mockCacheService.getCache.mockReturnValue(mockComposers);

			// Act
			const result = await searchService.searchComposers(query);

			// Assert
			expect(result).toHaveLength(5);
		});

		it("should return empty array when no search results", async () => {
			// Arrange
			const query = "nonexistent";
			mockFuseSearch.mockReturnValue([]);
			mockCacheService.getCache.mockReturnValue(mockComposers);

			// Act
			const result = await searchService.searchComposers(query);

			// Assert
			expect(result).toEqual([]);
			expect(mockFuseSearch).toHaveBeenCalledWith(query);
		});

		it("should handle empty search query", async () => {
			// Arrange
			const query = "";
			mockCacheService.getCache.mockReturnValue(mockComposers);

			// Act
			const result = await searchService.searchComposers(query);

			// Assert
			expect(mockFuseSearch).toHaveBeenCalledWith("");
			expect(result).toEqual([mockComposers[0], mockComposers[1]]);
		});

		it("should fetch composers from repository when cache is empty", async () => {
			// Arrange
			const query = "mozart";
			mockCacheService.getCache.mockReturnValue(null);

			// Act
			const result = await searchService.searchComposers(query);

			// Assert
			expect(
				mockComposerSearchResultsRepository.getComposerSearchResults,
			).toHaveBeenCalledTimes(1);
			expect(mockCacheService.setCache).toHaveBeenCalledWith(
				"composers",
				mockComposers,
			);
			expect(result).toEqual([mockComposers[0], mockComposers[1]]);
		});

		it("should handle search with special characters", async () => {
			// Arrange
			const query = "Johann-Sebastian";
			mockCacheService.getCache.mockReturnValue(mockComposers);

			// Act
			const result = await searchService.searchComposers(query);

			// Assert
			expect(mockFuseSearch).toHaveBeenCalledWith(query);
			expect(result).toEqual([mockComposers[0], mockComposers[1]]);
		});

		it("should propagate errors from caching when cache is empty", async () => {
			// Arrange
			const query = "test";
			const expectedError = new Error("Cache error");
			mockCacheService.getCache.mockReturnValue(null);
			mockComposerSearchResultsRepository.getComposerSearchResults.mockRejectedValue(
				expectedError,
			);

			// Act & Assert
			await expect(searchService.searchComposers(query)).rejects.toThrow(
				"Cache error",
			);
		});
	});
});

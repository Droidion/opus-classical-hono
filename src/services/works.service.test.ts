import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { Work } from "@/db/schema/works.schema";
import { NotFoundError } from "@/errors/errors";
import type { WorksGroupedByGenre } from "@/types/works.types";
import { worksService } from "./works.service";

// Mock the repository
const mockWorkRepository = {
	getWorksByComposerId: mock(() => Promise.resolve([] as Work[])),
	getWorkById: mock(() => Promise.resolve({} as Work)),
};

// Mock the repository module
mock.module("./repositories/works.repository", () => ({
	workRepository: mockWorkRepository,
}));

describe("worksService", () => {
	beforeEach(() => {
		// Reset all mocks before each test
		mockWorkRepository.getWorksByComposerId.mockReset();
		mockWorkRepository.getWorkById.mockReset();
	});

	describe("getWorksGroupedByGenres", () => {
		it("should return empty array when no works are found", async () => {
			// Arrange
			const composerId = 1;
			mockWorkRepository.getWorksByComposerId.mockResolvedValue([]);

			// Act
			const result = await worksService.getWorksGroupedByGenres(composerId);

			// Assert
			expect(result).toEqual([]);
			expect(mockWorkRepository.getWorksByComposerId).toHaveBeenCalledWith(
				composerId,
			);
			expect(mockWorkRepository.getWorksByComposerId).toHaveBeenCalledTimes(1);
		});

		it("should group works by genre correctly", async () => {
			// Arrange
			const composerId = 1;
			const mockWorks: Work[] = [
				{
					id: 1,
					title: "Symphony No. 1",
					yearStart: 1800,
					yearFinish: 1801,
					averageMintues: 45,
					catalogueName: "Op.",
					catalogueNumber: 1,
					cataloguePostfix: null,
					no: 1,
					nickname: "First Symphony",
					composerId: 1,
					sort: 1,
					genreId: 1,
					genreName: "Symphony",
				},
				{
					id: 2,
					title: "Symphony No. 2",
					yearStart: 1802,
					yearFinish: 1803,
					averageMintues: 50,
					catalogueName: "Op.",
					catalogueNumber: 2,
					cataloguePostfix: null,
					no: 2,
					nickname: "Second Symphony",
					composerId: 1,
					sort: 2,
					genreId: 1,
					genreName: "Symphony",
				},
				{
					id: 3,
					title: "Piano Sonata No. 1",
					yearStart: 1804,
					yearFinish: 1805,
					averageMintues: 25,
					catalogueName: "Op.",
					catalogueNumber: 3,
					cataloguePostfix: null,
					no: 1,
					nickname: "Moonlight",
					composerId: 1,
					sort: 1,
					genreId: 2,
					genreName: "Piano Sonata",
				},
			];

			const expectedResult: WorksGroupedByGenre[] = [
				{
					genreName: "Symphony",
					works: [mockWorks[0], mockWorks[1]],
				},
				{
					genreName: "Piano Sonata",
					works: [mockWorks[2]],
				},
			];

			mockWorkRepository.getWorksByComposerId.mockResolvedValue(mockWorks);

			// Act
			const result = await worksService.getWorksGroupedByGenres(composerId);

			// Assert
			expect(result).toHaveLength(2);
			expect(result).toEqual(expect.arrayContaining(expectedResult));
			expect(mockWorkRepository.getWorksByComposerId).toHaveBeenCalledWith(
				composerId,
			);
			expect(mockWorkRepository.getWorksByComposerId).toHaveBeenCalledTimes(1);

			// Check that Symphony genre has 2 works
			const symphonyGenre = result.find((g) => g.genreName === "Symphony");
			expect(symphonyGenre?.works).toHaveLength(2);

			// Check that Piano Sonata genre has 1 work
			const pianoSonataGenre = result.find(
				(g) => g.genreName === "Piano Sonata",
			);
			expect(pianoSonataGenre?.works).toHaveLength(1);
		});

		it("should handle works with the same genre name correctly", async () => {
			// Arrange
			const composerId = 2;
			const mockWorks: Work[] = [
				{
					id: 4,
					title: "Concerto No. 1",
					yearStart: 1850,
					yearFinish: 1851,
					averageMintues: 35,
					catalogueName: "K.",
					catalogueNumber: 100,
					cataloguePostfix: null,
					no: 1,
					nickname: null,
					composerId: 2,
					sort: 1,
					genreId: 3,
					genreName: "Concerto",
				},
				{
					id: 5,
					title: "Concerto No. 2",
					yearStart: 1852,
					yearFinish: 1853,
					averageMintues: 40,
					catalogueName: "K.",
					catalogueNumber: 200,
					cataloguePostfix: null,
					no: 2,
					nickname: null,
					composerId: 2,
					sort: 2,
					genreId: 3,
					genreName: "Concerto",
				},
			];

			mockWorkRepository.getWorksByComposerId.mockResolvedValue(mockWorks);

			// Act
			const result = await worksService.getWorksGroupedByGenres(composerId);

			// Assert
			expect(result).toHaveLength(1);
			expect(result[0].genreName).toBe("Concerto");
			expect(result[0].works).toHaveLength(2);
			expect(result[0].works).toEqual(expect.arrayContaining(mockWorks));
		});

		it("should propagate repository errors", async () => {
			// Arrange
			const composerId = 1;
			const expectedError = new Error("Database connection failed");
			mockWorkRepository.getWorksByComposerId.mockRejectedValue(expectedError);

			// Act & Assert
			await expect(
				worksService.getWorksGroupedByGenres(composerId),
			).rejects.toThrow("Database connection failed");
			expect(mockWorkRepository.getWorksByComposerId).toHaveBeenCalledWith(
				composerId,
			);
		});
	});

	describe("getWorkById", () => {
		it("should return work when found", async () => {
			// Arrange
			const workId = 1;
			const expectedWork: Work = {
				id: 1,
				title: "Symphony No. 1",
				yearStart: 1800,
				yearFinish: 1801,
				averageMintues: 45,
				catalogueName: "Op.",
				catalogueNumber: 1,
				cataloguePostfix: null,
				no: 1,
				nickname: "First Symphony",
				composerId: 1,
				sort: 1,
				genreId: 1,
				genreName: "Symphony",
			};

			mockWorkRepository.getWorkById.mockResolvedValue(expectedWork);

			// Act
			const result = await worksService.getWorkById(workId);

			// Assert
			expect(result).toEqual(expectedWork);
			expect(mockWorkRepository.getWorkById).toHaveBeenCalledWith(workId);
			expect(mockWorkRepository.getWorkById).toHaveBeenCalledTimes(1);
		});

		it("should propagate NotFoundError when work is not found", async () => {
			// Arrange
			const workId = 999;
			const expectedError = new NotFoundError(
				`Work with id=${workId} not found`,
			);
			mockWorkRepository.getWorkById.mockRejectedValue(expectedError);

			// Act & Assert
			await expect(worksService.getWorkById(workId)).rejects.toThrow(
				NotFoundError,
			);
			await expect(worksService.getWorkById(workId)).rejects.toThrow(
				`Work with id=${workId} not found`,
			);
			expect(mockWorkRepository.getWorkById).toHaveBeenCalledWith(workId);
		});

		it("should propagate other repository errors", async () => {
			// Arrange
			const workId = 1;
			const expectedError = new Error("Database connection failed");
			mockWorkRepository.getWorkById.mockRejectedValue(expectedError);

			// Act & Assert
			await expect(worksService.getWorkById(workId)).rejects.toThrow(
				"Database connection failed",
			);
			expect(mockWorkRepository.getWorkById).toHaveBeenCalledWith(workId);
		});

		it("should handle work with null optional fields", async () => {
			// Arrange
			const workId = 2;
			const workWithNulls: Work = {
				id: 2,
				title: "Simple Work",
				yearStart: null,
				yearFinish: null,
				averageMintues: 20,
				catalogueName: null,
				catalogueNumber: null,
				cataloguePostfix: null,
				no: null,
				nickname: null,
				composerId: 1,
				sort: 1,
				genreId: 1,
				genreName: "Miscellaneous",
			};

			mockWorkRepository.getWorkById.mockResolvedValue(workWithNulls);

			// Act
			const result = await worksService.getWorkById(workId);

			// Assert
			expect(result).toEqual(workWithNulls);
			expect(result.yearStart).toBeNull();
			expect(result.yearFinish).toBeNull();
			expect(result.catalogueName).toBeNull();
			expect(result.nickname).toBeNull();
		});
	});
});

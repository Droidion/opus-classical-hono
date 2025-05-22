import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { Composer } from "@/db/schema/composers.schema";
import type { Period } from "@/db/schema/periods.schema";
import { NotFoundError } from "@/errors/errors";
import { composersService } from "./composers.service";

// Mock data
const mockPeriods: Period[] = [
	{
		id: 1,
		name: "Baroque",
		yearStart: 1600,
		yearEnd: 1750,
		slug: "baroque",
	},
	{
		id: 2,
		name: "Classical",
		yearStart: 1750,
		yearEnd: 1820,
		slug: "classical",
	},
	{
		id: 3,
		name: "Romantic",
		yearStart: 1800,
		yearEnd: 1910,
		slug: "romantic",
	},
];

const mockComposers: Composer[] = [
	{
		id: 1,
		firstName: "Johann Sebastian",
		lastName: "Bach",
		yearBorn: 1685,
		yearDied: 1750,
		periodId: 1,
		slug: "johann-sebastian-bach",
		wikipediaLink: "https://en.wikipedia.org/wiki/Johann_Sebastian_Bach",
		imslpLink: "https://imslp.org/wiki/Category:Bach,_Johann_Sebastian",
		enabled: true,
		countries: "Germany",
	},
	{
		id: 2,
		firstName: "Wolfgang Amadeus",
		lastName: "Mozart",
		yearBorn: 1756,
		yearDied: 1791,
		periodId: 2,
		slug: "wolfgang-amadeus-mozart",
		wikipediaLink: "https://en.wikipedia.org/wiki/Wolfgang_Amadeus_Mozart",
		imslpLink: "https://imslp.org/wiki/Category:Mozart,_Wolfgang_Amadeus",
		enabled: true,
		countries: "Austria",
	},
	{
		id: 3,
		firstName: "Ludwig van",
		lastName: "Beethoven",
		yearBorn: 1770,
		yearDied: 1827,
		periodId: 2,
		slug: "ludwig-van-beethoven",
		wikipediaLink: "https://en.wikipedia.org/wiki/Ludwig_van_Beethoven",
		imslpLink: "https://imslp.org/wiki/Category:Beethoven,_Ludwig_van",
		enabled: true,
		countries: "Germany",
	},
	{
		id: 4,
		firstName: "Frédéric",
		lastName: "Chopin",
		yearBorn: 1810,
		yearDied: 1849,
		periodId: 3,
		slug: "frederic-chopin",
		wikipediaLink: "https://en.wikipedia.org/wiki/Frédéric_Chopin",
		imslpLink: "https://imslp.org/wiki/Category:Chopin,_Frédéric",
		enabled: true,
		countries: "Poland",
	},
];

// Mock the repositories
const mockComposerRepository = {
	getComposers: mock(() => Promise.resolve(mockComposers)),
	getComposerBySlug: mock(() => Promise.resolve(mockComposers[0])),
};

const mockPeriodRepository = {
	getPeriods: mock(() => Promise.resolve(mockPeriods)),
};

// Mock the repository modules
mock.module("./repositories/composers.repository", () => ({
	composerRepository: mockComposerRepository,
}));

mock.module("./repositories/periods.repository", () => ({
	periodRepository: mockPeriodRepository,
}));

describe("composersService", () => {
	beforeEach(() => {
		// Reset all mocks before each test
		mockComposerRepository.getComposers.mockReset();
		mockComposerRepository.getComposerBySlug.mockReset();
		mockPeriodRepository.getPeriods.mockReset();

		// Reset default return values
		mockComposerRepository.getComposers.mockResolvedValue(mockComposers);
		mockComposerRepository.getComposerBySlug.mockResolvedValue(
			mockComposers[0],
		);
		mockPeriodRepository.getPeriods.mockResolvedValue(mockPeriods);
	});

	describe("getComposersGroupedByPeriods", () => {
		it("should group composers by periods correctly", async () => {
			// Act
			const result = await composersService.getComposersGroupedByPeriods();

			// Assert
			expect(result).toHaveLength(3);
			expect(mockPeriodRepository.getPeriods).toHaveBeenCalledTimes(1);
			expect(mockComposerRepository.getComposers).toHaveBeenCalledTimes(1);

			// Check Baroque period (1 composer)
			const baroqueGroup = result.find(
				(group) => group.period.name === "Baroque",
			);
			expect(baroqueGroup).toBeDefined();
			expect(baroqueGroup?.composers).toHaveLength(1);
			expect(baroqueGroup?.composers[0]).toEqual(mockComposers[0]); // Bach

			// Check Classical period (2 composers)
			const classicalGroup = result.find(
				(group) => group.period.name === "Classical",
			);
			expect(classicalGroup).toBeDefined();
			expect(classicalGroup?.composers).toHaveLength(2);
			expect(classicalGroup?.composers).toEqual(
				expect.arrayContaining([mockComposers[1], mockComposers[2]]), // Mozart, Beethoven
			);

			// Check Romantic period (1 composer)
			const romanticGroup = result.find(
				(group) => group.period.name === "Romantic",
			);
			expect(romanticGroup).toBeDefined();
			expect(romanticGroup?.composers).toHaveLength(1);
			expect(romanticGroup?.composers[0]).toEqual(mockComposers[3]); // Chopin
		});

		it("should return periods with empty composers array when no composers exist", async () => {
			// Arrange
			mockComposerRepository.getComposers.mockResolvedValue([]);

			// Act
			const result = await composersService.getComposersGroupedByPeriods();

			// Assert
			expect(result).toHaveLength(3);
			expect(result[0].composers).toEqual([]);
			expect(result[1].composers).toEqual([]);
			expect(result[2].composers).toEqual([]);
		});

		it("should return empty array when no periods exist", async () => {
			// Arrange
			mockPeriodRepository.getPeriods.mockResolvedValue([]);

			// Act
			const result = await composersService.getComposersGroupedByPeriods();

			// Assert
			expect(result).toEqual([]);
			expect(mockPeriodRepository.getPeriods).toHaveBeenCalledTimes(1);
			expect(mockComposerRepository.getComposers).toHaveBeenCalledTimes(1);
		});

		it("should handle periods with no matching composers", async () => {
			// Arrange
			const periodsWithUnmatchedId = [
				...mockPeriods,
				{
					id: 4,
					name: "Modern",
					yearStart: 1910,
					yearEnd: 2000,
					slug: "modern",
				},
			];
			mockPeriodRepository.getPeriods.mockResolvedValue(periodsWithUnmatchedId);

			// Act
			const result = await composersService.getComposersGroupedByPeriods();

			// Assert
			expect(result).toHaveLength(4);
			const modernGroup = result.find(
				(group) => group.period.name === "Modern",
			);
			expect(modernGroup).toBeDefined();
			expect(modernGroup?.composers).toEqual([]);
		});

		it("should propagate errors from period repository", async () => {
			// Arrange
			const expectedError = new Error("Failed to fetch periods");
			mockPeriodRepository.getPeriods.mockRejectedValue(expectedError);

			// Act & Assert
			await expect(
				composersService.getComposersGroupedByPeriods(),
			).rejects.toThrow("Failed to fetch periods");
			expect(mockPeriodRepository.getPeriods).toHaveBeenCalledTimes(1);
		});

		it("should propagate errors from composer repository", async () => {
			// Arrange
			const expectedError = new Error("Failed to fetch composers");
			mockComposerRepository.getComposers.mockRejectedValue(expectedError);

			// Act & Assert
			await expect(
				composersService.getComposersGroupedByPeriods(),
			).rejects.toThrow("Failed to fetch composers");
			expect(mockPeriodRepository.getPeriods).toHaveBeenCalledTimes(1);
			expect(mockComposerRepository.getComposers).toHaveBeenCalledTimes(1);
		});

		it("should handle composers with duplicate period IDs correctly", async () => {
			// Arrange
			const duplicatePeriodComposers = [
				...mockComposers,
				{
					id: 5,
					firstName: "Joseph",
					lastName: "Haydn",
					yearBorn: 1732,
					yearDied: 1809,
					periodId: 2, // Same as Mozart and Beethoven
					slug: "joseph-haydn",
					wikipediaLink: "https://en.wikipedia.org/wiki/Joseph_Haydn",
					imslpLink: "https://imslp.org/wiki/Category:Haydn,_Joseph",
					enabled: true,
					countries: "Austria",
				},
			];
			mockComposerRepository.getComposers.mockResolvedValue(
				duplicatePeriodComposers,
			);

			// Act
			const result = await composersService.getComposersGroupedByPeriods();

			// Assert
			const classicalGroup = result.find(
				(group) => group.period.name === "Classical",
			);
			expect(classicalGroup?.composers).toHaveLength(3); // Mozart, Beethoven, Haydn
		});
	});

	describe("getComposerBySlug", () => {
		it("should return composer when found", async () => {
			// Arrange
			const slug = "johann-sebastian-bach";
			const expectedComposer = mockComposers[0];
			mockComposerRepository.getComposerBySlug.mockResolvedValue(
				expectedComposer,
			);

			// Act
			const result = await composersService.getComposerBySlug(slug);

			// Assert
			expect(result).toEqual(expectedComposer);
			expect(mockComposerRepository.getComposerBySlug).toHaveBeenCalledWith(
				slug,
			);
			expect(mockComposerRepository.getComposerBySlug).toHaveBeenCalledTimes(1);
		});

		it("should propagate NotFoundError when composer is not found", async () => {
			// Arrange
			const slug = "non-existent-composer";
			const expectedError = new NotFoundError(
				`Composer with slug="${slug}" not found`,
			);
			mockComposerRepository.getComposerBySlug.mockRejectedValue(expectedError);

			// Act & Assert
			await expect(composersService.getComposerBySlug(slug)).rejects.toThrow(
				NotFoundError,
			);
			await expect(composersService.getComposerBySlug(slug)).rejects.toThrow(
				`Composer with slug="${slug}" not found`,
			);
			expect(mockComposerRepository.getComposerBySlug).toHaveBeenCalledWith(
				slug,
			);
		});

		it("should propagate other repository errors", async () => {
			// Arrange
			const slug = "test-slug";
			const expectedError = new Error("Database connection failed");
			mockComposerRepository.getComposerBySlug.mockRejectedValue(expectedError);

			// Act & Assert
			await expect(composersService.getComposerBySlug(slug)).rejects.toThrow(
				"Database connection failed",
			);
			expect(mockComposerRepository.getComposerBySlug).toHaveBeenCalledWith(
				slug,
			);
		});

		it("should handle composer with null optional fields", async () => {
			// Arrange
			const slug = "simple-composer";
			const composerWithNulls: Composer = {
				id: 5,
				firstName: "Test",
				lastName: "Composer",
				yearBorn: 1800,
				yearDied: null,
				periodId: 1,
				slug: "simple-composer",
				wikipediaLink: null,
				imslpLink: null,
				enabled: true,
				countries: "Unknown",
			};
			mockComposerRepository.getComposerBySlug.mockResolvedValue(
				composerWithNulls,
			);

			// Act
			const result = await composersService.getComposerBySlug(slug);

			// Assert
			expect(result).toEqual(composerWithNulls);
			expect(result.yearDied).toBeNull();
			expect(result.wikipediaLink).toBeNull();
			expect(result.imslpLink).toBeNull();
		});

		it("should handle special characters in slug", async () => {
			// Arrange
			const slug = "frédéric-chopin";
			const expectedComposer = mockComposers[3];
			mockComposerRepository.getComposerBySlug.mockResolvedValue(
				expectedComposer,
			);

			// Act
			const result = await composersService.getComposerBySlug(slug);

			// Assert
			expect(result).toEqual(expectedComposer);
			expect(mockComposerRepository.getComposerBySlug).toHaveBeenCalledWith(
				slug,
			);
		});

		it("should handle empty string slug", async () => {
			// Arrange
			const slug = "";
			const expectedError = new NotFoundError(
				'Composer with slug="" not found',
			);
			mockComposerRepository.getComposerBySlug.mockRejectedValue(expectedError);

			// Act & Assert
			await expect(composersService.getComposerBySlug(slug)).rejects.toThrow(
				NotFoundError,
			);
			expect(mockComposerRepository.getComposerBySlug).toHaveBeenCalledWith("");
		});
	});
});

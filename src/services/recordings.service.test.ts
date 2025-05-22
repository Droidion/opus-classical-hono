import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { Link } from "@/db/schema/links.schema";
import type { Performer } from "@/db/schema/performers.schema";
import type { Recording } from "@/db/schema/recordings.schema";
import type { RecordingWithPerformersAndLinks } from "@/types/recordings.types";
import { recordingsService } from "./recordings.service";

// Mock the repositories
const mockRecordingRepository = {
	getRecordingsByWork: mock(() => Promise.resolve([] as Recording[])),
};

const mockPerformersRepository = {
	getPerformersByRecordings: mock(() => Promise.resolve([] as Performer[])),
};

const mockLinksRepository = {
	getLinksByRecordings: mock(() => Promise.resolve([] as Link[])),
};

// Mock the repository modules
mock.module("./repositories/recordings.repository", () => ({
	recordingRepository: mockRecordingRepository,
}));

mock.module("./repositories/performers.repository", () => ({
	performersRepository: mockPerformersRepository,
}));

mock.module("./repositories/links.repository", () => ({
	linksRepository: mockLinksRepository,
}));

describe("recordingsService", () => {
	beforeEach(() => {
		// Reset all mocks before each test
		mockRecordingRepository.getRecordingsByWork.mockReset();
		mockPerformersRepository.getPerformersByRecordings.mockReset();
		mockLinksRepository.getLinksByRecordings.mockReset();
	});

	describe("getRecordingsByWorkId", () => {
		it("should return recordings when found", async () => {
			// Arrange
			const workId = 1;
			const mockRecordings: Recording[] = [
				{
					id: 1,
					coverName: "Test Cover 1",
					length: 3600,
					label: "Test Label 1",
					workId: 1,
					yearStart: 2020,
					yearFinish: 2021,
				},
				{
					id: 2,
					coverName: "Test Cover 2",
					length: 4200,
					label: "Test Label 2",
					workId: 1,
					yearStart: 2021,
					yearFinish: 2022,
				},
			];

			mockRecordingRepository.getRecordingsByWork.mockResolvedValue(
				mockRecordings,
			);

			// Act
			const result = await recordingsService.getRecordingsByWorkId(workId);

			// Assert
			expect(result).toEqual(mockRecordings);
			expect(mockRecordingRepository.getRecordingsByWork).toHaveBeenCalledWith(
				workId,
			);
			expect(mockRecordingRepository.getRecordingsByWork).toHaveBeenCalledTimes(
				1,
			);
		});

		it("should return empty array when no recordings are found", async () => {
			// Arrange
			const workId = 999;
			mockRecordingRepository.getRecordingsByWork.mockResolvedValue([]);

			// Act
			const result = await recordingsService.getRecordingsByWorkId(workId);

			// Assert
			expect(result).toEqual([]);
			expect(mockRecordingRepository.getRecordingsByWork).toHaveBeenCalledWith(
				workId,
			);
			expect(mockRecordingRepository.getRecordingsByWork).toHaveBeenCalledTimes(
				1,
			);
		});

		it("should propagate repository errors", async () => {
			// Arrange
			const workId = 1;
			const expectedError = new Error("Database connection failed");
			mockRecordingRepository.getRecordingsByWork.mockRejectedValue(
				expectedError,
			);

			// Act & Assert
			await expect(
				recordingsService.getRecordingsByWorkId(workId),
			).rejects.toThrow("Database connection failed");
			expect(mockRecordingRepository.getRecordingsByWork).toHaveBeenCalledWith(
				workId,
			);
		});
	});

	describe("recordingsWithPerformersAndLinks", () => {
		it("should return recordings with associated performers and links", async () => {
			// Arrange
			const workId = 1;
			const mockRecordings: Recording[] = [
				{
					id: 1,
					coverName: "Test Cover 1",
					length: 3600,
					label: "Test Label 1",
					workId: 1,
					yearStart: 2020,
					yearFinish: 2021,
				},
				{
					id: 2,
					coverName: "Test Cover 2",
					length: 4200,
					label: "Test Label 2",
					workId: 1,
					yearStart: 2021,
					yearFinish: 2022,
				},
			];

			const mockPerformers: Performer[] = [
				{
					recordingId: 1,
					firstName: "John",
					lastName: "Doe",
					instrument: "Piano",
					priority: 1,
					performerId: 1,
				},
				{
					recordingId: 1,
					firstName: "Jane",
					lastName: "Smith",
					instrument: "Violin",
					priority: 2,
					performerId: 2,
				},
				{
					recordingId: 2,
					firstName: "Bob",
					lastName: "Johnson",
					instrument: "Cello",
					priority: 1,
					performerId: 3,
				},
			];

			const mockLinks: Link[] = [
				{
					recordingId: 1,
					recordingLink: "https://spotify.com/track1",
					streamer: "Spotify",
					icon: "spotify.png",
					linkPrefix: "https://open.spotify.com/",
					streamerId: 1,
				},
				{
					recordingId: 1,
					recordingLink: "https://youtube.com/watch?v=1",
					streamer: "YouTube",
					icon: "youtube.png",
					linkPrefix: "https://youtube.com/",
					streamerId: 2,
				},
				{
					recordingId: 2,
					recordingLink: "https://spotify.com/track2",
					streamer: "Spotify",
					icon: "spotify.png",
					linkPrefix: "https://open.spotify.com/",
					streamerId: 1,
				},
			];

			const expectedResult: RecordingWithPerformersAndLinks[] = [
				{
					recording: mockRecordings[0],
					performers: [mockPerformers[0], mockPerformers[1]], // Both belong to recording 1
					links: [mockLinks[0], mockLinks[1]], // Both belong to recording 1
				},
				{
					recording: mockRecordings[1],
					performers: [mockPerformers[2]], // Only one performer for recording 2
					links: [mockLinks[2]], // Only one link for recording 2
				},
			];

			mockRecordingRepository.getRecordingsByWork.mockResolvedValue(
				mockRecordings,
			);
			mockPerformersRepository.getPerformersByRecordings.mockResolvedValue(
				mockPerformers,
			);
			mockLinksRepository.getLinksByRecordings.mockResolvedValue(mockLinks);

			// Act
			const result =
				await recordingsService.recordingsWithPerformersAndLinks(workId);

			// Assert
			expect(result).toEqual(expectedResult);
			expect(mockRecordingRepository.getRecordingsByWork).toHaveBeenCalledWith(
				workId,
			);
			expect(
				mockPerformersRepository.getPerformersByRecordings,
			).toHaveBeenCalledWith([1, 2]);
			expect(mockLinksRepository.getLinksByRecordings).toHaveBeenCalledWith([
				1, 2,
			]);
			expect(mockRecordingRepository.getRecordingsByWork).toHaveBeenCalledTimes(
				1,
			);
			expect(
				mockPerformersRepository.getPerformersByRecordings,
			).toHaveBeenCalledTimes(1);
			expect(mockLinksRepository.getLinksByRecordings).toHaveBeenCalledTimes(1);
		});

		it("should return recordings with empty performers and links when none exist", async () => {
			// Arrange
			const workId = 1;
			const mockRecordings: Recording[] = [
				{
					id: 1,
					coverName: "Test Cover 1",
					length: 3600,
					label: "Test Label 1",
					workId: 1,
					yearStart: 2020,
					yearFinish: 2021,
				},
			];

			const expectedResult: RecordingWithPerformersAndLinks[] = [
				{
					recording: mockRecordings[0],
					performers: [],
					links: [],
				},
			];

			mockRecordingRepository.getRecordingsByWork.mockResolvedValue(
				mockRecordings,
			);
			mockPerformersRepository.getPerformersByRecordings.mockResolvedValue([]);
			mockLinksRepository.getLinksByRecordings.mockResolvedValue([]);

			// Act
			const result =
				await recordingsService.recordingsWithPerformersAndLinks(workId);

			// Assert
			expect(result).toEqual(expectedResult);
			expect(mockRecordingRepository.getRecordingsByWork).toHaveBeenCalledWith(
				workId,
			);
			expect(
				mockPerformersRepository.getPerformersByRecordings,
			).toHaveBeenCalledWith([1]);
			expect(mockLinksRepository.getLinksByRecordings).toHaveBeenCalledWith([
				1,
			]);
		});

		it("should return empty array when no recordings are found", async () => {
			// Arrange
			const workId = 999;
			mockRecordingRepository.getRecordingsByWork.mockResolvedValue([]);
			mockPerformersRepository.getPerformersByRecordings.mockResolvedValue([]);
			mockLinksRepository.getLinksByRecordings.mockResolvedValue([]);

			// Act
			const result =
				await recordingsService.recordingsWithPerformersAndLinks(workId);

			// Assert
			expect(result).toEqual([]);
			expect(mockRecordingRepository.getRecordingsByWork).toHaveBeenCalledWith(
				workId,
			);
			expect(
				mockPerformersRepository.getPerformersByRecordings,
			).toHaveBeenCalledWith([]);
			expect(mockLinksRepository.getLinksByRecordings).toHaveBeenCalledWith([]);
		});

		it("should handle recordings with only performers but no links", async () => {
			// Arrange
			const workId = 1;
			const mockRecordings: Recording[] = [
				{
					id: 1,
					coverName: "Test Cover 1",
					length: 3600,
					label: "Test Label 1",
					workId: 1,
					yearStart: 2020,
					yearFinish: 2021,
				},
			];

			const mockPerformers: Performer[] = [
				{
					recordingId: 1,
					firstName: "John",
					lastName: "Doe",
					instrument: "Piano",
					priority: 1,
					performerId: 1,
				},
			];

			const expectedResult: RecordingWithPerformersAndLinks[] = [
				{
					recording: mockRecordings[0],
					performers: mockPerformers,
					links: [],
				},
			];

			mockRecordingRepository.getRecordingsByWork.mockResolvedValue(
				mockRecordings,
			);
			mockPerformersRepository.getPerformersByRecordings.mockResolvedValue(
				mockPerformers,
			);
			mockLinksRepository.getLinksByRecordings.mockResolvedValue([]);

			// Act
			const result =
				await recordingsService.recordingsWithPerformersAndLinks(workId);

			// Assert
			expect(result).toEqual(expectedResult);
			expect(result[0].performers).toHaveLength(1);
			expect(result[0].links).toHaveLength(0);
		});

		it("should handle recordings with only links but no performers", async () => {
			// Arrange
			const workId = 1;
			const mockRecordings: Recording[] = [
				{
					id: 1,
					coverName: "Test Cover 1",
					length: 3600,
					label: "Test Label 1",
					workId: 1,
					yearStart: 2020,
					yearFinish: 2021,
				},
			];

			const mockLinks: Link[] = [
				{
					recordingId: 1,
					recordingLink: "https://spotify.com/track1",
					streamer: "Spotify",
					icon: "spotify.png",
					linkPrefix: "https://open.spotify.com/",
					streamerId: 1,
				},
			];

			const expectedResult: RecordingWithPerformersAndLinks[] = [
				{
					recording: mockRecordings[0],
					performers: [],
					links: mockLinks,
				},
			];

			mockRecordingRepository.getRecordingsByWork.mockResolvedValue(
				mockRecordings,
			);
			mockPerformersRepository.getPerformersByRecordings.mockResolvedValue([]);
			mockLinksRepository.getLinksByRecordings.mockResolvedValue(mockLinks);

			// Act
			const result =
				await recordingsService.recordingsWithPerformersAndLinks(workId);

			// Assert
			expect(result).toEqual(expectedResult);
			expect(result[0].performers).toHaveLength(0);
			expect(result[0].links).toHaveLength(1);
		});

		it("should handle multiple recordings with mixed performer and link associations", async () => {
			// Arrange
			const workId = 1;
			const mockRecordings: Recording[] = [
				{
					id: 1,
					coverName: "Test Cover 1",
					length: 3600,
					label: "Test Label 1",
					workId: 1,
					yearStart: 2020,
					yearFinish: 2021,
				},
				{
					id: 2,
					coverName: "Test Cover 2",
					length: 4200,
					label: "Test Label 2",
					workId: 1,
					yearStart: 2021,
					yearFinish: 2022,
				},
				{
					id: 3,
					coverName: "Test Cover 3",
					length: 5000,
					label: "Test Label 3",
					workId: 1,
					yearStart: 2022,
					yearFinish: 2023,
				},
			];

			// Recording 1 has 2 performers and 1 link
			// Recording 2 has 1 performer and 2 links
			// Recording 3 has 0 performers and 0 links
			const mockPerformers: Performer[] = [
				{
					recordingId: 1,
					firstName: "John",
					lastName: "Doe",
					instrument: "Piano",
					priority: 1,
					performerId: 1,
				},
				{
					recordingId: 1,
					firstName: "Jane",
					lastName: "Smith",
					instrument: "Violin",
					priority: 2,
					performerId: 2,
				},
				{
					recordingId: 2,
					firstName: "Bob",
					lastName: "Johnson",
					instrument: "Cello",
					priority: 1,
					performerId: 3,
				},
			];

			const mockLinks: Link[] = [
				{
					recordingId: 1,
					recordingLink: "https://spotify.com/track1",
					streamer: "Spotify",
					icon: "spotify.png",
					linkPrefix: "https://open.spotify.com/",
					streamerId: 1,
				},
				{
					recordingId: 2,
					recordingLink: "https://spotify.com/track2",
					streamer: "Spotify",
					icon: "spotify.png",
					linkPrefix: "https://open.spotify.com/",
					streamerId: 1,
				},
				{
					recordingId: 2,
					recordingLink: "https://youtube.com/watch?v=2",
					streamer: "YouTube",
					icon: "youtube.png",
					linkPrefix: "https://youtube.com/",
					streamerId: 2,
				},
			];

			mockRecordingRepository.getRecordingsByWork.mockResolvedValue(
				mockRecordings,
			);
			mockPerformersRepository.getPerformersByRecordings.mockResolvedValue(
				mockPerformers,
			);
			mockLinksRepository.getLinksByRecordings.mockResolvedValue(mockLinks);

			// Act
			const result =
				await recordingsService.recordingsWithPerformersAndLinks(workId);

			// Assert
			expect(result).toHaveLength(3);

			// Recording 1: 2 performers, 1 link
			expect(result[0].recording.id).toBe(1);
			expect(result[0].performers).toHaveLength(2);
			expect(result[0].links).toHaveLength(1);

			// Recording 2: 1 performer, 2 links
			expect(result[1].recording.id).toBe(2);
			expect(result[1].performers).toHaveLength(1);
			expect(result[1].links).toHaveLength(2);

			// Recording 3: 0 performers, 0 links
			expect(result[2].recording.id).toBe(3);
			expect(result[2].performers).toHaveLength(0);
			expect(result[2].links).toHaveLength(0);
		});

		it("should propagate recording repository errors", async () => {
			// Arrange
			const workId = 1;
			const expectedError = new Error("Failed to fetch recordings");
			mockRecordingRepository.getRecordingsByWork.mockRejectedValue(
				expectedError,
			);

			// Act & Assert
			await expect(
				recordingsService.recordingsWithPerformersAndLinks(workId),
			).rejects.toThrow("Failed to fetch recordings");
			expect(mockRecordingRepository.getRecordingsByWork).toHaveBeenCalledWith(
				workId,
			);
		});

		it("should propagate performers repository errors", async () => {
			// Arrange
			const workId = 1;
			const mockRecordings: Recording[] = [
				{
					id: 1,
					coverName: "Test Cover 1",
					length: 3600,
					label: "Test Label 1",
					workId: 1,
					yearStart: 2020,
					yearFinish: 2021,
				},
			];
			const expectedError = new Error("Failed to fetch performers");

			mockRecordingRepository.getRecordingsByWork.mockResolvedValue(
				mockRecordings,
			);
			mockPerformersRepository.getPerformersByRecordings.mockRejectedValue(
				expectedError,
			);

			// Act & Assert
			await expect(
				recordingsService.recordingsWithPerformersAndLinks(workId),
			).rejects.toThrow("Failed to fetch performers");
			expect(
				mockPerformersRepository.getPerformersByRecordings,
			).toHaveBeenCalledWith([1]);
		});

		it("should propagate links repository errors", async () => {
			// Arrange
			const workId = 1;
			const mockRecordings: Recording[] = [
				{
					id: 1,
					coverName: "Test Cover 1",
					length: 3600,
					label: "Test Label 1",
					workId: 1,
					yearStart: 2020,
					yearFinish: 2021,
				},
			];
			const expectedError = new Error("Failed to fetch links");

			mockRecordingRepository.getRecordingsByWork.mockResolvedValue(
				mockRecordings,
			);
			mockPerformersRepository.getPerformersByRecordings.mockResolvedValue([]);
			mockLinksRepository.getLinksByRecordings.mockRejectedValue(expectedError);

			// Act & Assert
			await expect(
				recordingsService.recordingsWithPerformersAndLinks(workId),
			).rejects.toThrow("Failed to fetch links");
			expect(mockLinksRepository.getLinksByRecordings).toHaveBeenCalledWith([
				1,
			]);
		});
	});
});

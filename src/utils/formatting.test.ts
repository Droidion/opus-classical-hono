import { describe, expect, it } from "bun:test";
import {
	formatCatalogueName,
	formatWorkLength,
	formatWorkName,
	formatYearsRangeString,
	sliceYear,
} from "./formatting";

describe("sliceYear", () => {
	it("creates valid slice", () => {
		expect(sliceYear(1985)).toBe("85");
		expect(sliceYear(9999)).toBe("99");
	});
});

describe("formatYearsRangeString", () => {
	it("formats years range properly", () => {
		expect(formatYearsRangeString(1900, 1902)).toBe("1900–02");
		expect(formatYearsRangeString(1890, 1912)).toBe("1890–1912");
		expect(formatYearsRangeString(500, 1400)).toBe("500–1400");
		expect(formatYearsRangeString(1890, 1)).toBe("1890–");
		expect(formatYearsRangeString(1990, 0)).toBe("1990–");
		expect(formatYearsRangeString(0, 1950)).toBe("1950");
		expect(formatYearsRangeString(1, 1912)).toBe("1912");
		expect(formatYearsRangeString(-1, 0)).toBe("");
	});
});

describe("formatWorkLength", () => {
	it("formats properly", () => {
		expect(formatWorkLength(12)).toBe("12m");
		expect(formatWorkLength(59)).toBe("59m");
		expect(formatWorkLength(60)).toBe("1h");
		expect(formatWorkLength(62)).toBe("1h 2m");
		expect(formatWorkLength(123)).toBe("2h 3m");
		expect(formatWorkLength(-5)).toBe("");
		expect(formatWorkLength(0)).toBe("");
	});
});

describe("formatCatalogueName", () => {
	it("formats properly", () => {
		expect(formatCatalogueName("BWV", 12, "m")).toBe("BWV 12m");
		expect(formatCatalogueName("BWV", 12, null)).toBe("BWV 12");
		expect(formatCatalogueName(null, 12, null)).toBe("");
		expect(formatCatalogueName("BWV", 0, null)).toBe("BWV 0");
		expect(formatCatalogueName(null, 0, null)).toBe("");
	});
});

describe("formatWorkName", () => {
	it("formats properly", () => {
		expect(formatWorkName("Symphony", 9, "Great")).toBe("Symphony No. 9 Great");
		expect(formatWorkName("Symphony", 9, null)).toBe("Symphony No. 9");
		expect(formatWorkName("Symphony", null, "Great")).toBe("Symphony Great");
		expect(formatWorkName("", 9, "Great")).toBe("");
	});
});

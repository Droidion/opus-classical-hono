import { describe, expect, it } from "bun:test";
import { centuryEqual, isValidYear } from "./validation";

describe("isValidYear", () => {
	it("identifies valid year", () => {
		expect(isValidYear(500)).toBe(true);
		expect(isValidYear(1000)).toBe(true);
		expect(isValidYear(1234)).toBe(true);
		expect(isValidYear(9999)).toBe(true);
	});
	it("identifies invalid year", () => {
		expect(isValidYear(10000)).toBe(false);
		expect(isValidYear(0)).toBe(false);
		expect(isValidYear(-1)).toBe(false);
		expect(isValidYear(null)).toBe(false);
	});
});

describe("centuryEqual", () => {
	it("returns true for equal centuries", () => {
		expect(centuryEqual(1700, 1799)).toBe(true);
		expect(centuryEqual(1750, 1749)).toBe(true);
	});
	it("returns false for non equal centuries", () => {
		expect(centuryEqual(1699, 1700)).toBe(false);
		expect(centuryEqual(1799, 1800)).toBe(false);
		expect(centuryEqual(1200, 1500)).toBe(false);
		expect(centuryEqual(1, 2)).toBe(false);
	});
});

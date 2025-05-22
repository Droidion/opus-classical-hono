import { describe, expect, it } from "bun:test";
import { getCentury } from "./extracting";

describe("getCentury", () => {
	it("extracts century from 4-digit years", () => {
		expect(getCentury(2023)).toBe("20");
		expect(getCentury(1985)).toBe("19");
		expect(getCentury(1000)).toBe("10");
		expect(getCentury(9999)).toBe("99");
	});

	it("handles 3-digit years", () => {
		expect(getCentury(985)).toBe("98");
		expect(getCentury(123)).toBe("12");
		expect(getCentury(100)).toBe("10");
	});

	it("handles 2-digit years", () => {
		expect(getCentury(85)).toBe("85");
		expect(getCentury(12)).toBe("12");
		expect(getCentury(10)).toBe("10");
	});

	it("handles 1-digit years", () => {
		expect(getCentury(5)).toBe("5");
		expect(getCentury(1)).toBe("1");
		expect(getCentury(9)).toBe("9");
	});

	it("handles year zero", () => {
		expect(getCentury(0)).toBe("0");
	});

	it("handles negative years", () => {
		expect(getCentury(-1)).toBe("-1");
		expect(getCentury(-12)).toBe("-1");
		expect(getCentury(-123)).toBe("-1");
		expect(getCentury(-1985)).toBe("-1");
	});

	it("handles null input", () => {
		expect(getCentury(null)).toBe("nu");
	});

	it("handles edge cases for historical years", () => {
		expect(getCentury(1)).toBe("1"); // Year 1 AD
		expect(getCentury(476)).toBe("47"); // Fall of Western Roman Empire
		expect(getCentury(1066)).toBe("10"); // Norman Conquest
		expect(getCentury(1492)).toBe("14"); // Columbus reaches Americas
		expect(getCentury(1776)).toBe("17"); // American Independence
		expect(getCentury(1969)).toBe("19"); // Moon landing
	});

	it("handles future years", () => {
		expect(getCentury(2100)).toBe("21");
		expect(getCentury(3000)).toBe("30");
		expect(getCentury(10000)).toBe("10");
	});
});

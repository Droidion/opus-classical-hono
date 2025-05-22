import { MAX_VALID_YEAR } from "./constants";
import { getCentury } from "./extracting";

// IsValidYear checks if given string is a 4 digits number, like "1234" (not "-123", "123", or "12345").
export function isValidYear(num: number | null): boolean {
	return num !== null && num > 1 && num <= MAX_VALID_YEAR;
}

// CenturyEqual checks if two given years are of the same century, like 1320 and 1399.
export function centuryEqual(
	year1: number | null,
	year2: number | null,
): boolean {
	if (!isValidYear(year1) || !isValidYear(year2)) {
		return false;
	}

	return getCentury(year1) === getCentury(year2);
}

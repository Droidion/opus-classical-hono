export function getCentury(year: number | null): string {
	return String(year).substring(0, 2);
}

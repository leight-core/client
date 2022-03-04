/**
 * Generate an array of numbers up to the max.
 */
export function NumberRange(max: number) {
	return Array(max).fill(0).map((x, y) => x + y);
}

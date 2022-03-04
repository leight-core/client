export function toHumanNumber(number?: number | null, max = 2): string {
	if (number === null || number === undefined) {
		return "-";
	}
	try {
		return number.toLocaleString(undefined, {
			maximumSignificantDigits: max,
		});
	} catch (e) {
		console.error("toHumanNumber", number, e);
		return number.toFixed(2);
	}
}

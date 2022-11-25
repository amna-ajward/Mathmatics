const CM_TO_PX_OFFSET = 38;

export function convert(callback: (number: number) => number, number: number) {
	return callback(number);
}

export function cmToPx(number: number): number {
	return number * CM_TO_PX_OFFSET;
}

export function pxToCm(number: number): number {
	return number / CM_TO_PX_OFFSET;
}

import { useState } from "react";

type findIntersectionProps = {
	type: INTERSECTION_TYPES;
	shape0: any;
	shape1: any;
};

type arcCordinates = {
	cx: number;
	cy: number;
	radius: number;
};

type lineCordinates = {
	sx: number;
	sy: number;
	ex: number;
	ey: number;
};

const enum INTERSECTION_TYPES {
	ARCARC = "AA",
	LINEARC = "LA",
	LINELINE = "LL",
}

export default function useIntersection() {
	function findIntersection({
		type,
		shape0,
		shape1,
	}: findIntersectionProps): globalThis.CORDINATES[] {
		switch (type) {
			case INTERSECTION_TYPES.LINELINE:
				return findIntersectionLL(shape0, shape1);
				break;
			case INTERSECTION_TYPES.LINEARC:
				return findIntersectionLL(shape0, shape1);
				break;
			case INTERSECTION_TYPES.ARCARC:
				return findIntersectionLL(shape0, shape1);
				break;
			default:
				return [{ x: -1, y: 1 }];
		}
	}

	function findIntersectionLL(
		shape0: lineCordinates,
		shape1: lineCordinates
	): globalThis.CORDINATES[] {
		return [{ x: -1, y: 1 }];
	}

	function findIntersectionLA(
		shape0: lineCordinates,
		shape1: arcCordinates
	): globalThis.CORDINATES[] {
		return [{ x: -1, y: 1 }];
	}

	function findIntersectionAA(
		{ cx: cx0, cy: cy0, radius: r0 }: arcCordinates,
		{ cx: cx1, cy: cy1, radius: r1 }: arcCordinates
	): globalThis.CORDINATES[] {
		let distanceX = cx1 - cx0;
		let distanceY = cy1 - cy0;
		let distance = Math.hypot(cx1 - cx0, cy1 - cy0);

		if (distance > r0 + r1 || distance < Math.abs(r0 - r1))
			//Circles don't overlap
			return [{ x: -1, y: 1 }];

		let a = (r0 * r0 - r1 * r1 + distance * distance) / (2.0 * distance);

		let x2 = cx0 + (distanceX * a) / distance;
		let y2 = cy0 + (distanceY * a) / distance;
		let h = Math.sqrt(r0 * r0 - a * a);

		let offsetX = -distanceY * (h / distance);
		let offsetY = distanceX * (h / distance);

		let ix1 = x2 + offsetX;
		let iy1 = y2 + offsetY;
		let ix2 = x2 - offsetX;
		let iy2 = y2 - offsetY;

		return [
			{ x: ix1, y: iy1 },
			{ x: ix2, y: iy2 },
		];
	}

	return findIntersection;
}

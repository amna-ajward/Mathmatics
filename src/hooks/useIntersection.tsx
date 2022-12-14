import { useState } from "react";
import useUpdateLogger from "./useUpdateLogger";

type intersectionProps = {
	line_tilt?: number;
	shape0: lineCordinates | arcCordinates;
	shape1: lineCordinates | arcCordinates;
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

export default function useIntersection({
	line_tilt,
	shape0,
	shape1,
}: intersectionProps): globalThis.CORDINATES[] {
	function isArc(obj: lineCordinates | arcCordinates): obj is arcCordinates {
		return (obj as arcCordinates).radius !== undefined;
	}

	if (!isArc(shape0) && !isArc(shape1)) return findIntersectionLL();
	if (isArc(shape0) && isArc(shape1)) return findIntersectionAA();
	if ((!isArc(shape0) && isArc(shape1)) || (!isArc(shape1) && isArc(shape0)))
		return findIntersectionLA();

	function findIntersectionLL(): globalThis.CORDINATES[] {
		let { sx: sx0, sy: sy0, ex: ex0, ey: ey0 } = shape0 as lineCordinates;
		let { sx: sx1, sy: sy1, ex: ex1, ey: ey1 } = shape1 as lineCordinates;
		return [{ x: -1, y: 1 }];
	}

	function findIntersectionLA(): globalThis.CORDINATES[] {
		let sp0: lineCordinates = !isArc(shape0)
			? (shape0 as lineCordinates)
			: (shape1 as lineCordinates);
		let sp1: arcCordinates = isArc(shape1)
			? (shape1 as arcCordinates)
			: (shape0 as arcCordinates);

		let { sx, sy, ex, ey } = sp0;
		let { cx, cy, radius } = sp1;

		const tilt: number = line_tilt || 0;

		const horizontal_distance = Math.cos(tilt) * radius;
		const vertical_distance = Math.sin(tilt) * radius;

		var xi = cx + horizontal_distance;
		var yi = cy + vertical_distance;

		//TODO: REDERIVE: SHOULD HAVE 2 intersection points
		return [
			{ x: xi, y: yi },
			{ x: xi, y: yi },
		];
	}

	function findIntersectionAA(): globalThis.CORDINATES[] {
		let { cx: cx0, cy: cy0, radius: r0 } = shape0 as arcCordinates;
		let { cx: cx1, cy: cy1, radius: r1 } = shape1 as arcCordinates;

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

		let ix1 = x2 - offsetX;
		let iy1 = y2 - offsetY;
		let ix2 = x2 + offsetX;
		let iy2 = y2 + offsetY;

		return [
			{ x: ix1, y: iy1 },
			{ x: ix2, y: iy2 },
		];
	}

	return [{ x: -1, y: -1 }];
}

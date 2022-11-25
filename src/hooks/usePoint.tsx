import React, { useState } from "react";
type pointProps = {
	name: string;
	x: number | -1;
	y: number | -1;
	referedAs: string;
	isMark: boolean;
};

export default function usePoint() {
	function setPoint(options: POINT) {
		globalThis.POINTS.push({
			name: options.name,
			x: options.x,
			y: options.y,
			referedAs: options.referedAs,
			isMark: options.isMark,
		});
	}

	function getPoint(
		name: string,
		referedAs?: string | ""
	): [number, number, boolean] {
		const points = globalThis.POINTS;
		let point_coordinates: [number, number, boolean] = [-1, -1, true];
		// console.log("====IN GET POINT FUNC=====");

		// console.log("name: " + name + " referedAs: " + referedAs);
		let founddata: { x: number; y: number; isMark: boolean } = points.find(
			(p) =>
				p.name === name &&
				(referedAs === undefined || p.name[0] !== "i"
					? true
					: p.referedAs === referedAs)
		) || {
			x: -1,
			y: -1,
			isMark: false,
		};
		// console.log(founddata);

		return [founddata.x, founddata.y, founddata.isMark];
	}

	function getPointDistance(point0: string, point1: string): number {
		const points = globalThis.POINTS;

		let point0_x,
			point0_y,
			point1_x,
			point1_y = 0;

		if (points.length > 0) {
			points.map((point) => {
				if (point.name === point0) {
					[point0_x, point0_y] = [point.x, point.y];
				}
				if (point.name === point1) {
					[point1_x, point1_y] = [point.x, point.y];
				}
			});
		}

		return Math.hypot(point1_x - point0_x, point1_y - point0_y);
	}

	return { getPoint, setPoint, getPointDistance };
}

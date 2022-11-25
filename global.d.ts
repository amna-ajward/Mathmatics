import { useState } from "react";

declare global {
	type CORDINATES = {
		x: number;
		y: number;
	};

	type POINT = {
		name: string;
		x: number;
		y: number;
		isMark: boolean;
		referedAs: string;
	};

	type LINE = {
		sname: string;
		ename: string;
		referedAs: string;
	};

	type ARC = {
		cname: string;
		radius: number;
		sa: number;
		ea: number;
		referedAs: string;
	};

	var ctx: CanvasRenderingContext2D | null;
	var POINTS: POINT[];
}
export {};

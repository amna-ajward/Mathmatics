import { POINT } from "./types";

declare global {
	var ctx: CanvasRenderingContext2D | null;
	var POINTS: POINT[];
}

export {};

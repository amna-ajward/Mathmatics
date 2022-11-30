export type CORDINATES = {
	x: number;
	y: number;
};

export type POINT = {
	name: string;
	x: number;
	y: number;
	isMark: boolean;
	referedAs: string;
};

export type LINE = {
	sname: string;
	ename: string;
	referedAs: string;
};

export type ARC = {
	cname: string;
	radius: number;
	sa: number;
	ea: number;
	referedAs: string;
};

export type DrawLineProps = {
	sname: string;
	sx: number;
	sy: number;
	sIsMark: boolean;
	ename: string;
	ex: number;
	ey: number;
	eIsMark: boolean;
	animate: boolean;
};

export type DrawArcProps = {
	command?: string;
	center_name?: string;
	centerX: number;
	centerY: number;
	radius: number;
	start_angle: number;
	end_angle: number;
	current?: number;
	animate: boolean;
};

export type DrawProps = {
	queries: string[];
	canvasDimension: { w: number; h: number };
};

export type AngleProps = [
	line0: string,
	arc_type: string,
	arc_order: number,
	line1?: string
];

export type CanvasProps = {
	width: number;
	height: number;
};

export type Sentence = {
	sentenceID: number;
	absCommand: string[];
	absQuery: string;
	charConverterDefinition: { X: string; Y: string; Z: string };
};

export type CharConverter = {
	X: string;
	Y: string;
	Z: string;
};

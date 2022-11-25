import { useEffect, useState } from "react";
import useLine from "./useLine";
import { convert, cmToPx } from "../utilities/convertUnit";
import usePoint from "./usePoint";
import useArc from "./useArc";
import useIntersection from "./useIntersection";

type drawProps = {
	queries: string[];
	canvasDimension: { w: number; h: number };
};
type getAngleProps = [
	line0: string,
	arc_type: string,
	arc_order: number,
	line1?: string
];
const ANGLE_OFFSETS = {
	pb: [
		{
			start: -Math.PI / 3,
			end: (Math.PI * 2) / 3,
		},
		{
			start: (Math.PI * 2) / 3,
			end: (Math.PI * 2) / 3,
		},
	],
	sa: [
		{
			start: -Math.PI / 2,
			end: (Math.PI * 2) / 3,
		},
		{
			start: -(Math.PI * 3) / 4,
			end: Math.PI / 3,
		},
	],
	ab: [
		{
			start: -Math.PI / 7,
			end: +Math.PI / 7,
		},
		{
			start: 5,
			end: Math.PI / 6,
		},
		{
			start: -Math.PI / 6 - 5,
			end: Math.PI / 6,
		},
	],
};

export default function useDraw() {
	const [stepID, setStepID] = useState(0);
	const [steps, setSteps] = useState<(LINE | ARC)[]>([]);

	const { setPoint, getPoint, getPointDistance } = usePoint();
	const { drawLine } = useLine();
	const { drawArc } = useArc();

	useEffect(() => {
		// setStepID(stepID + 1);
		// console.log("====STEPS======");
		// console.log(steps);
		drawSteps(steps);
	}, [steps]);

	function draw({ queries, canvasDimension }: drawProps) {
		globalThis.ctx!.clearRect(0, 0, canvasDimension.w, canvasDimension.h);
		globalThis.POINTS = [];

		let prevQuery = "";

		setSteps([]);
		setStepID(0);

		queries.map((query) => {
			let [prefix, origin_data, width] = query.split("-");

			let origin = origin_data?.split("~")[0] || "";
			let origin_specific = origin_data?.split("~")[1] || "";

			switch (prefix) {
				case "wdl": {
					//=================WIDTH DEFINED LINE ================//
					if (!origin) return;

					let line_width_px: number = convert(cmToPx, parseInt(width)) || 0;
					let sx: number = canvasDimension.w / 2 - line_width_px;
					let sy: number = canvasDimension.h / 2;
					let ex: number = canvasDimension.w / 2 + line_width_px;
					let ey: number = canvasDimension.h / 2;

					// (sx = 500), (ex = 300), (sy = 200), (ey = 200);
					// (sx = 300), (sy = 300), (ex = 100), (ey = 350);
					(sx = 100), (sy = 300), (ex = 300), (ey = 300); //strainght
					let point0: POINT = {
						name: origin[0],
						x: sx,
						y: sy,
						isMark: true,
						referedAs: query,
					};
					let point1: POINT = {
						name: origin[1],
						x: ex,
						y: ey,
						isMark: true,
						referedAs: query,
					};
					let line: LINE = {
						sname: origin[0],
						ename: origin[1],
						referedAs: query,
					};

					setPoint(point0);
					setPoint(point1);
					setSteps((steps) => [...steps, line]);

					break;
				}

				case "pdl": //=================POINT DEFINED LINE ================//
					// setSteps((steps) => [
					// 	...steps,
					// 	{ id: 2, sx: 30, sy: 30, ex: 100, ey: 200, sname: "d", ename: "d" },
					// ]);
					break;

				case "pb": //================= PERPENDICULAR BISECTOR ================//
					{
						if (!origin) return;

						let [o_start_name, o_end_name] = origin; //Origin is a line
						let [o_startX, o_startY] = getPoint(o_start_name);
						let [o_endX, o_endY] = getPoint(o_end_name);
						let line_width_px = getPointDistance(o_start_name, o_end_name);
						let radius = line_width_px / 1.5;
						let [arc0_startAngle, arc0_endAngle] = getAngle([
							origin,
							prefix,
							0,
						]);
						let [arc1_startAngle, arc1_endAngle] = getAngle([
							origin,
							prefix,
							1,
						]);
						let i = useIntersection({
							shape0: { cx: o_startX, cy: o_startY, radius },
							shape1: { cx: o_endX, cy: o_endY, radius },
						});

						const dx = i[1]?.x - i[0]?.x;
						const dy = i[1]?.y - i[0]?.y;

						const OFFSET_X = 40 * -Math.sign(dx);
						const OFFSET_Y =
							40 * (dx === 0 ? 0 : Math.abs(dy / dx)) * -Math.sign(dy);

						// console.log("dx: " + dx + ", dy: " + dy);
						// console.log("offset-x:", OFFSET_X, " offset-y:", OFFSET_Y);
						let lineOrigin_midpoint: POINT = {
							name: `${origin}m`,
							x: o_startX + (o_endX - o_startX) / 2,
							y: o_startY + (o_endY - o_startY) / 2,
							referedAs: query,
							isMark: false,
						};
						let arc0: ARC = {
							cname: o_start_name,
							radius: radius,
							sa: arc0_startAngle,
							ea: arc0_endAngle,
							referedAs: query,
						};
						let arc1: ARC = {
							cname: o_end_name,
							radius: line_width_px / 1.5,
							sa: arc1_startAngle,
							ea: arc1_endAngle,
							referedAs: query,
						};
						let intersection0: POINT = {
							name: "i0",
							x: i[0]?.x + OFFSET_X,
							y: i[0]?.y + OFFSET_Y,
							referedAs: query,
							isMark: false,
						};
						let intersection1: POINT = {
							name: "i1",
							x: i[1]?.x - OFFSET_X,
							y: i[1]?.y - OFFSET_Y,
							referedAs: query,
							isMark: false,
						};
						let lineBisector: LINE = {
							sname: intersection0.name,
							ename: intersection1.name,
							referedAs: query,
						};

						setPoint(lineOrigin_midpoint);
						setSteps((steps) => [...steps, arc0, arc1]);
						setPoint(intersection0);
						setPoint(intersection1);
						setSteps((steps) => [...steps, lineBisector]);
					}
					break;

				case "sa":
					{
						//================= SIXTY DEGREE ANGLE ================//
						if (!origin) return;

						let saLine_end_name = query.split("-")[2] || "i1";
						let saLine_width = convert(
							cmToPx,
							parseInt(query.split("-")[3]) || 6
						);

						let [o_start_name, o_end_name] = origin;
						let [o_specificX, o_specificY] = getPoint(origin_specific);
						let [o_otherX, o_otherY] = getPoint(
							o_start_name !== origin_specific ? o_start_name : o_end_name
						);
						let radius = 50;
						let [arc0_startAngle, arc0_endAngle] = getAngle([
							origin,
							prefix,
							0,
						]);
						let [arc1_startAngle, arc1_endAngle] = getAngle([
							origin,
							prefix,
							1,
						]);
						let i_la = useIntersection({
							line_tilt: findLineTilt(origin),
							shape0: {
								sx: o_specificX,
								sy: o_specificY,
								ex: o_otherX,
								ey: o_otherY,
							},
							shape1: { cx: o_specificX, cy: o_specificY, radius },
						});
						let i_aa = useIntersection({
							shape0: { cx: o_specificX, cy: o_specificY, radius },
							shape1: { cx: i_la[0].x, cy: i_la[0].y, radius },
						});

						const dx = i_aa[0].x - o_specificX;
						const dy = i_aa[0].y - o_specificY;
						const di1 = Math.hypot(dx, dy);

						let saLine_x = (saLine_width * dx) / di1 + o_specificX;
						let saLine_y = (saLine_width * dy) / di1 + o_specificY;

						let arc0: ARC = {
							cname: origin_specific,
							radius: radius,
							sa: arc0_startAngle,
							ea: arc0_endAngle,
							referedAs: query,
						};
						let intersection0: POINT = {
							name: "i0",
							x: i_la[0]?.x,
							y: i_la[0]?.y,
							referedAs: query,
							isMark: false,
						};
						let arc1: ARC = {
							cname: intersection0.name,
							radius: radius,
							sa: arc1_startAngle,
							ea: arc1_endAngle,
							referedAs: query,
						};
						let intersection1: POINT = {
							name: saLine_end_name,
							x: saLine_x,
							y: saLine_y,
							referedAs: query,
							isMark: saLine_end_name !== "i1" ? true : false,
						};
						let line: LINE = {
							sname: origin_specific,
							ename: intersection1.name,
							referedAs: query,
						};

						setPoint(intersection0);
						setPoint(intersection1);
						setSteps((steps) => [...steps, arc0]);
						setSteps((steps) => [...steps, arc1]);
						setSteps((steps) => [...steps, line]);
					}
					break;
				case "trw": //==================TRIANGLE=====================//
					{
						//e.g. tr-ABC-AC-5-BC-3
						if (!origin) return;

						const triangle_name: string = origin;
						const [pnt1_name, pnt2_name, pnt3_name]: string[] =
							origin.split("");
						const [pnt1_x, pnt1_y] = getPoint(pnt1_name);
						const [pnt2_x, pnt2_y] = getPoint(pnt2_name);
						const [pnt3_x, pnt3_y] = getPoint(pnt3_name);

						origin;
					}
					break;

				case "ab":
					{
						//================= ANGLE BISECTOR ================//
						if (!origin) return;

						origin = origin.split("^")[1]; //An angle
						let [first, origin_specific, last] = origin.split("");
						if (first > last) {
							let temp = first;
							first = last;
							last = temp;
						}

						let line0_name = origin_specific + first;
						let line1_name = origin_specific + last;

						let [o_specificX, o_specificY] = getPoint(origin_specific);
						let [line0_endX, line0_endY] = getPoint(line0_name[1]);
						let [line1_endX, line1_endY] = getPoint(line1_name[1]);
						let [arc0_startAngle, arc0_endAngle] = getAngle([
							line0_name,
							prefix,
							0,
							line1_name,
						]);
						let [arc1_startAngle, arc1_endAngle] = getAngle([
							line0_name,
							prefix,
							1,
						]);
						let [arc2_startAngle, arc2_endAngle] = getAngle([
							line0_name,
							prefix,
							2,
							line1_name,
						]);
						let radius = 70;
						let i_la0 = useIntersection({
							line_tilt: findLineTilt(line0_name),
							shape0: {
								sx: o_specificX,
								sy: o_specificY,
								ex: line0_endX,
								ey: line0_endY,
							},
							shape1: { cx: o_specificX, cy: o_specificY, radius: radius },
						})[0];
						let i_la1 = useIntersection({
							line_tilt: findLineTilt(line1_name),
							shape0: {
								sx: o_specificX,
								sy: o_specificY,
								ex: line1_endX,
								ey: line1_endY,
							},
							shape1: { cx: o_specificX, cy: o_specificY, radius: radius },
						})[0];
						let i_aa = useIntersection({
							shape0: { cx: i_la0.x, cy: i_la0.y, radius: radius },
							shape1: { cx: i_la1.x, cy: i_la1.y, radius: radius },
						})[1];

						let dx = i_aa.x - o_specificX;
						let dy = i_aa.y - o_specificY;
						const OFFSET_VALUE = 70;
						const OFFSET_X = OFFSET_VALUE * -Math.sign(dx);
						const OFFSET_Y =
							OFFSET_VALUE *
							(dx === 0 ? 1 : Math.abs(dy / dx)) *
							-Math.sign(dy);
						let arc0: ARC = {
							cname: origin_specific,
							sa: arc0_startAngle,
							ea: arc0_endAngle,
							radius: radius,
							referedAs: query,
						};
						let intersection0: POINT = {
							name: "i0",
							x: i_la0.x,
							y: i_la0.y,
							isMark: false,
							referedAs: query,
						};
						let intersection1: POINT = {
							name: "i1",
							x: i_la1.x,
							y: i_la1.y,
							isMark: false,
							referedAs: query,
						};
						let arc1: ARC = {
							cname: intersection0.name,
							sa: arc1_startAngle,
							ea: arc1_endAngle,
							radius: radius,
							referedAs: query,
						};
						let arc2: ARC = {
							cname: intersection1.name,
							sa: arc2_startAngle,
							ea: arc2_endAngle,
							radius: radius,
							referedAs: query,
						};

						let intersection2: POINT = {
							name: "i2",
							x: i_aa.x - OFFSET_X,
							y: i_aa.y - OFFSET_Y,
							isMark: false,
							referedAs: query,
						};

						let ab_line: LINE = {
							sname: origin_specific,
							ename: intersection2.name,
							referedAs: query,
						};

						setPoint(intersection0);
						setPoint(intersection1);
						setPoint(intersection2);
						setSteps((steps) => [...steps, arc0]);
						setSteps((steps) => [...steps, arc1]);
						setSteps((steps) => [...steps, arc2]);
						setSteps((steps) => [...steps, ab_line]);
					}
					break;
				default:
					console.log("WARNING: Command Not found");
					break;
			}

			prevQuery = query;
		});

		console.log("--POINTS--");
		console.log(globalThis.POINTS);
	}

	function drawSteps(steps) {
		// console.log("===Drawing Calls==== ");
		steps.map((step) => {
			if (isArc(step)) {
				let [cx, cy] = getPoint(step.cname, step.referedAs);
				drawArc({
					center_name: step.cname,
					radius: step.radius,
					start_angle: step.sa,
					end_angle: step.ea,
					centerX: cx,
					centerY: cy,
				});
			} else {
				let [sx, sy, sIsMark] = getPoint(step.sname, step.referedAs);
				let [ex, ey, eIsMark] = getPoint(step.ename, step.referedAs);

				drawLine({
					sname: step.sname,
					ename: step.ename,
					sx,
					sy,
					ex,
					ey,
					sIsMark,
					eIsMark,
				});
			}
		});
	}

	function isArc(obj: ARC | LINE): obj is ARC {
		return (obj as ARC).radius !== undefined;
	}

	function findLineTilt([pnt0, pnt1]: string): number {
		const [sx, sy] = getPoint(pnt0);
		const [ex, ey] = getPoint(pnt1);
		if ((sx | sy | ex | ey) === -1) return -1;

		const distance = Math.hypot(ex - sx, ey - sy);
		const tilt_angle = Math.asin((ey - sy) / distance);

		if (Math.sign(ex - sx) === -1 && Math.sign(ey - sy) === -1) {
			return Math.PI + Math.abs(tilt_angle);
		} else if (Math.sign(ex - sx) === -1) {
			return Math.PI - Math.abs(tilt_angle);
		} else if (Math.sign(ey - sy) === -1) {
			return 2 * Math.PI - Math.abs(tilt_angle);
		} else return tilt_angle;
	}

	function getAngle([
		line0,
		arc_type,
		arc_order,
		line1,
	]: getAngleProps): number[] {
		let start_angle_offset,
			end_angle_offset = 0;

		for (const [key, value] of Object.entries(ANGLE_OFFSETS)) {
			if (key === arc_type) {
				let { start, end } = value[arc_order];
				start_angle_offset = start;
				end_angle_offset = end;
				break;
			}
		}

		let start_angle = findLineTilt(line0) + start_angle_offset;
		let end_angle = start_angle + end_angle_offset;

		if (arc_type === "ab" && line1 !== undefined) {
			switch (arc_order) {
				case 0:
					let line0_tilt = findLineTilt(line0);
					let line1_tilt = findLineTilt(line1);
					if (
						line0_tilt > line1_tilt ||
						Math.abs(line1_tilt - line0_tilt) > Math.PI
					) {
						let temp = line0;
						line0 = line1;
						line1 = temp;
					}
					start_angle = findLineTilt(line0) + start_angle_offset;
					end_angle = findLineTilt(line1) + end_angle_offset;
					break;
				case 2:
					start_angle = findLineTilt(line1) + start_angle_offset;
					end_angle = start_angle + end_angle_offset;
					break;
				default:
					break;
			}
		}

		return [start_angle, end_angle];
	}

	return [draw];
}

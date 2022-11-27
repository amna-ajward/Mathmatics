import usePoint from "./usePoint";

type drawArcProps = {
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

export default function useArc() {
	const { setPoint } = usePoint();

	// function drawArc({
	// 	centerX: cx,
	// 	centerY: cy,
	// 	radius,
	// 	start_angle: sa,
	// 	end_angle: ea,
	// }: drawArcProps) {
	// 	let c = globalThis.ctx;
	// 	debugger;
	// 	c!.beginPath();
	// 	c!.arc(cx, cy, radius, sa, ea);
	// 	c!.stroke();
	// }



	// function drawArc({
	// 	centerX: cx,
	// 	centerY: cy,
	// 	radius,
	// 	start_angle: sa,
	// 	end_angle: ea,
	// }: drawArcProps) {
	// 	let c = globalThis.ctx;
	// 	debugger;
	// 	c!.beginPath();
	// 	c!.stroke();
	// }

	function drawArc({
		centerX,
		centerY,
		radius,
		start_angle,
		end_angle,
		current,
		animate
	}: drawArcProps) {
		let c = globalThis.ctx;

		if (animate) {
			let currentAngel = current ? current : start_angle;
			c!.beginPath();
			c!.arc(centerX, centerY, radius, start_angle, currentAngel);
			c!.stroke();
			currentAngel += 0.030
			if (currentAngel < end_angle) {
				window.requestAnimationFrame(() =>
					drawArc({ centerX, centerY, radius, start_angle, end_angle, current: currentAngel, animate: true })
				);
			}
		} else {
			c.beginPath();
			c!.arc(centerX, centerY, radius, start_angle, end_angle);
			c.stroke();
		}
	}



	return { drawArc };
}

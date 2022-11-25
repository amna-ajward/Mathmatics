import usePoint from "./usePoint";

type drawArcProps = {
	command?: string;
	center_name: string;
	centerX: number;
	centerY: number;
	radius: number;
	start_angle: number;
	end_angle: number;
};

export default function useArc() {
	const { setPoint } = usePoint();

	function drawArc({
		centerX: cx,
		centerY: cy,
		radius,
		start_angle: sa,
		end_angle: ea,
	}: drawArcProps) {
		let c = globalThis.ctx;

		c!.beginPath();
		c!.arc(cx, cy, radius, sa, ea);
		c!.stroke();
	}

	return { drawArc };
}

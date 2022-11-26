import usePoint from "./usePoint";

type drawLineProps = {
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

export default function useLine() {
	const { setPoint } = usePoint();

	function drawLine({
		sname,
		ename,
		sx,
		sy,
		ex,
		ey,
		sIsMark,
		eIsMark,
		animate ,
	}: drawLineProps) {
		let c = globalThis.ctx;
		console.log('animate',animate);
		
		c!.beginPath();
		c!.font = "30px Arial";
		c!.textAlign = "center";
		c!.textBaseline = "middle";
		c.lineWidth = 0.5;
		const maxI = 20;
		let i = 0;
		let amount = 0;
		if (!animate) {
			c!.moveTo(sx, sy);
			c!.lineTo(ex, ey);
			c!.stroke();
		} else {
			const myInterval = setInterval(function () {
				if (i >= maxI) clearInterval(myInterval);
				amount += 0.05;
				c.moveTo(sx, sy);
				c.lineTo(sx + (ex - sx) * amount, sy + (ey - sy) * amount);
				c.stroke();
				i += 1;

			}, 30);
		}




		if (sIsMark) c!.fillText(sname, sx, sy);
		if (eIsMark) c!.fillText(ename, ex, ey);
	}

	// function getLineEdges(line_name: string): string[] {
	// 	let pt0 = "";
	// 	let pt1 = "";

	// 	switch (line_name.length) {
	// 		case 2:
	// 			[pt0, pt1] = line_name;
	// 			break;
	// 		case 3:
	// 			// i are ummarked points
	// 			if (line_name[0] === "i") {
	// 				pt0 = line_name.substring(0, 2);
	// 				pt1 = line_name.substring(2);
	// 			} else {
	// 				pt0 = line_name.substring(0, 1);
	// 				pt1 = line_name.substring(1);
	// 			}
	// 			break;
	// 		case 4:
	// 			pt0 = line_name.substring(0, 2);
	// 			pt1 = line_name.substring(2);
	// 			break;
	// 		default:
	// 			console.log("WARNING: Invalid line");
	// 			break;
	// 	}

	// 	return [pt0, pt1];
	// }

	return { drawLine };
}

import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Button } from "react-bootstrap";
import useDraw from "../hooks/useDraw";
import useUpdateLogger from "../hooks/useUpdateLogger";

type CanvasProps = {
	width: number;
	height: number;
};

export default function Canvas({ width, height }: CanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
	const [draw] = useDraw();

	const [queries, setQueries] = useState<string[]>([
		// "wdl-AB-3",
		// // "pb-AB",
		// "sa-AB~A-C-4",
		// "ab-^CAB",

		//triangle 3 length given
		"wdl-AB-4", //Must to bring the drawing to center of the canvas
		"trw-ABC-AC-5-BC-4",

		//triangle 1 angle & 1 length given
		// "tra-ABC-^ABC-90-AC-6",

		// "c-C-AC",
		"px-AB~C",
	]);

	useEffect(() => {
		if (canvasRef.current) {
			canvasCtxRef.current = canvasRef.current.getContext("2d");
			globalThis.ctx = canvasCtxRef.current;
		}
	}, []);

	const canvasDimension = { w: width, h: height };
	return (
		<>
			<Button
				onClick={() =>
					draw({
						queries: queries,
						canvasDimension: canvasDimension,
					})
				}
			>
				Canvas Run
			</Button>
			<canvas ref={canvasRef} width={width} height={height}></canvas>
		</>
	);
}

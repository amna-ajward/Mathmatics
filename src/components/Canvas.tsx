import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Button } from "react-bootstrap";
import useDraw from "../hooks/useDraw";

type CanvasProps = {
	width: number;
	height: number;
};

export default function Canvas({ width, height }: CanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
	const [draw] = useDraw();

	const [queries, setQueries] = useState<string[]>([
		"wdl-AB-3",
		"pb-AB",
		"sa-AB~A-C-4",
		// // "ab-^CAB",

		//triangle 3 length given
		// "wdl-AB-4", //Must to bring the drawing to center of the canvas
		// "trw-ABC-AC-5-BC-4",

		//triangle 1 angle & 1 length given
		// "tra-ABC-^ABC-90-AC-6",

		// "c-C-AC",
		// "px-AB~C",
	]);
	const [currentStep, setCurrentStep] = useState(queries.length);

	useEffect(() => {
		if (canvasRef.current) {
			canvasCtxRef.current = canvasRef.current.getContext("2d");
			globalThis.ctx = canvasCtxRef.current;
		}
	}, []);

	useEffect(() => {
		draw({
			queries: queries.slice(0, currentStep),
			canvasDimension: canvasDimension,
		});
	}, [currentStep]);

	const canvasDimension = { w: width, h: height };

	const onDraw = () =>
		draw({
			queries: queries,
			canvasDimension: canvasDimension,
		});

	return (
		<div>
			<canvas ref={canvasRef} width={width} height={height}></canvas>
			<div style={{ display: "flex", justifyContent: "space-evenly" }}>
				<Button onClick={onDraw}>Canvas Run</Button>
				<Button
					disabled={currentStep == 1}
					onClick={() => setCurrentStep(currentStep - 1)}
				>
					Previous step
				</Button>
				<Button
					disabled={currentStep == queries.length}
					onClick={() => setCurrentStep(currentStep + 1)}
				>
					Next step
				</Button>
			</div>
		</div>
	);
}

import React, { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import { Button } from "react-bootstrap";
import useDraw from "../hooks/useDraw";
import { StepsList } from "./StepsList";
import { CanvasProps } from "../types/types";
import { DrawContext, useDrawContext } from "../context/DrawContextProvider";

export default function Canvas({ width, height }: CanvasProps) {
	const { onDraw, queries, currentStep, setCurrentStep } = useDrawContext();
	
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// const { draw } = useDraw();
	// const [queries, setQueries] = useState<string[]>([
	// 	"wdl-AB-3",
	// 	"pb-AB",
	// 	"sa-AB~A-C-4",
	// 	"ab-^CAB",

	// 	// //triangle 3 length given
	// 	//  "wdl-AB-4", //Must to bring the drawing to center of the canvas
	// 	//  "trw-ABC-AC-5-BC-4",

	// 	// //triangle 1 angle & 1 length given
	// 	//  "tra-ABC-^ABC-90-AC-6",

	// 	// "c-C-AC",
	// 	// "px-AB~C",
	// ]);
	// const [currentStep, setCurrentStep] = useState(1);

	// useEffect(() => {
	// 	draw({
	// 		queries: queries.slice(0, currentStep),
	// 		canvasDimension: canvasDimension,
	// 	});
	// }, [currentStep]);

	// const canvasDimension = { w: width, h: height };

	// const onDraw = () =>
	// 	draw({
	// 		queries: queries,
	// 		canvasDimension: canvasDimension,
	// 	});

	useEffect(() => {
		if (canvasRef.current) {
			globalThis.ctx = canvasRef.current.getContext("2d");
		}
	}, []);

	console.log("queries", queries, currentStep, canvasRef);

	return (
		<div>
			<div style={{ display: "flex" }}>
				<div style={{ flex: "1" }}>
					<StepsList
						steps={queries}
						currentStep={currentStep}
						onStepClick={(step) => setCurrentStep(step)}
					/>
				</div>
				<div style={{ flex: "1" }}>
					<canvas
						ref={canvasRef}
						width={width}
						height={height}
						id="canvas"
					></canvas>
				</div>
			</div>
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

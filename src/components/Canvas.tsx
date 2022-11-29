import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Button } from "react-bootstrap";
import useDraw from "../hooks/useDraw";
import { StepsList } from "./StepsList";
import { useDrawContext } from "../context/drawContext";
import { CanvasProps } from "../types/types";

export default function Canvas({ width, height }: CanvasProps) {
	const { onDraw, queries, currentStep, setCurrentStep } = useDrawContext();
	const canvasRef = useRef<HTMLCanvasElement>(null);

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

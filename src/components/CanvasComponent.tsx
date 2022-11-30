import React, { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import { Button } from "react-bootstrap";
import useDraw from "../hooks/useDraw";
import { StepsList } from "./StepsList";
import { CanvasProps } from "../types/types";
import { DrawContext, useDrawContext } from "../context/DrawContextProvider";

export default function Canvas() {
	const { onDraw, queries, currentStep, setCurrentStep, canvasRef } =
		useDrawContext();

	// useEffect(() => {
	// 	if (canvasRef.current) {
	// 		// globalThis.ctx = canvasRef.current.getContext("2d");
	// 		console.log("canvasRef canvas", canvasRef);
	// 	}
	// }, []);

	// console.log("globalThis.ctx", globalThis.ctx);
	console.log("canvasRef abc", canvasRef.current);
	console.log("canvasRef bbc", canvasRef.current?.getContext("2d"));

	// console.log("queries", queries, currentStep, canvasRef);

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
						width={840}
						height={540}
						id="canvas"
						onClick={() => {
							console.log("canvasRef abc inside", canvasRef.current);
							console.log(
								"canvasRef bbc inside",
								canvasRef.current?.getContext("2d")
							);
						}}
					></canvas>
				</div>
			</div>
			<div style={{ display: "flex", justifyContent: "space-evenly" }}>
				<Button onClick={() => onDraw(["test", "run", "solution"])}>
					Canvas Run
				</Button>
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

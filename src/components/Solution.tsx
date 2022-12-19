import React, { useRef, useEffect } from "react";
import { useDrawContext } from "../context/DrawContextProvider";
import Canvas from "./CanvasComponent";
import { StepsList } from "./StepsList";
export default function Solution() {
	const { onDraw, queries, currentStep, setCurrentStep, canvasRef, stepDesc } =
		useDrawContext();
	return (
		<>
			<div style={{ display: "flex", flexDirection: "row" }}>
				<div style={{ flex: "1" }} className="steps">
					<h3 style={{ textAlign: "center" }}>Steps</h3>
					<StepsList
						steps={stepDesc}
						currentStep={currentStep}
						onStepClick={(step) => setCurrentStep(step)}
					/>
				</div>
				<div>
					<h2 style={{ textAlign: "center", flex: "1" }}>Solution</h2>
					<Canvas />
				</div>
			</div>
		</>
	);
}

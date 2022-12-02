import React, { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import { Button } from "react-bootstrap";
import useDraw from "../hooks/useDraw";
import { StepsList } from "./StepsList";
import { CanvasProps } from "../types/types";
import { DrawContext, useDrawContext } from "../context/DrawContextProvider";

export default function Canvas() {
	const { onDraw, queries, currentStep, setCurrentStep, canvasRef, stepDesc } =
		useDrawContext();

	return (
		<div>
			<div style={{ display: "flex" }}>
				<div style={{ flex: "1" }}>
					<canvas ref={canvasRef} width={840} height={540} id="canvas"></canvas>
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

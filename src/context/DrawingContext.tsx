import React from "react";
import { createContext, ReactNode, useContext, useRef, useState } from "react";
import useLine from "../hooks/useLine";

type DrawingProps = {
	canvasCtxRef: React.MutableRefObject<CanvasRenderingContext2D | null>;
	draw: () => void;
	enterCommands: (commands: string[]) => void;
};

type DrawingProviderProps = {
	children: ReactNode;
};

const drawingContext = createContext({} as DrawingProps);

function useDrawing() {
	return useContext(drawingContext);
}

function DrawingProvider({ children }: DrawingProviderProps) {
	const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

	const [commands, setCommands] = useState<string[]>(["wdl-AB", "pb-AB"]);
	const [drawWidthDefined, drawPointDefined] = useLine();

	function enterCommands(commands: string[]) {
		setCommands(() => commands);
	}

	function draw() {
		let ctx = canvasCtxRef?.current;

		if (ctx === (undefined || null)) return;

		commands.map((command) => {
			drawPointDefined(10, 10);
			console.log(command);
		});

		ctx!.beginPath(); // Note the Non Null Assertion
		ctx!.arc(95, 50, 40, 0, 2 * Math.PI);
		ctx!.stroke();
	}

	return (
		<drawingContext.Provider value={{ canvasCtxRef, draw, enterCommands }}>
			{children}
		</drawingContext.Provider>
	);
}

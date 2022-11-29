// import React, {
// 	createContext,
// 	ReactNode,
// 	useContext,
// 	useEffect,
// 	useRef,
// 	useState,
// } from "react";
// import useDraw from "../hooks/useDraw";
// import { CanvasProps, POINT } from "../types/types";

// type drawProviderProps = {
// 	children: ReactNode;
// };

// type DrawProps = {
// 	queries: string[];
// 	currentStep: number;
// 	setCurrentStep: Function;
// 	onDraw: () => void;
// };

// export const DrawContext = createContext<DrawProps>({

// } as DrawProps);

// export function useDrawContext() {
// 	const context = useContext(DrawContext);
// 	return { ...context };
// }

// export function DrawProvider({ children }: drawProviderProps) {
// 	const width = document.querySelector(".canvas")?.clientWidth as number;
// 	const height = document.querySelector(".canvas")?.clientHeight as number;
// 	const { draw } = useDraw();
// 	const [queries, setQueries] = useState<string[]>([
// 		"wdl-AB-3",
// 		"pb-AB",
// 		"sa-AB~A-C-4",
// 		"ab-^CAB",

// 		// //triangle 3 length given
// 		//  "wdl-AB-4", //Must to bring the drawing to center of the canvas
// 		//  "trw-ABC-AC-5-BC-4",

// 		// //triangle 1 angle & 1 length given
// 		//  "tra-ABC-^ABC-90-AC-6",

// 		// "c-C-AC",
// 		// "px-AB~C",
// 	]);
// 	const [currentStep, setCurrentStep] = useState(1);

// 	useEffect(() => {
// 		draw({
// 			queries: queries.slice(0, currentStep),
// 			canvasDimension: canvasDimension,
// 		});
// 	}, [currentStep]);

// 	const canvasDimension = { w: width, h: height };

// 	const onDraw = () =>
// 		draw({
// 			queries: queries,
// 			canvasDimension: canvasDimension,
// 		});

// 	return (
// 		<DrawContext.Provider
// 			value={{
// 				queries: queries,
// 				currentStep: currentStep,
// 				setCurrentStep: setCurrentStep,
// 				onDraw: onDraw,
// 			}}
// 		>
// 			{children}
// 		</DrawContext.Provider>
// 	);
// }

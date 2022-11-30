import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import useDraw from "../hooks/useDraw";
import { POINT } from "../types/types";

type ContextType = {
	queries: string[];
	currentStep: number;
	setCurrentStep: (value: number) => void;
	onDraw: (value: string[]) => void;
	// point: POINT[];
	setPoint: (value: POINT) => void;
	getPoint: (name: string, referedAs?: string) => [number, number, boolean];
	getPointDistance: (string0: string, string1: string) => number;
	canvasRef: React.RefObject<HTMLCanvasElement>;
};

export const DrawContext = createContext<ContextType>({} as ContextType);

export const useDrawContext = () => {
	const context = useContext(DrawContext);
	return { ...context };
};

export const DrawContextProvider = ({ children }) => {
	const width = document.querySelector("canvas")?.clientWidth as number;
	const height = document.querySelector("canvas")?.clientHeight as number;

	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [points, setPoints] = useState<POINT[]>([]);
	const { draw } = useDraw({ setPoint, getPoint, getPointDistance, canvasRef });

	const [queries, setQueries] = useState<string[]>([]);
	const [currentStep, setCurrentStep] = useState<number>(0);
	const onDraw = (commands: string[]) => {
		points.length = 0;
		setQueries(commands);
		draw({
			queries: commands,
			canvasDimension: { w: width, h: height },
		});
	};

	useEffect(() => {
		draw({
			queries: queries.slice(0, currentStep),
			canvasDimension: { w: width, h: height },
		});
	}, [currentStep]);

	function setPoint(options: POINT) {
		points.push({
			name: options.name,
			x: options.x,
			y: options.y,
			referedAs: options.referedAs,
			isMark: options.isMark,
		});
		setPoints([...points]);
	}

	function getPoint(
		name: string,
		referedAs?: string | ""
	): [number, number, boolean] {
		let point_coordinates: [number, number, boolean] = [-1, -1, true];

		// console.log("name: " + name + " referedAs: " + referedAs);
		let founddata: { x: number; y: number; isMark: boolean } = points.find(
			(p) =>
				p.name === name &&
				(referedAs === undefined || p.name[0] !== "i"
					? true
					: p.referedAs === referedAs)
		) || {
			x: -1,
			y: -1,
			isMark: false,
		};
		// console.log(founddata);

		return [founddata.x, founddata.y, founddata.isMark];
	}

	function getPointDistance(point0: string, point1: string): number {
		let point0_x = 0;
		let point0_y = 0;
		let point1_x = 0;
		let point1_y = 0;

		if (points.length > 0) {
			points.map((point) => {
				if (point.name === point0) {
					[point0_x, point0_y] = [point.x, point.y];
				}
				if (point.name === point1) {
					[point1_x, point1_y] = [point.x, point.y];
				}
			});
		}

		return Math.hypot(point1_x - point0_x, point1_y - point0_y);
	}
	console.log("points", points);

	return (
		<DrawContext.Provider
			value={{
				queries,
				currentStep,
				setCurrentStep,
				onDraw,
				// points,
				getPoint,
				setPoint,
				getPointDistance,
				canvasRef,
			}}
		>
			{children}
		</DrawContext.Provider>
	);
};

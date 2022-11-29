import { useContext } from "react";
import { Button } from "react-bootstrap";
// import { useDrawing } from "../context/DrawingContext";
import { useDrawContext } from "../context/DrawContextProvider";

export default function Question() {
	const{onDraw} = useDrawContext();
	return (
		<>
			Question
			<Button onClick={() => onDraw()}>Solve</Button>
		</>
	);
}

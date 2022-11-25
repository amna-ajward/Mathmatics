import { Button } from "react-bootstrap";
import { useDrawing } from "../context/DrawingContext";

export default function Question() {
	return (
		<>
			Question
			<Button onClick={() => console.log("solve")}>Solve</Button>
		</>
	);
}

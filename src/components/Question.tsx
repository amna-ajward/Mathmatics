import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { useDrawContext } from "../context/DrawContextProvider";
import { useQuery } from "../hooks/useQuery";

export default function Question() {
	const { onDraw } = useDrawContext();
	const [question, setQuestion] = useState("");

	const tempQ =
		"Construct the triangle ABC such that AB = 6 cm, ^ ABC=60 deg and BC = 6 cm"; //Construct a semicircle with diameter AB and label its center as C";

	const queryCommands: string[] = useQuery(tempQ);
	// const queryCommands: string[] = useQuery(question);
	console.log("queryCommands", queryCommands);

	return (
		<>
			<h2>Question</h2>
			<pre>
				* Use deg to refer degrees. E.g. 60deg.
				<br />* Use ^ to refer angles. E.g. ^ABC to refer an angle at B.
			</pre>
			<textarea
				placeholder="Write your question here..."
				value={question}
				onChange={(e) => setQuestion(e.target.value)}
			/>
			<Button onClick={() => onDraw(["wdl-AB-3", "pb-AB"])}>Solve</Button>
		</>
	);
}

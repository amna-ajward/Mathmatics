import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { useDrawContext } from "../context/DrawContextProvider";
import { useQuery } from "../hooks/useQuery";

export default function Question() {
	const { onDraw, setStepDesc } = useDrawContext();
	const [question, setQuestion] = useState("");

	const tempQ =
		"Construct the triangle ABC such that AB = 6.5 cm, ^ ABC=60 deg and BC = 6.0 cm. Construct the perpendicular bisector of AB.";

	const { commands: queryCommands, steps } = useQuery(question);

	useEffect(() => setStepDesc(steps), [question]);

	return (
		<Container>
			<Row>
				<h2>Question</h2>
				<pre>
					* Use deg to refer degrees. E.g. 60deg.
					<br />* Use ^ to refer angles. E.g. ^ABC to refer an angle at B.
				</pre>
				<textarea
					maxLength={500}
					minLength={50}
					placeholder="Write your question here..."
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
				/>
				<Button onClick={() => onDraw(queryCommands)}>Solve</Button>
			</Row>
		</Container>
	);
}

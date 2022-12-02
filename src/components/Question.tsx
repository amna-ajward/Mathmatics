import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { useDrawContext } from "../context/DrawContextProvider";
import { useQuery } from "../hooks/useQuery";

export default function Question() {
	const { onDraw, setStepDesc } = useDrawContext();
	const [question, setQuestion] = useState("");

	const tempQ =
		"Construct the triangle ABC such that AB = 6.5 cm, ^ ABC=60 deg and BC = 6.0 cm. Construct the perpendicular bisector of AB.";

	const { commands: queryCommands, steps } = useQuery(
		// "Construct a straight line segment AB of length 9.0cm and its perpendicular bisector"
		//"2.	Construct the triangle ABC such that AB=8.5cm, ^ABC=60deg and BC=8.5cm"
		//"2.	Construct a straight-line segment AC of length 6cm and construct the line AB such that ^CAB = 60deg"
		"1.	Construct the triangle ABC such that AB=8.5cm, ^ABC=60deg and BC=8.5cm. 2.	Construct the bisector of ^ABC, Name the point at which it meets AC as D"
	);

	useEffect(() => setStepDesc(steps), [question]);

	return (
		<Container>
			<Row>
				<h2>Question</h2>
				<pre>
					***Use <b>deg</b> to refer degrees. E.g. 60deg.
					<br />
					***Use <b>^</b> to refer angles. E.g. ^ABC to refer an angle at B.
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

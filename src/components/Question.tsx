import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { useDrawContext } from "../context/DrawContextProvider";
import { useQuery } from "../hooks/useQuery";
import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";

export default function Question() {
	const { onDraw, setStepDesc } = useDrawContext();
	const [question, setQuestion] = useState("");

	const tempQ =
		"Construct the triangle ABC such that AB = 6.5 cm, ^ ABC=60 deg and BC = 6.0 cm. Construct the perpendicular bisector of AB.";

	const { commands: queryCommands, steps } = useQuery(
		// "Construct a straight line segment AB of length 9.0cm and its perpendicular bisector"
		//"2.	Construct the triangle ABC such that AB=8.5cm, ^ABC=60deg and BC=8.5cm"
		//"2.	Construct a straight-line segment AC of length 6cm and construct the line AB such that ^CAB = 60deg"
		// "1.	Construct the triangle ABC such that AB=8.5cm, ^ABC=60deg and BC=8.5cm. 2.	Construct the bisector of ^ABC, Name the point at which it meets AC as D"
		// "1.	Construct a straight-line segment AC of length 6cm and construct the line AB such that ^CAB = 60deg. 2.	Construct the angle bisector of ^CAB"
		// "1.	Construct a straight line segment AB of length 9.0cm and its perpendicular bisector.2.	Construct a semicircle with diameter AB and label its center as C.3.	Mark the point P on the semicircle such that AP is equal to the radius of the semicircle, and draw the triangle APB."
		"1.	Construct the triangle ABC such that AB=8.5cm, ^ABC=60deg and BC=8.5cm. 2.	Construct the bisector of ^BAC, Name the point at which it meets BC as D. 3.	Find the center of the circle that has BD as a diameter and construct this circle."
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
				<GrammarlyEditorPlugin clientId="client_1eAg6ZxFzV1D5qUzafDapk">
					<textarea
						style={{ width: "100%" }}
						maxLength={500}
						minLength={50}
						placeholder="Write your question here..."
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
					/>
				</GrammarlyEditorPlugin>
				<Button onClick={() => onDraw(queryCommands)}>Solve</Button>
			</Row>
		</Container>
	);
}

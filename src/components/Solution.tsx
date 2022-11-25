import React, { useRef, useEffect } from "react";
import Canvas from "./Canvas";
export default function Solution() {
	return (
		<div style={{textAlign:'center'}}>
			<h2>Solution</h2>
			<Canvas width={840} height={540} />
		</div>
	);
}

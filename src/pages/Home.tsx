import React from "react";
import Question from "../components/Question";
import Solution from "../components/Solution";
import { DrawContextProvider } from "../context/DrawContextProvider";

export default function Home() {
	return (
		<DrawContextProvider>
			<Question />
			<Solution />
		</DrawContextProvider>
	);
}

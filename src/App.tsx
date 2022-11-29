import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./app.css";
import { DrawProvider } from "./context/DrawContext";
import React from "react";

function App() {
	return (
		<>
			<DrawProvider>
				<Container>
					<Routes>
						<Route path="/" element={<Home />} />
					</Routes>
				</Container>
			</DrawProvider>
		</>
	);
}

export default App;

import React from "react";

export const StepsList = ({ steps, currentStep, onStepClick }) => {
	return (
		<div className="step-list ">
			{steps.map((step, i) => (
				<div
					key={i}
					onClick={() => onStepClick(i + 1)}
					className={`card ${currentStep - 1 == i ? "active" : ""} `}
					style={{ width: "100%" }}
				>
					<div className="container d-flex gap-2">
						<h6>Step {i + 1}</h6>
						<p>{step}</p>
					</div>
				</div>
			))}
		</div>
	);
};

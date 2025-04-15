type StepProps = {
	activeStep: number;
	step: number;
	children: React.ReactNode;
};

const Step = ({ activeStep, step, children }: StepProps) => {
	if (activeStep < step) {
		return null;
	}

	return (
		<div className={'p-4 w-full max-w-2xl h-full ' + (activeStep === step ? 'bg-yellow-100' : 'bg-transparent')}>
			{children}
		</div>
	);
};

export default Step;

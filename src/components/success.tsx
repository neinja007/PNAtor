type SuccessMessageProps = {
	children: React.ReactNode;
};

const SuccessMessage = ({ children }: SuccessMessageProps) => {
	return <div className='text-green-500 mt-2 text-center w-full font-medium'>{children}</div>;
};

export default SuccessMessage;

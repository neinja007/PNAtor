type ErrorMessageProps = {
	children: React.ReactNode;
};

const ErrorMessage = ({ children }: ErrorMessageProps) => {
	return <div className='text-red-500 mt-2 text-center w-full font-medium'>{children}</div>;
};

export default ErrorMessage;

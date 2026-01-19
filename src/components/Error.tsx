import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import getErrorMessage from '@utils/getErrorMessage';
import errorIcon from '@public/error.svg';

interface IError {
  error: FetchBaseQueryError | SerializedError | string | undefined;
  className?: string;
}

const Error = ({ error, className }: IError) => {
  const message =
    typeof error === 'string' ? error : (getErrorMessage(error) ?? '');

  if (!message) return null;

  return (
    <section
      className={`${className} bg-opacity-10 bg-danger/50 bg-opacity-10 rounded-md p-[20px] shadow-sm `}
    >
      <img
        src={errorIcon}
        alt="error"
        className="inline mr-2 w-[20px] h-[20px] mb-1 icon-bw"
      />
      {`Error: ${message}`}
    </section>
  );
};

export default Error;

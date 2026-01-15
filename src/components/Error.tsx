import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import getErrorMessage from '@utils/getErrorMessage';
import errorIcon from '@public/error.svg';

interface IError {
  error: FetchBaseQueryError | SerializedError | string | undefined;
}

const Error = ({ error }: IError) => {
  const message =
    typeof error === 'string' ? error : (getErrorMessage(error) ?? '');

  if (!message) return null;

  return (
    <div className="bg-opacity-10 bg-danger/50 bg-opacity-10 rounded-md p-[20px] shadow-sm">
      <img
        src={errorIcon}
        alt="error"
        className="inline mr-2 w-[20px] h-[20px] mb-1 "
      />
      {`Error: ${message}`}
    </div>
  );
};

export default Error;

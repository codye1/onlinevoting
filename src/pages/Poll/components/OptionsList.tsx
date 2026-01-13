import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import getErrorMessage from '@utils/getErrorMessage.ts';
import { PollOption, PollType } from '@utils/types.ts';

interface IOptionsList {
  options: PollOption[];
  pollType: PollType;
  selectedOptionId: string;
  handleOptionChange: (optionId: string) => void;
  error?: FetchBaseQueryError | SerializedError;
}

const OptionsList = ({
  options,
  selectedOptionId,
  handleOptionChange,
  error,
  pollType,
}: IOptionsList) => {
  const errorMessage = getErrorMessage(error);

  return (
    <div>
      {pollType === PollType.IMAGE ? (
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-6 text-base sm:text-base"
          style={{ minWidth: '168px' }}
        >
          {options.map((option, index) => (
            <label
              key={index}
              htmlFor={`option-${index}`}
              className={`flex flex-col justify-between mt-3 rounded-md cursor-pointer border border-gray-700 relative`}
              style={{ opacity: selectedOptionId !== option.id ? '0.5' : '1' }}
            >
              <div className="flex flex-grow h-40 p-2 mx-auto">
                <img
                  src={option.file || ''}
                  alt={option.title}
                  className="object-contain w-full h-full"
                />
              </div>
              <div
                className={`flex items-center h-10 border-t px-3 py-2 border-gray-700 `}
              >
                <input
                  id={`option-${index}`}
                  value={index.toString()}
                  name="options"
                  type="radio"
                  checked={selectedOptionId === option.id}
                  onChange={() => handleOptionChange(option.id)}
                  className="absolute left-3 cursor-pointer focus:ring-0 focus:ring-offset-0 h-4 w-4 text-blue-600 border-gray-300"
                />
                <div className="pl-6 sm:pl-6 flex items-center justify-between w-full truncate">
                  <div className="whitespace-nowrap truncate text-white">
                    {option.title}
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      ) : (
        <fieldset className="text-lg sm:text-base">
          <div>
            {options.map((option, index) => (
              <div key={index} className="flex items-center mt-3">
                <input
                  id={`option-${index}`}
                  value={index.toString()}
                  name="poll-options"
                  type="radio"
                  checked={selectedOptionId === option.id}
                  onChange={() => handleOptionChange(option.id)}
                  className="cursor-pointer h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor={`option-${index}`}
                  className="flex-grow cursor-pointer ml-3 block text-white"
                >
                  {option.title}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      )}
      {errorMessage && <p className="text-red-500 mt-2 ">{errorMessage}</p>}
    </div>
  );
};

export default OptionsList;

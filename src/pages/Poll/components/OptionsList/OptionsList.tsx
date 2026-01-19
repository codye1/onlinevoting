import Errors from '@components/Errors';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import getErrorMessage from '@utils/getErrorMessage';
import { PollOption, PollType } from '@utils/types.ts';
import ImageOption from './ImageOption';
import MultipleOption from './MultipleOption';

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
  return (
    <div>
      {pollType === PollType.IMAGE ? (
        <fieldset
          className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-6 text-base sm:text-base"
          style={{ minWidth: '168px' }}
        >
          {options.map((option) => (
            <ImageOption
              option={option}
              key={option.id}
              selectedOptionId={selectedOptionId}
              handleOptionChange={handleOptionChange}
            />
          ))}
        </fieldset>
      ) : (
        <fieldset className="text-lg sm:text-base">
          <div>
            {options.map((option, index) => (
              <MultipleOption
                option={option}
                index={index}
                key={option.id}
                selectedOptionId={selectedOptionId}
                handleOptionChange={handleOptionChange}
              />
            ))}
          </div>
        </fieldset>
      )}
      {error && <Errors errors={[getErrorMessage(error) || '']} />}
    </div>
  );
};

export default OptionsList;

interface IMultipleOption {
  option: {
    id: string;
    title: string;
  };
  index: number;
  selectedOptionId: string;
  handleOptionChange: (optionId: string) => void;
  isDisabled?: boolean;
}

const MultipleOption = ({
  option,
  index,
  selectedOptionId,
  handleOptionChange,
  isDisabled,
}: IMultipleOption) => {
  return (
    <div
      key={index}
      className={`flex items-center mt-3 ${isDisabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}`}
    >
      <input
        id={`option-${index}`}
        value={index.toString()}
        name="poll-options"
        type="radio"
        checked={selectedOptionId === option.id}
        onChange={() => handleOptionChange(option.id)}
        className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
        disabled={isDisabled}
      />
      <label
        htmlFor={`option-${index}`}
        className="flex-grow ml-3 block text-default"
      >
        {option.title}
      </label>
    </div>
  );
};

export default MultipleOption;

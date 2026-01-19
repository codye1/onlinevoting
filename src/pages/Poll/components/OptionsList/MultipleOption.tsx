interface IMultipleOption {
  option: {
    id: string;
    title: string;
  };
  index: number;
  selectedOptionId: string;
  handleOptionChange: (optionId: string) => void;
}

const MultipleOption = ({
  option,
  index,
  selectedOptionId,
  handleOptionChange,
}: IMultipleOption) => {
  return (
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
  );
};

export default MultipleOption;

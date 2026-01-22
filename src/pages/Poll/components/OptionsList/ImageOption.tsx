interface IImageOption {
  option: {
    id: string;
    title: string;
    file: string | null;
  };
  selectedOptionId: string;
  isDisabled?: boolean;
  handleOptionChange: (optionId: string) => void;
}

const ImageOption = ({
  option,
  selectedOptionId,
  isDisabled,
  handleOptionChange,
}: IImageOption) => {
  return (
    <label
      key={option.id}
      htmlFor={`option-${option.id}`}
      className={`${isDisabled ? 'pointer-events-none cursor-not-allowed' : 'cursor-pointer'} hover:shadow-l flex flex-col justify-between mt-3 rounded-md shadow-m relative`}
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
        className={`flex items-center h-10 border-t px-3 py-2 border-border `}
      >
        <input
          id={`option-${option.id}`}
          value={option.id}
          name="options"
          disabled={isDisabled}
          type="radio"
          checked={selectedOptionId === option.id}
          onChange={() => handleOptionChange(option.id)}
          className="absolute left-3 cursor-pointer focus:ring-0 focus:ring-offset-0 h-4 w-4 text-blue-600 border-gray-300"
        />
        <div className="pl-6 sm:pl-6 flex items-center justify-between w-full truncate">
          <div className="whitespace-nowrap truncate text-default">
            {option.title}
          </div>
        </div>
      </div>
    </label>
  );
};

export default ImageOption;

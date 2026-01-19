interface IMultipleOption {
  option: {
    title: string;
    votes: number;
    percent: string;
    percentValue: number;
    color: string;
  };
}

const MultipleOption = ({ option }: IMultipleOption) => {
  return (
    <div className="mb-3">
      <div className="flex items-center">
        <div className="flex-grow flex items-center text-lg sm:text-base">
          <span>{option.title}</span>
        </div>
        <div className="whitespace-nowrap ml-4">
          <span>{option.percent}%</span>
          <span> ({option.votes} голосів)</span>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg border border-[#808080] mt-1">
        <div className="bg-[#808080]" style={{ height: '18px' }}></div>
        {option.percentValue > 0 && (
          <div
            className="rounded-r-lg absolute top-0"
            style={{
              height: '18px',
              width: `${option.percent}%`,
              backgroundColor: option.color,
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default MultipleOption;

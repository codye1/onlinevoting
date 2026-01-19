interface IImageOption {
  option: {
    title: string;
    votes: number;
    percent: string;
    percentValue: number;
    color: string;
    file: string | null;
  };
}

const ImageOption = ({ option }: IImageOption) => {
  return (
    <div className="relative mt-3">
      <div
        className={`absolute rounded-b-md z-20 opacity-30 bottom-0 left-0 right-0 ${
          option.percentValue === 100 ? 'rounded-t-md' : ''
        }`}
        style={{
          height: `${option.percent}%`,
          backgroundColor: option.color,
        }}
      ></div>
      <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center text-center z-20">
        <div className="rounded-md bg-light px-2 py-1 text-white shadow-s">
          <div className="text-base sm:text-lg font-medium">
            {option.percent} %
          </div>
          <div>({option.votes} голосів)</div>
        </div>
      </div>
      <div className="flex flex-col justify-between h-full rounded-md shadow-m">
        <div className="flex flex-grow h-48 px-3 py-2 mx-auto">
          {option.file && (
            <img
              className="object-contain"
              src={option.file}
              alt={option.title}
            />
          )}
        </div>
        <div className="flex items-center h-10 mt-2 px-3 py-2 justify-center border-t border-border truncate">
          <span className="truncate">{option.title}</span>
        </div>
      </div>
    </div>
  );
};

export default ImageOption;

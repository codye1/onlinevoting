import Skeleton from 'react-loading-skeleton';

const baseColor = '#2f2f2f';
const highlightColor = '#3b3b3b';

const PollItemSkeleton = () => {
  return (
    <div className="w-full shadow-m rounded p-[20px] mt-[15px] bg-foreground flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-[40px] h-[40px] mr-[10px] flex items-center justify-center">
          <Skeleton
            circle
            width={40}
            height={40}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </div>

        <span className="flex flex-col">
          <h1 className="leading-5">
            <Skeleton
              width={220}
              height={18}
              baseColor={baseColor}
              highlightColor={highlightColor}
            />
          </h1>
          <h2 className="opacity-50 text-default mt-1">
            <Skeleton
              width={120}
              height={14}
              baseColor={baseColor}
              highlightColor={highlightColor}
            />
          </h2>
        </span>
      </div>

      <div className="flex items-center">
        <span className="w-[100px] text-center">
          <Skeleton
            width={40}
            height={18}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </span>
        <span className="w-[100px] text-center">
          <Skeleton
            width={70}
            height={18}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </span>
        <span className="w-[100px] text-center flex items-center justify-center gap-2">
          <Skeleton
            circle
            width={8}
            height={8}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
          <Skeleton
            width={50}
            height={18}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </span>
      </div>
    </div>
  );
};

export default PollItemSkeleton;

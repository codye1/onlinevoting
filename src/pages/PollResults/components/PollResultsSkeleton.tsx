import Skeleton from 'react-loading-skeleton';

const baseColor = '#2f2f2f';
const highlightColor = '#3b3b3b';

const PollResultsSkeleton = () => {
  return (
    <div className="bg-foreground shadow-m rounded p-[20px] max-w-[765px] m-auto">
      <h1 className={'font-extrabold text-2xl'}>
        <Skeleton
          height={28}
          width={420}
          baseColor={baseColor}
          highlightColor={highlightColor}
        />
      </h1>

      <span className={'flex mt-[10px] font-medium text-sm items-center'}>
        <Skeleton
          height={14}
          width={220}
          baseColor={baseColor}
          highlightColor={highlightColor}
        />
      </span>

      <menu className="space-y-8 mt-6">
        <div className="md:flex items-start">
          <div className="flex-grow">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="mb-3">
                <div className="flex items-center">
                  <div className="flex-grow flex items-center text-lg sm:text-base">
                    <Skeleton
                      height={16}
                      width={220}
                      baseColor={baseColor}
                      highlightColor={highlightColor}
                    />
                  </div>
                  <div className="whitespace-nowrap ml-4">
                    <Skeleton
                      height={16}
                      width={120}
                      baseColor={baseColor}
                      highlightColor={highlightColor}
                    />
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-lg border border-[#808080] mt-1">
                  <div
                    className="bg-[#808080]"
                    style={{ height: '18px' }}
                  ></div>
                  <div className="rounded-r-lg absolute top-0">
                    <Skeleton
                      height={18}
                      width={`${40 + index * 10}%`}
                      baseColor={baseColor}
                      highlightColor={highlightColor}
                      style={{ width: `${40 + index * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-shrink-0 relative">
            <div className="mt-8 md:mt-0 md:ml-8 w-72 h-72 mx-auto flex items-center justify-center">
              <Skeleton
                circle
                width={288}
                height={288}
                baseColor={baseColor}
                highlightColor={highlightColor}
              />
            </div>
          </div>
        </div>

        <div className="mt-[15px]">
          <Skeleton
            height={16}
            width={160}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </div>
      </menu>

      <div className="flex mt-4">
        <div className="mr-[15px]">
          <Skeleton
            height={44}
            width={200}
            baseColor={baseColor}
            highlightColor={highlightColor}
            borderRadius={8}
          />
        </div>
        <div>
          <Skeleton
            height={44}
            width={230}
            baseColor={baseColor}
            highlightColor={highlightColor}
            borderRadius={8}
          />
        </div>
      </div>
    </div>
  );
};

export default PollResultsSkeleton;

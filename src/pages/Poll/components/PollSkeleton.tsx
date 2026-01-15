import Skeleton from 'react-loading-skeleton';

const baseColor = '#2f2f2f';
const highlightColor = '#3b3b3b';

const PollSkeleton = () => {
  return (
    <menu
      className={'bg-foreground shadow-m rounded p-[20px] max-w-[765px] m-auto'}
    >
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

      <section className={'mt-[20px] flex font-normal'}>
        <div className={'w-[20px] h-[20px] mr-[10px] mt-[2px]'}>
          <Skeleton
            width={20}
            height={20}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </div>

        <div className="w-full">
          <Skeleton
            count={2}
            height={14}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </div>
      </section>

      <section className={'mt-[15px]'}>
        <h2 className={'mb-[10px]'}>
          <Skeleton
            height={18}
            width={200}
            baseColor={baseColor}
            highlightColor={highlightColor}
          />
        </h2>

        <div className="text-lg sm:text-base">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center mt-3">
              <Skeleton
                circle
                width={20}
                height={20}
                baseColor={baseColor}
                highlightColor={highlightColor}
              />
              <div className="ml-3 flex-grow">
                <Skeleton
                  height={16}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                />
              </div>
            </div>
          ))}
        </div>

        <div className={'flex mt-[20px]'}>
          <div className={'pr-[20px] pl-[20px] mr-[20px]'}>
            <Skeleton
              height={44}
              width={170}
              baseColor={baseColor}
              highlightColor={highlightColor}
              borderRadius={8}
            />
          </div>
          <div className={'pr-[20px] pl-[20px]'}>
            <Skeleton
              height={44}
              width={200}
              baseColor={baseColor}
              highlightColor={highlightColor}
              borderRadius={8}
            />
          </div>
        </div>
      </section>
    </menu>
  );
};

export default PollSkeleton;

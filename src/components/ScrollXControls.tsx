import chevron from '@public/chevron.svg';

type IScrollXControls = {
  targetClass: string;
  step?: number;
};

const ScrollXControls = ({ targetClass, step = 50 }: IScrollXControls) => {
  const scroll = (dir: 'left' | 'right') => {
    const el = document.getElementsByClassName(targetClass)[0];
    if (!el) return;

    el.scrollLeft += dir === 'left' ? -step : step;
  };

  return (
    <>
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 w-[27px] h-[54px] z-[999] flex items-center justify-center md:hidden cursor-pointer"
      >
        <img src={chevron} alt="scroll left" className="icon-bw" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 w-[27px] h-[54px] z-[999] flex items-center justify-center md:hidden cursor-pointer"
      >
        <img src={chevron} className="rotate-180 icon-bw" alt="scroll right" />
      </button>
    </>
  );
};

export default ScrollXControls;

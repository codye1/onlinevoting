interface SegmentItem {
  value: string;
  icon?: string;
  label?: string;
}

interface SegmentedControlProps {
  items: SegmentItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SegmentedControl = ({
  items,
  value,
  onChange,
  className = '',
}: SegmentedControlProps) => {
  const activeIndex = items.findIndex((i) => i.value === value);
  const width = 100 / items.length;

  return (
    <div
      className={`bg-foreground rounded-xl p-1 flex relative shadow-m  cursor-pointer${className}`}
      role="group"
    >
      {/* indicator */}
      <div
        className="bg-light absolute top-1 bottom-1 rounded-lg z-0 transition-transform duration-300 ease-in-out "
        style={{
          width: `calc(${width}% - 4px)`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {items.map((item) => {
        const isActive = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(item.value)}
            className={
              'relative z-10 flex-1 h-[25px] flex items-center justify-center ' +
              'transition-opacity ' +
              (isActive ? 'opacity-100' : 'opacity-50')
            }
          >
            {item.icon && (
              <img
                src={item.icon}
                alt=""
                className="w-[25px] h-[25px] icon-bw cursor-pointer"
              />
            )}
            {item.label && <span className="text-xs ml-1">{item.label}</span>}
          </button>
        );
      })}
    </div>
  );
};

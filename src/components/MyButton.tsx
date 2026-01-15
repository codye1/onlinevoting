interface MyButton {
  label: string;
  type: 'submit' | 'reset' | 'button';
  iconRight?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isLoading?: boolean;
  icon?: string;
  className?: string;
}

const MyButton = ({
  label,
  type,
  onClick,
  isLoading,
  icon,
  className,
  iconRight,
}: MyButton) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`mt-[25px] p-[10px] bg-light shadow-s rounded-md cursor-pointer flex justify-center items-center hover:bg-hover ${isLoading && 'cursor-wait'} ${className}`}
    >
      {!iconRight && icon && (
        <img className={'w-[20px] h-[20px] mr-[10px]'} src={icon} alt="" />
      )}
      <span className={isLoading ? 'invisible' : 'visible'}>{label}</span>
      {isLoading && <div className="loader absolute"></div>}
      {iconRight && icon && (
        <img className={'w-[20px] h-[20px] ml-[10px]'} src={icon} alt="" />
      )}
    </button>
  );
};

export default MyButton;

interface MyButton {
  label: string;
  type: 'submit' | 'reset' | 'button';
  iconRight?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isLoading?: boolean;
  icon?: string;
  className?: string;
  isDisabled?: boolean;
}

const MyButton = ({
  label,
  type,
  onClick,
  isLoading,
  icon,
  className,
  iconRight,
  isDisabled,
}: MyButton) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={isDisabled}
      className={`mt-[25px] p-[10px] bg-light shadow-s rounded-md flex justify-center items-center hover:bg-hover ${isLoading && 'cursor-wait'} ${className} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {!iconRight && icon && (
        <img
          className={'w-[20px] h-[20px] mr-[10px] icon-bw'}
          src={icon}
          alt=""
        />
      )}
      <span className={isLoading ? 'invisible' : 'visible'}>{label}</span>
      {isLoading && <div className="loader absolute"></div>}
      {iconRight && icon && (
        <img
          className={'w-[20px] h-[20px] ml-[10px] icon-bw'}
          src={icon}
          alt=""
        />
      )}
    </button>
  );
};

export default MyButton;

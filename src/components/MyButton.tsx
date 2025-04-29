interface MyButton {
  label: string;
  type: 'submit' | 'reset' | 'button';
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
}: MyButton) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`mt-[25px] p-[10px] bg-[#495057] rounded-md cursor-pointer flex justify-center items-center ${isLoading && 'cursor-wait'} ${className}`}
    >
      {icon && (
        <img className={'w-[20px] h-[20px] mr-[10px]'} src={icon} alt="" />
      )}
      <span className={isLoading ? 'invisible' : 'visible'}>{label}</span>
      {isLoading && <div className="loader absolute"></div>}
    </button>
  );
};

export default MyButton;

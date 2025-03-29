interface MyButton {
  label: string;
  type: 'submit' | 'reset' | 'button';
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isLoading?: boolean;
}

const MyButton = ({ label, type, onClick, isLoading }: MyButton) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`mt-[25px] p-[10px] bg-[#495057] rounded-md cursor-pointer flex justify-center items-center ${isLoading && 'cursor-wait'}`}
    >
      <span className={isLoading ? 'invisible' : 'visible'}>{label}</span>
      {isLoading && <div className="loader absolute"></div>}
    </button>
  );
};

export default MyButton;

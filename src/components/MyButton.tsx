interface MyButton {
  label: string;
}

const MyButton = ({ label }: MyButton) => {
  return (
    <button
      className={'mt-[25px] p-[10px] bg-[#495057] rounded-md cursor-pointer'}
    >
      {label}
    </button>
  );
};

export default MyButton;

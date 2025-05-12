interface TextArea {
  label?: string;
  name: string;
  placeholder: string;

  errors?: string[];
}

const TextArea = ({ label, name, placeholder, errors }: TextArea) => {
  return (
    <label className={'flex flex-col rounded-md  m-[5px] '}>
      {label}
      <textarea
        name={name}
        placeholder={placeholder}
        className={'p-1 rounded-sm p-[15px] shadow-sm w-auto bg-[#4B4B4B] '}
      />
      {errors && (
        <ul className={'text-start text-sm  text-red-500 text-xs'}>
          {errors.map((error) => (
            <li key={error}> {error}</li>
          ))}
        </ul>
      )}
    </label>
  );
};

export default TextArea;

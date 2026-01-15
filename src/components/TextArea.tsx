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
        className={'rounded-sm p-[15px] shadow-s w-auto bg-light'}
      />
      {errors && (
        <ul className={'text-start text-red-500 text-xs'}>
          {errors.map((error) => (
            <li key={error}> {error}</li>
          ))}
        </ul>
      )}
    </label>
  );
};

export default TextArea;

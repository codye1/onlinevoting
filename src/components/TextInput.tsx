export enum types {
  email = 'email',
  password = 'password',
}

interface TextInput {
  label?: string;
  name: string;
  placeholder: string;
  type: types;

  errors?: string[];
}

const TextInput = ({ label, placeholder, type, errors, name }: TextInput) => {
  return (
    <label className={'flex flex-col rounded-md shadow-sm m-[5px] '}>
      {label}
      <input
        name={name}
        placeholder={placeholder}
        className={'p-1 rounded-s p-[15px] w-auto'}
        type={type}
      />
      {errors && (
        <ul className={'text-start text-sm text-red-500 text-xs'}>
          {errors.map((error) => (
            <li key={error}> {error}</li>
          ))}
        </ul>
      )}
    </label>
  );
};

export default TextInput;

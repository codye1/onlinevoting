export enum types {
  email = 'email',
  password = 'password',
}

interface TextInput {
  label?: string;
  placeholder: string;
  type: types;
}

const TextInput = ({ label, placeholder, type }: TextInput) => {
  return (
    <label className={'flex flex-col rounded-md shadow-sm m-[5px] '}>
      {label}
      <input
        placeholder={placeholder}
        className={'p-1 rounded-s p-[15px] w-auto'}
        type={type}
      />
    </label>
  );
};

export default TextInput;

import Errors from './Errors';

interface TextArea {
  label?: string;
  name: string;
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
  errors?: string[];
}

const TextArea = ({
  label,
  name,
  placeholder,
  onChange,
  value,
  errors,
}: TextArea) => {
  return (
    <label className={'flex flex-col rounded-md'}>
      {label}
      <textarea
        name={name}
        placeholder={placeholder}
        className={'rounded-sm p-[15px] shadow-s w-auto bg-light'}
        value={value}
        onChange={onChange}
      />
      {errors && <Errors errors={errors} />}
    </label>
  );
};

export default TextArea;

import TextInput from '@components/TextInput';
import { inputTypes } from '@utils/types';
import React from 'react';
import close from '@public/close.svg';
import MyButton from '@components/MyButton';
import plus from '@public/plus.svg';

interface IMultipleOptions {
  options: { file: string | null; title: string }[];
  setOptions: React.Dispatch<
    React.SetStateAction<{ file: string | null; title: string }[]>
  >;
}

const MultipleOptions = ({ options, setOptions }: IMultipleOptions) => {
  return (
    <>
      {options.map((option, index) => (
        <TextInput
          key={index}
          placeholder={`Варіант ${index + 1}`}
          type={inputTypes.text}
          name={`option-${index}`}
          trackValue={{
            value: option.title,
            onChange: (e) => {
              setOptions((prev) => {
                const next = [...prev];
                next[index] = {
                  ...next[index],
                  file: null,
                  title: e.target.value,
                };
                return next;
              });
            },
          }}
          button={
            options.length > 1
              ? {
                  icon: close,
                  onClick: () => {
                    setOptions((prev) => prev.filter((_, i) => i !== index));
                  },
                }
              : undefined
          }
        />
      ))}
      <MyButton
        className={'m-[5px] ml-0'}
        label={'Добавити варіант'}
        type={'button'}
        icon={plus}
        onClick={() => {
          setOptions((prev) => [...prev, { file: null, title: '' }]);
        }}
      />
    </>
  );
};

export default MultipleOptions;

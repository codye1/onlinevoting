import TextInput from '@components/TextInput.tsx';
import MyButton from '@components/MyButton.tsx';
import close from '@public/close.svg';
import plus from '@public/plus.svg';
import { inputTypes } from '@utils/types.ts';
import type {
  Control,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { AddPollFormValues } from '../../../AddPollModal.tsx';

type OptionField = FieldArrayWithId<AddPollFormValues, 'options', 'id'>;

interface IMultipleOptions {
  control: Control<AddPollFormValues>;
  fields: OptionField[];
  append: UseFieldArrayAppend<AddPollFormValues, 'options'>;
  remove: UseFieldArrayRemove;
}

const MultipleOptions = ({
  control,
  fields,
  append,
  remove,
}: IMultipleOptions) => {
  return (
    <>
      {fields.map((f, index) => (
        <Controller
          key={f.id}
          name={`options.${index}.title` as const}
          control={control}
          render={({ field, fieldState }) => (
            <TextInput
              placeholder={`Варіант ${index + 1}`}
              type={inputTypes.text}
              name={`option-${index}`}
              trackValue={{
                value: field.value ?? '',
                onChange: (e) => field.onChange(e.target.value),
              }}
              errors={
                fieldState.error?.message
                  ? [fieldState.error.message]
                  : undefined
              }
              button={
                fields.length > 1
                  ? {
                      icon: close,
                      onClick: () => remove(index),
                    }
                  : undefined
              }
            />
          )}
        />
      ))}
      <MyButton
        className={'m-[5px] ml-0'}
        label={'Добавити варіант'}
        type={'button'}
        icon={plus}
        onClick={() => append({ file: null, title: '' })}
      />
    </>
  );
};

export default MultipleOptions;

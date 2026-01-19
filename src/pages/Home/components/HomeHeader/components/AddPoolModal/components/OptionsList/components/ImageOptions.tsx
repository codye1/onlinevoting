import ImageUploadInput from '@components/ImageUploadInput';
import Error from '@components/Error.tsx';
import TextInput from '@components/TextInput.tsx';
import close from '@public/close.svg';
import { inputTypes } from '@utils/types.ts';
import type {
  Control,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { AddPollFormValues } from '../../../lib/types';

type OptionField = FieldArrayWithId<AddPollFormValues, 'options', 'id'>;

interface IImageOptions {
  control: Control<AddPollFormValues>;
  fields: OptionField[];
  append: UseFieldArrayAppend<AddPollFormValues, 'options'>;
  remove: UseFieldArrayRemove;
}

const ImageOptions = ({ control, fields, append, remove }: IImageOptions) => {
  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      <ImageUploadInput
        name={'image'}
        onImagesChange={(images) => {
          images.forEach((file) => append({ file, title: '' }));
        }}
      />

      {fields.map((f, index) => (
        <div key={f.id} className="relative">
          <Controller
            name={`options.${index}.file` as const}
            control={control}
            render={({ field, fieldState }) => (
              <>
                <img
                  src={(field.value as string | null) ?? ''}
                  alt={`Uploaded ${index}`}
                  className="h-32 rounded-md object-contain border border-gray-300 dark:border-gray-700 m-auto"
                />
                {fieldState.error?.message && (
                  <Error error={fieldState.error.message} />
                )}
              </>
            )}
          />

          <Controller
            name={`options.${index}.title` as const}
            control={control}
            render={({ field, fieldState }) => (
              <TextInput
                type={inputTypes.text}
                placeholder={`Назва фото ${index + 1}`}
                name={`image-title-${index}`}
                trackValue={{
                  value: field.value ?? '',
                  onChange: (e) => field.onChange(e.target.value),
                }}
                errors={
                  fieldState.error?.message
                    ? [fieldState.error.message]
                    : undefined
                }
                classNameInput="p-[10px]"
              />
            )}
          />

          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute right-0 top-0  cursor-pointer"
          >
            <img className={'w-[20px] h-[20px] icon-bw'} src={close} alt="" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImageOptions;

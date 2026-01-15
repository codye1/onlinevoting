import ImageUploadInput from '@components/ImageUploadInput';
import { OptionDraft } from '../OptionsList';
import TextInput from '@components/TextInput';
import { inputTypes } from '@utils/types';
import close from '@public/close.svg';

interface IImageOptions {
  options: { file: string | null; title: string }[];
  setOptions: React.Dispatch<
    React.SetStateAction<{ file: string | null; title: string }[]>
  >;
}

const ImageOptions = ({ options, setOptions }: IImageOptions) => {
  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      <ImageUploadInput
        name={'image'}
        onImagesChange={(images) => {
          const newImages: OptionDraft[] = images.map((file) => ({
            file,
            title: '',
          }));
          setOptions((prev) => [...prev, ...newImages]);
        }}
      />
      {options.length > 0 &&
        options.map((item, index) => (
          <div key={index} className="relative">
            <img
              src={item.file ?? ''}
              alt={`Uploaded ${index}`}
              className="h-32 rounded-md object-contain border border-gray-300 dark:border-gray-700 m-auto"
            />
            <TextInput
              type={inputTypes.text}
              placeholder={`Назва фото ${index + 1}`}
              name={`image-title-${index}`}
              trackValue={{
                value: item.title,
                onChange: (e) =>
                  setOptions((prev) => {
                    const next = [...prev];
                    next[index] = { ...next[index], title: e.target.value };
                    return next;
                  }),
              }}
              classNameInput="p-[10px]"
            />
            <button
              type="button"
              onClick={() =>
                setOptions((prev) => prev.filter((_, i) => i !== index))
              }
              className="absolute right-0 top-0  cursor-pointer"
            >
              <img className={'w-[20px] h-[20px]'} src={close} alt="" />
            </button>
          </div>
        ))}
    </div>
  );
};

export default ImageOptions;

import ImageUploadInput from '@components/ImageUploadInput.tsx';
import { inputTypes, PollType } from '@utils/types.ts';
import plus from '@public/plus.svg';
import close from '@public/close.svg';
import TextInput from '@components/TextInput.tsx';
import { useState, type Dispatch, type SetStateAction } from 'react';
import MyButton from '@components/MyButton.tsx';
import DropDown from '@components/DropDown.tsx';
import { typeOptions } from '../../../../../../constants.ts';

interface IOptionsList {
  uploadedImages: { file: string; title: string }[];
  setUploadedImages: Dispatch<
    SetStateAction<{ file: string; title: string }[]>
  >;
  optionsErrors?: string[];
}

const OptionsList = ({
  uploadedImages,
  setUploadedImages,
  optionsErrors,
}: IOptionsList) => {
  const [typePoll, setTypePoll] = useState<PollType>(PollType.MULTIPLE);

  const [optionsList, setOptionsList] = useState<string[]>(['', '']);

  const handleImageTitleChange = (index: number, title: string) => {
    setUploadedImages((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title } : item)),
    );
  };

  return (
    <>
      <DropDown
        className={'w-1/4'}
        name={'type'}
        options={typeOptions}
        value={typePoll}
        onSelect={(value) => {
          setTypePoll(value as PollType);
        }}
      />

      <fieldset>
        <h1 className={'m-[5px]'}>Варіанти</h1>

        {typePoll === PollType.MULTIPLE && multipleOptions({optionsList, setOptionsList})}
        {typePoll === PollType.IMAGE && imageOptions({uploadedImages, handleImageTitleChange, setUploadedImages})}

        {optionsErrors && (
          <ul className="text-start text-sm text-red-500">
            {optionsErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}

        {typePoll === PollType.MULTIPLE && (
          <MyButton
            className={'m-[5px]'}
            label={'Добавити варіант'}
            type={'button'}
            icon={plus}
            onClick={() => {
              setOptionsList((prev) => [...prev, '']);
            }}
          />
        )}

        <input
          type="hidden"
          name="options"
          value={JSON.stringify(optionsList.filter((opt) => opt.trim() !== ''))}
        />
      </fieldset>
    </>
  );
};

export default OptionsList;


const multipleOptions = ({optionsList, setOptionsList}:{optionsList: string[], setOptionsList: React.Dispatch<React.SetStateAction<string[]>>})=>{
  return optionsList.map((option, index) => (
            <TextInput
              key={index}
              placeholder={`Варіант ${index + 1}`}
              type={inputTypes.text}
              name={`option-${index}`}
              trackValue={{
                value: option,
                onChange: (e) => {
                  const updatedOptions = [...optionsList];
                  updatedOptions[index] = e.target.value;
                  setOptionsList(updatedOptions);
                },
              }}
              button={
                optionsList.length > 1
                  ? {
                      icon: close,
                      onClick: () => {
                        setOptionsList((prev) =>
                          prev.filter((_, i) => i !== index),
                        );
                      },
                    }
                  : undefined
              }
            />
          ))
}


const imageOptions = ({uploadedImages, handleImageTitleChange, setUploadedImages}:{uploadedImages:{ file: string; title: string }[], handleImageTitleChange: (index: number, title: string) => void, setUploadedImages: React.Dispatch<React.SetStateAction<{ file: string; title: string }[]>>})=>{
   return (<div className="mt-4 grid grid-cols-3 gap-2">
            <ImageUploadInput
              name={'image'}
              onImagesChange={(images) => {
                const newImages = images.map((file) => ({
                  file,
                  title: '',
                }));
                setUploadedImages((prev) => [...prev, ...newImages]);
              }}
            />
            {uploadedImages.length > 0 &&
              uploadedImages.map((item, index) => (
                <div key={index} className="relative">
                  <img
                    src={item.file}
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
                        handleImageTitleChange(index, e.target.value),
                    }}
                    classNameInput="p-[10px]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setUploadedImages((prev) =>
                        prev.filter((_, i) => i !== index),
                      )
                    }
                    className="absolute right-0 top-0  cursor-pointer"
                  >
                    <img className={'w-[20px] h-[20px]'} src={close} alt="" />
                  </button>
                </div>
              ))}
            <input
              type="hidden"
              name="options"
              value={JSON.stringify(
                uploadedImages
                  .map((img) => img.title)
                  .filter((title) => title.trim() !== ''),
              )}
            />
            <input
              type="hidden"
              name="images"
              value={JSON.stringify(
                uploadedImages.map((img) => ({ title: img.title })),
              )}
            />
          </div>)
}
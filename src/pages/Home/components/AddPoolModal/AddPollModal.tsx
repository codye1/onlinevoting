import { FormEvent, startTransition, useActionState, useState } from 'react';
import Modal from '../../../../components/Modal.tsx';
import TextInput, { types } from '../../../../components/TextInput.tsx';
import TextArea from '../../../../components/TextArea.tsx';
import MyButton from '../../../../components/MyButton.tsx';
import img from '../../../../../public/img.svg';
import plus from '../../../../../public/plus.svg';
import DropDown from '../../../../components/DropDown.tsx';
import close from '../../../../../public/close.svg';
import SettingSection from '../../../../components/SettingSection.tsx';
import DateTimePicker from 'react-datetime-picker';
import checkPool from '../../../../../public/checkPool.svg';
import { useAppSelector } from '../../../../hooks/hooks.tsx';
import addPoll from '../../../../actions/addPoll.ts';
import ImageUploadInput from '../../../../components/ImageUploadInput.tsx';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface AddPollModal {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddPollModal = ({ open, setOpen }: AddPollModal) => {
  const [hideDescription, setHideDescription] = useState(true);
  const [optionsList, setOptionsList] = useState<string[]>(['', '']);
  const [closePollOnDate, setClosePollOnDate] = useState<boolean>(false);
  const [date, setDate] = useState<Value>(new Date());
  const [state, action] = useActionState(addPoll, undefined);
  const [typePoll, setTypePoll] = useState('multiple');
  const [uploadedImages, setUploadedImages] = useState<
    { file: File; title: string }[]
  >([]);
  const isLoading = useAppSelector((state) => state.general.buttonLoading);

  const options = [
    { label: 'Multiple choice', value: 'multiple', icon: checkPool },
    { label: 'Img pool', value: 'img', icon: img },
  ];

  const visibilityOptions = [
    { label: 'Always public', value: 'always' },
    { label: 'Public after vote', value: 'vote' },
    { label: 'Public after end date', value: 'date' },
  ];

  const addOption = () => {
    setOptionsList((prev) => [...prev, '']);
  };

  const removeOption = (index: number) => {
    setOptionsList((prev) => prev.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...optionsList];
    updatedOptions[index] = value;
    setOptionsList(updatedOptions);
  };

  const handleImagesChange = (images: File[]) => {
    // Convert new images to objects with empty titles and append to existing images
    const newImages = images.map((file) => ({ file, title: '' }));
    setUploadedImages((prev) => [...prev, ...newImages]); // Append instead of replace
  };

  const handleImageTitleChange = (index: number, title: string) => {
    // Update the title for the image at the given index
    setUploadedImages((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title } : item)),
    );
  };

  const removeImage = (index: number) => {
    // Remove the image (and its title) at the given index
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set('closePollOnDate', closePollOnDate.toString());
    if (closePollOnDate && date instanceof Date) {
      formData.set('date', date.toISOString());
    }
    // Append uploaded images and their titles to form data
    uploadedImages.forEach((item, index) => {
      formData.append(`image-${index}`, item.file);
      formData.append(`image-title-${index}`, item.title);
    });
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <>
      {open && (
        <Modal close={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className={'max-w-[815px] w-full'}>
            <TextInput
              type={types.text}
              name={'title'}
              label={'Заголовок'}
              placeholder={'Напиши своє питання сюда'}
              errors={state?.errors?.title}
            />
            {!hideDescription ? (
              <>
                <TextArea
                  name={'description'}
                  placeholder={'Введіть опис'}
                  label={'Description'}
                  errors={state?.errors?.description}
                />
                <div className={'flex justify-between p-[5px]'}>
                  <MyButton icon={img} label={'Add image'} type={'button'} />
                  <p
                    className={
                      'text-base cursor-pointer mt-[10px] font-light opacity-50 flex items-center'
                    }
                    onClick={() => setHideDescription(true)}
                  >
                    Приховати опис
                  </p>
                </div>
              </>
            ) : (
              <p
                className={
                  'text-base cursor-pointer m-[5px] mt-[10px] font-light opacity-50 flex items-center'
                }
                onClick={() => setHideDescription(false)}
              >
                <img
                  className={'w-[10px] h-[10px] mr-[10px]'}
                  src={plus}
                  alt=""
                />
                Добавити опис або фото
              </p>
            )}
            <DropDown
              className={'w-1/4'}
              name={'type'}
              options={options}
              value={typePoll}
              onSelect={(value) => {
                setTypePoll(value);
              }}
            />
            <menu>
              <h1 className={'m-[5px]'}>Варіанти</h1>
              {typePoll === 'multiple' ? (
                optionsList.map((option, index) => (
                  <TextInput
                    key={index}
                    placeholder={`Варіант ${index + 1}`}
                    type={types.text}
                    name={`option-${index}`}
                    trackValue={{
                      value: option,
                      onChange: (e) => {
                        updateOption(index, e.target.value);
                      },
                    }}
                    button={
                      optionsList.length > 1
                        ? {
                            icon: close,
                            onClick: () => removeOption(index),
                          }
                        : undefined
                    }
                  />
                ))
              ) : (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <ImageUploadInput
                    name={'image'}
                    onImagesChange={handleImagesChange}
                  />
                  {uploadedImages.length > 0 &&
                    uploadedImages.map((item, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(item.file)}
                          alt={`Uploaded ${index}`}
                          className="h-32 rounded-md object-contain border border-gray-300 dark:border-gray-700 m-auto"
                        />
                        <TextInput
                          type={types.text}
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
                          onClick={() => removeImage(index)}
                          className="absolute right-0 top-0 mr-2 mt-2 cursor-pointer"
                        >
                          <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  <input
                    type="hidden"
                    name="options"
                    value={JSON.stringify(
                      typePoll === 'multiple'
                        ? optionsList.filter((opt) => opt.trim() !== '')
                        : uploadedImages
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
                </div>
              )}
              {state && state.errors?.options && (
                <ul className="text-start text-sm text-red-500 text-xs">
                  {state.errors.options.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              )}
              {typePoll === 'multiple' && (
                <MyButton
                  className={'m-[5px]'}
                  label={'Добавити варіант'}
                  type={'button'}
                  icon={plus}
                  onClick={addOption}
                />
              )}
            </menu>
            <input
              type="hidden"
              name="options"
              value={JSON.stringify(
                optionsList.filter((opt) => opt.trim() !== ''),
              )}
            />
            <div className={'flex justify-between flex-wrap pr-[5px]'}>
              <SettingSection
                label={'Закрити опитування в заплановану дату'}
                checked={closePollOnDate}
                setChecked={setClosePollOnDate}
                classNameChildren={'p-[5px]'}
              >
                <DateTimePicker
                  className={'my-calendar'}
                  onChange={setDate}
                  value={date}
                />
                {state?.errors?.date && (
                  <p className={'text-start text-sm text-red-500 font-light'}>
                    {state.errors.date.join(', ')}
                  </p>
                )}
              </SettingSection>
              <DropDown
                name={'visibility'}
                options={visibilityOptions}
                onSelect={() => {}}
              />
            </div>

            <MyButton
              className={'ml-auto'}
              type={'submit'}
              label={'Створити голосування'}
              isLoading={isLoading}
            />
          </form>
        </Modal>
      )}
    </>
  );
};

export default AddPollModal;

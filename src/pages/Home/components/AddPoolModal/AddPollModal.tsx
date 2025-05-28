import { FormEvent, startTransition, useActionState, useState } from 'react';
import Modal from '../../../../components/Modal.tsx';
import TextInput from '../../../../components/TextInput.tsx';
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
import { types } from '../../../../lib/types.ts';

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
  const [changeVoteOpen, setChangeVoteOpen] = useState(false);
  const [date, setDate] = useState<Value>(new Date());
  const [state, action] = useActionState(addPoll, undefined);
  const [typePoll, setTypePoll] = useState('multiple');
  const [modalUploadImageOpen, setModalUploadImageOpen] = useState(false);
  const [image, setImage] = useState<string | undefined>();

  const [uploadedImages, setUploadedImages] = useState<
    { file: string; title: string }[]
  >([]);
  const isLoading = useAppSelector((state) => state.general.buttonLoading);

  const options = [
    { label: 'Кілька варіантів вибору', value: 'multiple', icon: checkPool },
    { label: 'Голосування за зображеннями', value: 'img', icon: img },
  ];

  const visibilityOptions = [
    { label: 'Завжди відкриті', value: 'always' },
    { label: 'Відкриті після голосу', value: 'vote' },
    { label: 'Відкриті після закінчення терміну дії', value: 'date' },
  ];

  const handleImageTitleChange = (index: number, title: string) => {
    setUploadedImages((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title } : item)),
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set('closePollOnDate', closePollOnDate.toString());
    if (closePollOnDate && date instanceof Date) {
      formData.set('date', date.toISOString());
    }
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
                  label={'Опис'}
                  errors={state?.errors?.description}
                />
                <div className={'flex justify-between p-[5px] flex-col'}>
                  {image ? (
                    <img src={image} alt="" />
                  ) : (
                    <MyButton
                      icon={img}
                      label={'Додати фото'}
                      type={'button'}
                      onClick={() => {
                        setModalUploadImageOpen(true);
                      }}
                    />
                  )}
                  <p
                    className={
                      'text-base cursor-pointer mt-[10px] font-light opacity-50 flex items-center'
                    }
                    onClick={() => setHideDescription(true)}
                  >
                    Приховати опис
                  </p>
                  {modalUploadImageOpen && (
                    <Modal close={() => setModalUploadImageOpen(false)}>
                      <div className={'p-[20px]'}>
                        <ImageUploadInput
                          name={'image'}
                          onImagesChange={(url) => {
                            setImage(url[0]);
                            setModalUploadImageOpen(false);
                          }}
                          maxImages={1}
                        />
                      </div>
                    </Modal>
                  )}
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
            <input type={'hidden'} value={image} name={'image'} />
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
              ) : (
                <div className="mt-4 grid grid-cols-3 gap-2">
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
                          onClick={() =>
                            setUploadedImages((prev) =>
                              prev.filter((_, i) => i !== index),
                            )
                          }
                          className="absolute right-0 top-0  cursor-pointer"
                        >
                          <img
                            className={'w-[20px] h-[20px]'}
                            src={close}
                            alt=""
                          />
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
                  onClick={() => {
                    setOptionsList((prev) => [...prev, '']);
                  }}
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
              <SettingSection
                label={'Зміна вибору'}
                checked={changeVoteOpen}
                setChecked={setChangeVoteOpen}
                name={'changeVote'}
                classNameChildren={'p-[5px]'}
              >
                <DropDown
                  options={[
                    { label: 'Без інтервалу', value: 'noInterval' },
                    {
                      label: 'Раз в хвилину',
                      value: 'perMinute',
                    },
                    {
                      label: 'Раз в годину',
                      value: 'perHour',
                    },
                    {
                      label: 'Раз в день',
                      value: 'perDay',
                    },
                    {
                      label: 'Раз в тиждень',
                      value: 'perWeek',
                    },
                    {
                      label: 'Раз в місяць',
                      value: 'perMonth',
                    },
                  ]}
                  onSelect={() => {}}
                  name={'interval'}
                />
              </SettingSection>
              <DropDown
                label={'Результати'}
                name={'visibility'}
                options={visibilityOptions}
                onSelect={() => {}}
              />
              <DropDown
                label={'Категорія'}
                options={[
                  { label: 'Без категорії', value: '' },
                  { label: 'Кіно та серіали', value: 'Кіно та серіали' },
                  { label: 'Музика', value: 'Музика' },
                  { label: 'Спорт', value: 'Спорт' },
                  { label: 'Технології', value: 'Технології' },
                  { label: 'Мода', value: 'Мода' },
                  { label: 'Кулінарія', value: 'Кулінарія' },
                  { label: 'Подорожі', value: 'Подорожі' },
                  { label: 'Книги', value: 'Книги' },
                  { label: 'Ігри', value: 'Ігри' },
                  { label: 'Політика', value: 'Політика' },
                  { label: 'Освіта', value: 'Освіта' },
                  { label: 'Наука', value: 'Наука' },
                  { label: 'Мистецтво', value: 'Мистецтво' },
                  { label: 'Здоров’я та фітнес', value: 'Здоров’я та фітнес' },
                  { label: 'Автомобілі', value: 'Автомобілі' },
                  { label: 'Домашні улюбленці', value: 'Домашні улюбленці' },
                  { label: 'Екологія', value: 'Екологія' },
                  {
                    label: 'Фінанси та інвестиції',
                    value: 'Фінанси та інвестиції',
                  },
                  { label: 'Стартапи та бізнес', value: 'Стартапи та бізнес' },
                  { label: 'Соціальні питання', value: 'Соціальні питання' },
                ]}
                name={'category'}
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

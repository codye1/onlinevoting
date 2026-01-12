import { FormEvent, startTransition, useActionState, useState } from 'react';
import Modal from '@components/Modal.tsx';
import TextInput from '@components/TextInput.tsx';
import MyButton from '@components/MyButton.tsx';
import addPoll from '@actions/addPoll.ts';

import { inputTypes } from '@utils/types.ts';
import Description from './components/Description/Description.tsx';
import OptionsList from './components/OptionsList/OptionsList.tsx';
import Settings from './components/Settings/Settings.tsx';

type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

interface AddPollModal {
  handleClose: (reason: 'created' | 'closed') => void;
}

const AddPollModal = ({ handleClose }: AddPollModal) => {
  const [closePollOnDate, setClosePollOnDate] = useState<boolean>(false);
  const [date, setDate] = useState<Value>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [state, action] = useActionState(
    addPoll(() => {
      handleClose('created');
    }, setIsLoading),
    undefined,
  );

  const [descriptionImg, setDescriptionImg] = useState<string | undefined>();
  const [uploadedImages, setUploadedImages] = useState<
    { file: string; title: string }[]
  >([]);

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
    <Modal close={() => handleClose('closed')}>
      <form onSubmit={handleSubmit} className={'max-w-[815px] w-full'}>
        <TextInput
          type={inputTypes.text}
          name={'title'}
          label={'Заголовок'}
          placeholder={'Напиши своє питання сюда'}
          errors={state?.errors?.title}
        />
        <Description
          setDescriptionImg={setDescriptionImg}
          descriptionImg={descriptionImg}
          errors={state?.errors?.description}
        />

        <OptionsList
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
          optionsErrors={state?.errors?.options}
        />
        <Settings
          setClosePollOnDate={setClosePollOnDate}
          closePollOnDate={closePollOnDate}
          setDate={setDate}
          date={date}
          errors={state?.errors?.date}
        />

        <MyButton
          className={'ml-auto'}
          type={'submit'}
          label={'Створити голосування'}
          isLoading={isLoading}
        />
      </form>
    </Modal>
  );
};

export default AddPollModal;

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

type AddPollErrors = Partial<
  Record<'title' | 'description' | 'options' | 'date' | 'api', string[]>
>;

type AddPollState =
  | {
      errors?: AddPollErrors;
    }
  | undefined;

interface IAddPollModal {
  handleClose: (reason: 'created' | 'closed') => void;
}

const AddPollModal = ({ handleClose }: IAddPollModal) => {
  const [closePollOnDate, setClosePollOnDate] = useState<boolean>(false);
  const [expireAtDate, setExpireAtDate] = useState<Value>(new Date());
  const [state, action, isPending] = useActionState<AddPollState, FormData>(
    addPoll(() => {
      handleClose('created');
    }),
    undefined,
  );

  const [descriptionImg, setDescriptionImg] = useState<string | undefined>();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    if (closePollOnDate && expireAtDate instanceof Date) {
      formData.set('expireAtDate', expireAtDate.toISOString());
    }
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

        <OptionsList optionsErrors={state?.errors?.options} />
        <Settings
          setClosePollOnDate={setClosePollOnDate}
          closePollOnDate={closePollOnDate}
          setExpireAtDate={setExpireAtDate}
          expireAtDate={expireAtDate}
          errors={state?.errors?.date}
        />

        <MyButton
          className={'ml-auto'}
          type={'submit'}
          label={'Створити голосування'}
          isLoading={isPending}
        />
        {state?.errors?.api && (
          <div className="mt-[10px] text-danger">
            {state.errors.api.map((err, idx) => (
              <div key={idx}>[API] {err}</div>
            ))}
          </div>
        )}
      </form>
    </Modal>
  );
};

export default AddPollModal;

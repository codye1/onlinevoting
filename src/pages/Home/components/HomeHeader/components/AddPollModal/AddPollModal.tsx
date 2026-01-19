import Modal from '@components/Modal.tsx';
import TextInput from '@components/TextInput.tsx';
import MyButton from '@components/MyButton.tsx';
import { inputTypes } from '@utils/types.ts';
import Description from './components/Description/Description.tsx';
import OptionsList from './components/OptionsList/OptionsList.tsx';
import Settings from './components/Settings/Settings.tsx';
import { Controller } from 'react-hook-form';
import Errors from '@components/Errors.tsx';
import useAddPollModal from './useAddPollModal.tsx';

interface IAddPollModal {
  handleClose: (reason: 'created' | 'closed') => void;
}

const AddPollModal = ({ handleClose }: IAddPollModal) => {
  const { form, isLoading, apiErrors, optionsSchemaMessage } =
    useAddPollModal(handleClose);

  return (
    <Modal close={() => handleClose('closed')}>
      <form
        onSubmit={form.handleSubmit(form.onSubmit)}
        className={'max-w-[815px] w-full'}
      >
        <Controller
          name={'title'}
          control={form.control}
          render={({ field }) => (
            <TextInput
              type={inputTypes.text}
              name={'title'}
              label={'Заголовок'}
              placeholder={'Напиши своє питання сюда'}
              trackValue={{
                value: field.value,
                onChange: (e) => field.onChange(e.target.value),
              }}
              errors={
                form.errors.title?.message
                  ? [form.errors.title.message]
                  : undefined
              }
            />
          )}
        />

        <Description
          control={form.control}
          descriptionError={
            form.errors.description?.message
              ? [form.errors.description.message]
              : undefined
          }
          image={form.watch('image')}
          setImage={(url) => form.setValue('image', url)}
        />

        <OptionsList
          control={form.control}
          clearErrors={form.clearErrors}
          optionSchemaErrorMessage={optionsSchemaMessage}
        />

        <Settings
          control={form.control}
          errors={
            form.errors.expireAt?.message
              ? [form.errors.expireAt.message]
              : undefined
          }
        />

        <MyButton
          className={'ml-auto'}
          type={'submit'}
          label={'Створити голосування'}
          isLoading={isLoading}
        />
        {apiErrors && <Errors errors={apiErrors} />}
      </form>
    </Modal>
  );
};

export default AddPollModal;

import { useState } from 'react';
import img from '@public/img.svg';
import plus from '@public/plus.svg';
import Modal from '@components/Modal';
import ImageUploadInput from '@components/ImageUploadInput';
import MyButton from '@components/MyButton';
import { Control, Controller } from 'react-hook-form';
import TextArea from '@components/TextArea.tsx';
import { AddPollRequest } from '@utils/types';

interface IDescription {
  control: Control<AddPollRequest>;
  descriptionError?: string[];
  image: string;
  setImage: (url: string) => void;
}

const Description = ({
  control,
  descriptionError,
  image,
  setImage,
}: IDescription) => {
  const [hideDescription, setHideDescription] = useState(true);

  const [modalUploadImageOpen, setModalUploadImageOpen] = useState(false);

  if (hideDescription) {
    return (
      <p
        className="text-base cursor-pointer m-[5px] mt-[10px] font-light opacity-50 flex items-center"
        onClick={() => setHideDescription(false)}
      >
        <img
          className="w-[10px] h-[10px] mr-[10px] icon-bw"
          src={plus}
          alt=""
        />
        Добавити опис або фото
      </p>
    );
  }

  return (
    <>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextArea
            label="Опис"
            name="description"
            placeholder="Введіть опис"
            errors={descriptionError}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
          />
        )}
      />
      <div className={'flex justify-between flex-col'}>
        {image ? (
          <img src={image} alt="" />
        ) : (
          <MyButton
            icon={img}
            label={'Додати фото'}
            type={'button'}
            className="mt-[5px]"
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
        <Modal
          isOpen={modalUploadImageOpen}
          close={() => setModalUploadImageOpen(false)}
          inner={true}
        >
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
      </div>
    </>
  );
};

export default Description;

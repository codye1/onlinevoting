import { Dispatch, useState } from 'react';
import TextArea from '@components/TextArea';
import img from '@public/img.svg';
import plus from '@public/plus.svg';
import Modal from '@components/Modal';
import ImageUploadInput from '@components/ImageUploadInput';
import MyButton from '@components/MyButton';

interface IDescription {
  setDescriptionImg: Dispatch<React.SetStateAction<string | undefined>>;
  descriptionImg?: string;
  errors?: string[];
}

const Description = ({
  setDescriptionImg,
  descriptionImg,
  errors,
}: IDescription) => {
  const [hideDescription, setHideDescription] = useState(true);

  const [modalUploadImageOpen, setModalUploadImageOpen] = useState(false);

  if (hideDescription) {
    return (
      <p
        className={
          'text-base cursor-pointer m-[5px] mt-[10px] font-light opacity-50 flex items-center'
        }
        onClick={() => setHideDescription(false)}
      >
        <img className={'w-[10px] h-[10px] mr-[10px]'} src={plus} alt="" />
        Добавити опис або фото
      </p>
    );
  }

  return (
    <>
      <TextArea
        name={'description'}
        placeholder={'Введіть опис'}
        label={'Опис'}
        errors={errors}
      />
      <div className={'flex justify-between p-[5px] flex-col'}>
        {descriptionImg ? (
          <img src={descriptionImg} alt="" />
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
                  setDescriptionImg(url[0]);
                  setModalUploadImageOpen(false);
                }}
                maxImages={1}
              />
            </div>
          </Modal>
        )}
      </div>
      <input type={'hidden'} value={descriptionImg} name={'image'} />
    </>
  );
};

export default Description;

import { ChangeEvent, DragEvent, useState } from 'react';
import { useUploadImagesToImgBBMutation } from '@reducer/api/slices/imageSlice.ts';
import Spiner from './Spiner.tsx';
import plus from '../public/plus.svg';
import Error from './Error.tsx';

type ImageUploadInputProps = {
  name: string;
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
  currentImageCount?: number;
};

const ImageUploadInput = ({
  name,
  onImagesChange,
  maxImages,
  currentImageCount = 0,
}: ImageUploadInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadImages, { isLoading, error }] = useUploadImagesToImgBBMutation();
  const [limitError, setLimitError] = useState<string | null>(null);

  const handleFiles = async (files: FileList) => {
    const newImages = Array.from(files).filter((file) =>
      file.type.startsWith('image/'),
    );
    if (newImages.length === 0) return;
    if (maxImages !== undefined) {
      const totalImages = currentImageCount + newImages.length;
      if (totalImages > maxImages) {
        setLimitError(`Cannot upload more than ${maxImages} images.`);
        return;
      }
    }

    setLimitError(null);
    try {
      // Upload images to ImgBB
      const urls = await uploadImages(newImages).unwrap();
      onImagesChange(urls);
    } catch (err) {
      console.error('Failed to upload images:', err);
      onImagesChange([]);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files) {
      handleFiles(files);
    }
  };

  return (
    <div>
      <label
        htmlFor="add-image-options"
        className={`h-44 w-full p-1 shadow-s rounded-md relative text-muted flex items-center justify-center cursor-pointer  transition-colors ${
          isDragging ? 'bg-light' : 'bg-hover'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragOver={isDragging || isLoading ? undefined : handleDragOver}
        onDragLeave={isDragging || isLoading ? undefined : handleDragLeave}
        onDrop={isDragging || isLoading ? undefined : handleDrop}
      >
        <input
          id="add-image-options"
          name={name}
          type="file"
          className="absolute opacity-0 top-0 left-0 h-full w-full cursor-pointer bg-light"
          accept="image/*"
          multiple
          onChange={isLoading ? undefined : handleInputChange}
          disabled={isLoading}
        />
        <div className="text-center">
          {isLoading ? (
            <Spiner />
          ) : (
            <div className="flex justify-center">
              <img
                className={'h-[15px] w-[15px] opacity-25 icon-bw'}
                src={plus}
                alt=""
              />
            </div>
          )}
          <div className="mt-1 opacity-25 text-white">
            {isLoading ? 'Uploading...' : 'Add option(s)'}
          </div>
          {error && <Error error={error} />}
          {limitError && <Error error={limitError} />}
        </div>
      </label>
    </div>
  );
};

export default ImageUploadInput;

import { ChangeEvent, DragEvent, useState } from 'react';
import { useUploadImagesToImgBBMutation } from '@reducer/api/slices/imageSlice.ts';
import Spiner from './Spiner.tsx';
import plus from '../public/plus.svg';
import Error from './Error.tsx';

type ImageUploadInputProps = {
  name: string;
  onImagesChange: (urls: string[]) => void;
  maxImages?: number; // Maximum number of images allowed (undefined for unlimited)
  currentImageCount?: number; // Current number of images in parent
};

const ImageUploadInput = ({
  name,
  onImagesChange,
  maxImages, // Default is undefined (unlimited)
  currentImageCount = 0,
}: ImageUploadInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadImages, { isLoading, error }] = useUploadImagesToImgBBMutation();
  const [limitError, setLimitError] = useState<string | null>(null);

  // Handle file selection (via click or drop)
  const handleFiles = async (files: FileList) => {
    const newImages = Array.from(files).filter((file) =>
      file.type.startsWith('image/'),
    );
    if (newImages.length === 0) return;

    // Check if adding new images exceeds the limit (only if maxImages is defined)
    if (maxImages !== undefined) {
      const totalImages = currentImageCount + newImages.length;
      if (totalImages > maxImages) {
        setLimitError(`Cannot upload more than ${maxImages} images.`);
        return;
      }
    }

    setLimitError(null); // Clear any previous limit error

    try {
      // Upload images to ImgBB
      const urls = await uploadImages(newImages).unwrap();
      onImagesChange(urls); // Notify parent with array of URLs
    } catch (err) {
      console.error('Failed to upload images:', err);
      onImagesChange([]); // Pass empty array on error
    }
  };

  // Handle file input change (click to upload)
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  // Handle drag over
  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  // Handle drop
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

import { ChangeEvent, DragEvent, useState } from 'react';

type ImageUploadInputProps = {
  name: string;
  onImagesChange: (images: File[]) => void;
};

const ImageUploadInput = ({ name, onImagesChange }: ImageUploadInputProps) => {
  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection (via click or drop)
  const handleFiles = (files: FileList) => {
    const newImages = Array.from(files).filter((file) =>
      file.type.startsWith('image/'),
    );
    if (newImages.length === 0) return;

    onImagesChange(newImages); // Directly notify parent of new images
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
        className={`h-44 w-full p-1 border border-gray-700 rounded-md relative text-gray-500 flex items-center justify-center cursor-pointer transition-colors ${
          isDragging ? 'bg-gray-700' : 'bg-[#4B4B4B]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id="add-image-options"
          name={name}
          type="file"
          className="absolute opacity-0 top-0 left-0 h-full w-full cursor-pointer"
          accept="image/*"
          multiple
          onChange={handleInputChange}
        />
        <div className="text-center">
          <div className="flex justify-center">
            <svg
              className="h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="mt-1">Add option(s)</div>
        </div>
      </label>
    </div>
  );
};

export default ImageUploadInput;

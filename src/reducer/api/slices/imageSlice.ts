import { fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { apiSlice } from '../api';

interface ImgBBResponse {
  data: {
    url: string;
  };
  success: boolean;
  status: number;
}

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

// Separate base query for ImgBB (no auth, different base URL)
const imgBBBaseQuery = fetchBaseQuery({
  baseUrl: 'https://api.imgbb.com/1/',
});

export const imageSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImagesToImgBB: builder.mutation<string[], File[]>({
      queryFn: async (files: File[], _api, _extraOptions) => {
        try {
          const uploadPromises = files.map(async (file) => {
            const formData = new FormData();
            if (!IMGBB_API_KEY) {
              throw new Error('ImgBB API key is not defined');
            }
            formData.append('key', IMGBB_API_KEY);
            formData.append('image', file);
            formData.append('name', file.name);

            const response = await imgBBBaseQuery(
              {
                url: 'upload',
                method: 'POST',
                body: formData,
              },
              _api,
              _extraOptions,
            );

            if (response.error) {
              throw new Error(
                `Failed to upload ${file.name}: ${response.error}`,
              );
            }

            const data = response.data as ImgBBResponse;
            if (!data.success) {
              throw new Error(
                `Failed to upload ${file.name}: API returned unsuccessful response`,
              );
            }

            return data.data.url;
          });

          const urls = await Promise.all(uploadPromises);
          return { data: urls };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error
                  ? error.message
                  : 'Unknown error during image upload',
            } as FetchBaseQueryError,
          };
        }
      },
    }),
  }),
});

export const { useUploadImagesToImgBBMutation } = imageSlice;

export default imageSlice;

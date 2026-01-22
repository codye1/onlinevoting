import { addToastWithTimeout } from '@reducer/toasts';
import { AppStartListening } from '../listenerMiddleware';
import imageSlice from '../slices/imageSlice';

export const addImageListeners = (startAppListening: AppStartListening) => {
  // UPLOAD IMAGE SUCCESS
  startAppListening({
    matcher: imageSlice.endpoints.uploadImagesToImgBB.matchFulfilled,
    effect: async (_action, api) => {
      addToastWithTimeout({
        id: crypto.randomUUID(),
        message: 'Зображення успішно завантажено',
        type: 'success',
        duration: 1500,
      })(api.dispatch);
    },
  });

  // UPLOAD IMAGE ERROR
  startAppListening({
    matcher: imageSlice.endpoints.uploadImagesToImgBB.matchRejected,
    effect: async (_action, api) => {
      addToastWithTimeout({
        id: crypto.randomUUID(),
        message: 'Помилка завантаження зображення',
        type: 'error',
        duration: 1500,
      })(api.dispatch);
    },
  });
};

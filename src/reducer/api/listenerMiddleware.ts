import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../store';
import { addAuthListeners } from './listeners/authListener';
import { addImageListeners } from './listeners/imageListener';

export const listenerMiddleware = createListenerMiddleware<
  RootState,
  AppDispatch
>();
export type AppStartListening = typeof listenerMiddleware.startListening;

addAuthListeners(listenerMiddleware.startListening);
addImageListeners(listenerMiddleware.startListening);

import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../store';
import { addAuthListeners } from './listeners/authListener';
import { addImageListeners } from './listeners/imageListener';
import { addPollListeners } from './listeners/pollsListener';

export const listenerMiddleware = createListenerMiddleware<
  RootState,
  AppDispatch
>();
export type AppStartListening = typeof listenerMiddleware.startListening;

addAuthListeners(listenerMiddleware.startListening);
addImageListeners(listenerMiddleware.startListening);
addPollListeners(listenerMiddleware.startListening);

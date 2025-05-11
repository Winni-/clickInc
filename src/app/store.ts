import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import gameSlice from "./gameSlice";
import { workerMiddleware } from './workerMiddleware';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    game: gameSlice,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false // Отключаем проверку сериализуемости для воркера
    }).concat(workerMiddleware),
});

// Типы из store после его создания
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

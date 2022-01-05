import { configureStore } from '@reduxjs/toolkit'
import Player from 'Redux/Player'
import Table from 'Redux/Table';
import { Dice } from 'Redux/Dice';
import { CrapsMiddleware } from 'Redux/CrapsMiddleware';
import { MoneyStorageMiddleware, getStoredMoney } from 'Redux/MoneyStorageMiddleware';

/**
 * Creates a new Redux Store. Meant to be used by testing, since the app should use store
 */
export function newStore() {
  return configureStore({
    reducer: {
      player: Player.reducer,
      table: Table.reducer,
      dice: Dice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(CrapsMiddleware, MoneyStorageMiddleware)
  })
}

/**
 * The Global store for the app
 */
export const store = newStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;

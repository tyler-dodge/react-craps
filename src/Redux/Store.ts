import { configureStore } from '@reduxjs/toolkit'
import Player from '#src/Redux/Player'
import Table from '#src/Redux/Table';
import { Dice } from '#src/Redux/Dice';
import { CrapsMiddleware } from '#src/Redux/CrapsMiddleware';
import { MoneyStorageMiddleware, getStoredMoney } from '#src/Redux/MoneyStorageMiddleware';
import { AutorollerSlice } from './Autoroller';
import { MysteryOfFiftySeriesSlice } from './MysteryOfFiftySeries';

/**
 * Creates a new Redux Store. Meant to be used by testing, since the app should use store
 */
export function newStore() {
  return configureStore({
    reducer: {
      player: Player.reducer,
      table: Table.reducer,
      dice: Dice.reducer,
      mystery: MysteryOfFiftySeriesSlice.reducer,
      autoroller: AutorollerSlice.reducer
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

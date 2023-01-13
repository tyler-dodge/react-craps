import { createSlice, Slice, PayloadAction } from "@reduxjs/toolkit";

export interface PlayerSnapshot {
  money: number;
}
export interface MysteryOfFiftySeriesState {
  labels: number[];
  moneyHistory: number[];
  counter: number;
  startMoney?: number;
}

const initialState: MysteryOfFiftySeriesState = {
  moneyHistory: [],
  labels: [],
  counter: 0
}
export const MysteryOfFiftySeriesSlice: Slice<MysteryOfFiftySeriesState> = createSlice({
  name: 'mystery',
  initialState: initialState,
  reducers: {
    pushHistory(state: MysteryOfFiftySeriesState, action: PayloadAction<PlayerSnapshot>) {
      if (state.startMoney === undefined) {
        state.startMoney = action.payload.money
      }
      state.moneyHistory.push(action.payload.money - state.startMoney)
      state.counter += 1
      state.labels.push(state.counter)
      if (state.moneyHistory.length > 2000) {
        state.labels.shift()
        state.moneyHistory.shift()
      }
    }
  }
});

export const MysteryActions = MysteryOfFiftySeriesSlice.actions;

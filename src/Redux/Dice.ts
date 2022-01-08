import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Die } from 'Components/Die';
import { random } from 'lodash';



export type DiceHistoryState = {
  counter: number;
  value: number[]
}

export type DiceState = {
  counter: number;
  value: number[];
  history: DiceHistoryState[];
}

const initialState = {
  counter: 0,
  value: [],
  history: []
} as DiceState;


export const Dice = createSlice({
  name: 'dice',
  initialState: initialState,
  reducers: {
    rollDice: (state, action: PayloadAction<number[]>) => {
      state.counter += 1;
      state.value = action.payload;
      state.history.push({
        counter: state.counter,
        value: action.payload
      })
      if (state.history.length > 50) {
        state.history.shift();
      }
    }
  }
})
export function newDice(): number[] {
  const newValue = () => random(1, 6);
  return [newValue(), newValue()];
}
export const Actions = Dice.actions;

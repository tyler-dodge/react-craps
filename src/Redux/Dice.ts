import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Die } from 'Components/Die';
import { random } from 'lodash';


export type DiceState = {
    counter: number;
    value: number[];
}

const initialState = {
    counter: 0,
    value: []
} as DiceState;


export const Dice = createSlice({
    name: 'dice',
    initialState: initialState,
    reducers: {
        rollDice: (state, action: PayloadAction<number[]>) => {
            state.counter += 1;
            state.value = action.payload;
        }
    }
})
export function newDice(): number[] {
    const newValue = () => random(1, 6);
    return [newValue(), newValue()];
}
export const Actions = Dice.actions;

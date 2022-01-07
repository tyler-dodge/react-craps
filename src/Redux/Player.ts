import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { placeBet } from 'Redux/Actions';
import { SlotPlacement } from 'Slot';
import { TableActions, TableBet } from 'Redux/Table';
import { Actions as DiceActions } from 'Redux/Dice';
import { getStoredMoney, isMoneyTooLow } from './MoneyStorageMiddleware';

export const PLAYER_NAME = 'user';

export interface BetPayout {
  multiplier: number;
  bet: TableBet;
}

export interface PlayerState {
  money: number;
  lastPayout: number
  betIncrement: number;
}

const startMoney = getStoredMoney()
const initialState = {
  money: !isMoneyTooLow() ? startMoney: 1000,
  lastPayout: 0,
  betIncrement: 10
} as PlayerState;

export const Player = createSlice({
  name: 'player',
  initialState: initialState,
  reducers: {
    payoutBet: (state, action: PayloadAction<BetPayout>) => {
      const payout = (action.payload.bet.amount * action.payload.multiplier)
      state.money += payout;
      state.lastPayout += payout;
    },
    setBetIncrement: (state, action: PayloadAction<number>) => {
      state.betIncrement = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(placeBet, (state, action) => {
      state.money -= action.payload.amount
    });
    builder.addCase(TableActions.removeNotInPlayBet, (state, action) => {
      state.money += action.payload.amount
    });
    builder.addCase(DiceActions.rollDice, (state, action) => {
      state.lastPayout = 0
    })
  }
});

export const PlayerActions = Player.actions;

export default Player;

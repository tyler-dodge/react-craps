import { Action, createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'

import Slot, { SlotPlacement, slotKeyName, PlaceSlotPlacement } from 'Slot'
import { moveBet, placeBet } from './Actions';
import { dropWhile, isEqual } from 'lodash';
import { useAppSelector } from './hooks';
import { useMemo } from 'react';
import { getStoredMoney, getStoredTable, isMoneyTooLow } from './MoneyStorageMiddleware';

export interface TableBet {
  player: string;
  amount: number;
  placement: SlotPlacement;
}

export interface TableState {
  point?: number
  bets: {
    [slot: string]: TableBet[];
  };
}

const initialState = (!isMoneyTooLow() && getStoredTable()) || { bets: {} } as TableState;

export const TableSlice: Slice<TableState> = createSlice({
  name: 'table',
  initialState: initialState,
  reducers: {
    setPoint(state: TableState, action: PayloadAction<PlaceSlotPlacement>) {
      state.point = action.payload.value;
    },
    clearPoint(state: TableState) {
      state.point = undefined;
    },
    removeBet(state: TableState, action: PayloadAction<TableBet>) {
      const key = slotKeyName(action.payload.placement);
      if (!state.bets[key]) {
        state.bets[key] = [];
      }

      let removeCount = action.payload.amount;
      state.bets[key] = dropWhile(state.bets[key], (bet) => {
        if (bet.amount <= removeCount) {
          removeCount -= bet.amount;
          return true;
        } else {
          bet.amount -= removeCount;
          return false;
        }
      })

    }
  },
  extraReducers: (builder) => {
    builder.addCase(placeBet, (state: TableState, action) => {
      const key = slotKeyName(action.payload.placement)
      if (!state.bets[key]) {
        state.bets[key] = [];
      }
      state.bets[key].push(action.payload);
    });
    builder.addCase(moveBet, (state: TableState, action) => {
      const [source, destination] = action.payload;
      const sourceKey = slotKeyName(source.placement)
      const destinationKey = slotKeyName(destination.placement)
      state.bets[sourceKey] = state.bets[sourceKey].filter(bet => !isEqual(bet, source));
      if (!state.bets[destinationKey]) {
        state.bets[destinationKey] = [];
      }
      state.bets[destinationKey].push(destination);
    });
  }
});

export const TableActions = TableSlice.actions;

export function useTotalBetForSlotSelector(slot: SlotPlacement): number {
  const bets = useAppSelector((state) => state.table.bets[slotKeyName(slot)]);
  return useMemo(() => (bets || []).reduce((acc, bet) => acc + bet.amount, 0), [bets])
}

export default TableSlice;

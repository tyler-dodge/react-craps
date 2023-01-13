import { createAction } from '@reduxjs/toolkit';
import { TableBet } from '#src/Redux/Table'

export const placeBet = createAction<TableBet>('bets/place');
export const moveBet = createAction<[TableBet, TableBet]>('bets/move');

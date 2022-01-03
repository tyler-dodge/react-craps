import { Middleware } from "@reduxjs/toolkit"
import { PlayerState } from "./Player"
import { TableState } from "./Table";

export const PLAYER_MONEY_KEY = 'craps_player_money';
export const TABLE_KEY = 'craps_table';

export function getStoredMoney(): number | null {
    const money = localStorage.getItem(PLAYER_MONEY_KEY);
    if (money) {
        return +money;
    }
    return null
}

export function getStoredTable(): TableState | null {
    const table = localStorage.getItem(TABLE_KEY);
    if (table) {
        return JSON.parse(table) as TableState;
    }
    return null
}

export const MoneyStorageMiddleware: Middleware<{}, {player: PlayerState, table: TableState}> = store => next => action => {
    const prestate = store.getState();
    const result = next(action);
    const poststate = store.getState();
    if (prestate.player.money !== poststate.player.money) {
        localStorage.setItem(PLAYER_MONEY_KEY,  `${poststate.player.money}`)
    }
    if (prestate.table !== poststate.table) {
        localStorage.setItem(TABLE_KEY, JSON.stringify(poststate.table))
    }
    return result
}

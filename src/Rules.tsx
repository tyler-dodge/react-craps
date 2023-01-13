import { PLAYER_NAME } from "#src/Redux/Player";
import { TableBet, TableActions, TableState } from "#src/Redux/Table";
import { placeBet } from '#src/Redux/Actions';
import Slot, { ComeOddsPlacement, DontComeOddsPlacement, placementNumbers, slotKeyName, SlotPlacement } from "#src/Slot";
import { Dispatch } from "@reduxjs/toolkit";
import { Actions, newDice } from "#src/Redux/Dice";

export function PassLineBetAI(table: TableState, bet: number, dispatch: Dispatch) {
    if (table.point === undefined && (!table.bets[Slot.PASS_LINE] || table.bets[Slot.PASS_LINE].length == 0)) {
        dispatch(
            placeBet({
                player: PLAYER_NAME,
                amount: bet,
                isOn: true,
                inPlay: false,
                placement: Slot.PASS_LINE
            })
        );
    }
}

export function DontPassLineBetAI(table: TableState, bet: number, dispatch: Dispatch) {
    if (table.point === undefined && (!table.bets[Slot.DONT_PASS] || table.bets[Slot.DONT_PASS].length == 0)) {
        dispatch(
            placeBet({
                player: PLAYER_NAME,
                amount: bet,
                isOn: true,
                inPlay: false,
                placement: Slot.DONT_PASS
            })
        );
    }
}

export function ComeBetAI(table: TableState, bet: number, maxComeBets: number, dispatch: Dispatch) {
    var total = 0
    for (let number of placementNumbers()) {
        if (getBet(table, {type: Slot.COME_PLACE, value: number}).length > 0) {
            total += 1
        }
    }
    if (table.point && total < maxComeBets && (getBet(table, Slot.COME_BET).length == 0)) {
        dispatch(
            placeBet({
                player: PLAYER_NAME,
                amount: bet,
                isOn: true,
                inPlay: false,
                placement: Slot.COME_BET
            })
        );
    }
}

export function DontComeBetAI(table: TableState, bet: number, minComeBets: number, dispatch: Dispatch) {
    var total = 0
    for (let number of placementNumbers()) {
        if (getBet(table, {type: Slot.COME_PLACE, value: number}).length > 0) {
            total += 1
        }
    }
    if (table.point && total >= minComeBets && (getBet(table, Slot.DONT_COME_BET).length == 0)) {
        dispatch(
            placeBet({
                player: PLAYER_NAME,
                amount: bet,
                isOn: true,
                inPlay: false,
                placement: Slot.DONT_COME_BET
            })
        );
    }
}

export function PassLineOddsBetAI(table: TableState, multiplier: number, dispatch: Dispatch) {
    const betAmount: number = getBet(table, Slot.PASS_LINE).reduce((acc, item) => acc + item.amount, 0);
    if (table.point && getBet(table, Slot.ODDS).length === 0) {
        dispatch(
            placeBet({
                player: PLAYER_NAME,
                amount: betAmount * multiplier,
                isOn: true,
                inPlay: false,
                placement: Slot.ODDS
            })
        );
    }
}

export function ComeOddsBetAI(table: TableState, multiplier: number, dispatch: Dispatch) {
    
    for (let number of placementNumbers()) {
        const comeKey: SlotPlacement = {
            type: Slot.COME_PLACE,
            value: number
        }
        const placement: ComeOddsPlacement = {
            type: Slot.COME_ODDS,
            value: number
        }
        
        const betAmount = getBet(table, comeKey).reduce((acc, item) => acc + item.amount, 0);
        if (betAmount > 0 && getBet(table, placement).length === 0) {
            dispatch(
                placeBet({
                    player: PLAYER_NAME,
                    amount: betAmount * multiplier,
                    isOn: true,
                    inPlay: false,
                    placement: placement
                })
            );
        }
    }
}

export function DontComeOddsBetAI(table: TableState, multiplier: number, dispatch: Dispatch) {
    for (let number of placementNumbers()) {
        const comeKey: SlotPlacement = {
            type: Slot.DONT_COME_PLACE,
            value: number
        }
        const placement: DontComeOddsPlacement = {
            type: Slot.DONT_COME_ODDS,
            value: number
        }
        
        const betAmount = getBet(table, comeKey).reduce((acc, item) => acc + item.amount, 0);
        if (betAmount > 0 && getBet(table, placement).length === 0) {
            dispatch(
                placeBet({
                    player: PLAYER_NAME,
                    amount: betAmount * multiplier,
                    isOn: true,
                    inPlay: false,
                    placement: placement
                })
            );
        }
    }
}

function getBet(table: TableState, placement: SlotPlacement): TableBet[] {
    const bets = table.bets[slotKeyName(placement)];
    return bets || [];
}

import { Action, Dispatch, Middleware } from "@reduxjs/toolkit";
import {  DiceState } from "Redux/Dice";
import { moveBet, placeBet } from "Redux/Actions";
import { TableBet, TableActions, TableState } from "Redux/Table";
import { PlayerActions } from "Redux/Player";
import Slot, { isHardway, isPlace, isSingleRoll } from "Slot";
import { first } from 'lodash';
import { isPlaceNumber } from "Utils";


/**
 * Transforms the current state into actions, the bets are looked iterated over by listing the keys 
 * of state, so this is useful for the variable numbered slots like the PlaceSlots.
 */
function actionsForDice(dice: number[], diceTotal: number, bets: TableBet[]): Action[] {
    const placement = first(bets)?.placement;
    const diceAreEqual: boolean = dice.reduce((acc, item) => (acc === item && item) || -1) > 0
    const isBigRed = diceTotal === 7;
    
    if (!placement) {
        return [];
    }
    
    if (isHardway(placement)) {
        if (diceTotal === 7) {
            return bets.map(bet => TableActions.removeBet(bet));
        }
        if (placement.value === diceTotal) {
            if (diceAreEqual) {
                let hardwayPayout: number;
                if (diceTotal === 4 || diceTotal === 10) {
                    hardwayPayout = 7
                } else if (diceTotal === 6 || diceTotal === 8) {
                    hardwayPayout = 9
                }
                return bets.flatMap(bet => [PlayerActions.payoutBet({ multiplier: hardwayPayout, bet })]);
            } else {
                return bets.map(bet => TableActions.removeBet(bet));
            }
        }
        return [];
    }
    
    if (isSingleRoll(placement)) {
        if (diceTotal === placement.value) {
            let singleRollPayout: number;
            if (diceTotal === 2 || diceTotal === 12) {
                singleRollPayout = 31;
            } else if (diceTotal === 11 || diceTotal === 3) {
                singleRollPayout = 16;
            }
            return bets.flatMap(bet => [TableActions.removeBet(bet), PlayerActions.payoutBet({multiplier: singleRollPayout, bet})])
        } else {
            return bets.map(bet => TableActions.removeBet(bet))
        }
    }
    
    if (isPlace(placement)) {
        if (diceTotal === 7) {
            return bets.map(bet => TableActions.removeBet(bet));
        }
        if (placement.value === diceTotal) {
            return bets.flatMap(bet => [PlayerActions.payoutBet({multiplier: 2, bet}), TableActions.removeBet(bet)]);
        } else if (isBigRed) {
            return bets.map(bet => TableActions.removeBet(bet));
        } else {
            return [];
        }
    }
    
    if (placement === Slot.FIELD) {
        if (diceTotal === 2 || diceTotal === 12) {
            return bets.flatMap(bet => [PlayerActions.payoutBet({multiplier: 3, bet}), TableActions.removeBet(bet)]);
        } else if (diceTotal === 3 || diceTotal === 4 || diceTotal === 9 || diceTotal === 10 || diceTotal === 11) {
            return bets.flatMap(bet => [PlayerActions.payoutBet({multiplier: 2, bet}), TableActions.removeBet(bet)]);
        } else {
            return bets.map(bet => TableActions.removeBet(bet));
        }
    }
    
    return [];
}

function handlePassLine(diceTotal: number, table: TableState, dispatch: Dispatch) {
    const isBigRed = diceTotal === 7;
    const passLineBets = table.bets[Slot.PASS_LINE] || [];
    if (table.point) {
        if (table.point === diceTotal) {
            dispatch(TableActions.clearPoint({}));
            passLineBets.forEach(bet => {
                dispatch(TableActions.removeBet(bet));
                dispatch(PlayerActions.payoutBet({multiplier: 2, bet}));
            })
        } else if (isBigRed) {
            dispatch(TableActions.clearPoint({}));
            passLineBets.forEach(bet => {
                dispatch(TableActions.removeBet(bet));
            })
        }
    } else {
        if (isPlaceNumber(diceTotal)) {
            dispatch(TableActions.setPoint({
                type: Slot.PLACE,
                value: diceTotal
            }));
        } else if (isBigRed || diceTotal === 11) {
            passLineBets.forEach(bet => dispatch(PlayerActions.payoutBet({
                multiplier: 1,
                bet
            })));
        } else if (diceTotal === 2 || diceTotal === 3 || diceTotal === 12) {
            passLineBets.forEach(bet => dispatch(TableActions.removeBet(bet)));
        }
    }
}

function handleComeBet(diceTotal: number, table: TableState, dispatch: Dispatch) {
    const isBigRed = diceTotal === 7;
    const comeBet = table.bets[Slot.COME_BET] || [];
    if (comeBet.length > 0) {
        if (isBigRed) {
            comeBet.forEach(bet => {
                dispatch(TableActions.removeBet(bet));
                dispatch(PlayerActions.payoutBet({multiplier: 2, bet}))
            })
        } else if (diceTotal === 11) {
            comeBet.forEach(bet => {
                dispatch(PlayerActions.payoutBet({multiplier: 1, bet}))
            })
        } else if (diceTotal === 2 || diceTotal === 3 || diceTotal === 12) {
            comeBet.forEach(bet => {
                dispatch(TableActions.removeBet(bet));
            })
        } else if (diceTotal === 4 || diceTotal === 5 || diceTotal === 6 || diceTotal === 8 || diceTotal === 9 || diceTotal === 10) {
            comeBet.forEach(bet => {
                dispatch(moveBet([bet, {
                    ...bet,
                    placement: {
                        type: Slot.PLACE,
                        value: diceTotal
                    }
                }]));
            })
        }
    }
}

function handleOddsBet(diceTotal: number, table: TableState, dispatch: Dispatch) {
    const oddsBet = table.bets[Slot.ODDS] || [];
    if (diceTotal === 7) {
        oddsBet.forEach(bet => {
            dispatch(TableActions.removeBet(bet));
        })
    } else if (diceTotal === table.point) {
        let multiplier: number;
        if (diceTotal === 4 || diceTotal === 10) {
            multiplier = 3
        } else if (diceTotal === 5 || diceTotal === 9) {
            multiplier = 1 + (3./2)
        } else {
            multiplier = 1 + (6./5)
        }
        oddsBet.forEach(bet => {
            dispatch(TableActions.removeBet(bet))
            dispatch(PlayerActions.payoutBet({ multiplier, bet }))
        })
    }
}


/**
 * Handles doing the logic transformations based on the rules of Craps.
 */
export const CrapsMiddleware: Middleware<{}, {table: TableState, dice: DiceState}> = store => next => action => {
    const beforeState = store.getState();
    const result = next(action);
    const afterState = store.getState();
    if (beforeState.dice.counter !== afterState.dice.counter) {
        const diceTotal: number = afterState.dice.value.reduce((acc, item) => acc + item, 0);
        handlePassLine(diceTotal, afterState.table, store.dispatch)
        handleComeBet(diceTotal, afterState.table, store.dispatch)
        handleOddsBet(diceTotal, afterState.table, store.dispatch)
        
        for (let key in afterState.table.bets) {
            actionsForDice(afterState.dice.value, diceTotal, afterState.table.bets[key]).forEach(action => store.dispatch(action));
        }
    }
    return result
};

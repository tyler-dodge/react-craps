import { Action, Dispatch, Middleware } from "@reduxjs/toolkit";
import {  DiceState } from "Redux/Dice";
import { moveBet, placeBet } from "#src/Redux/Actions";
import { TableBet, TableActions, TableState } from "#src/Redux/Table";
import { PlayerActions } from "#src/Redux/Player";
import Slot, { isHardway, isComeOdds, isDontComeOdds, isDontComePlace, isPlace, isSingleRoll, oddsValue, dontComeValue } from "#src/Slot";
import { first } from 'lodash';
import { isPlaceNumber } from "#src/Utils";
import { MysteryActions, MysteryOfFiftySeriesState } from "#src/Redux/MysteryOfFiftySeries";
import { PlayerState } from "#src/Redux/Player"

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

  
  if (isDontComeOdds(placement)) {
    if (isBigRed) {
      return bets.flatMap(bet => [PlayerActions.payoutBet({multiplier: 1 + dontComeValue(placement.value), bet}), TableActions.removeBet(bet)]);
    }
    if (placement.value === diceTotal) {
         return bets.flatMap(bet => [TableActions.removeBet(bet)]);
    } else {
         return [];
    }
  }
  
  if (isDontComePlace(placement)) {
    if (isBigRed) {
       return bets.flatMap(bet => [PlayerActions.payoutBet({multiplier: 1 + 1, bet}), TableActions.removeBet(bet)]);
    }
    if (placement.value === diceTotal) {
         return bets.flatMap(bet => [TableActions.removeBet(bet)]);
    } else {
         return [];
    }
  }
  
  if (isComeOdds(placement)) {
    if (isBigRed) {
       return bets.flatMap(bet => [TableActions.removeBet(bet)]);
    }
    if (placement.value === diceTotal) {
      return bets.flatMap(bet => [PlayerActions.payoutBet({multiplier: 1 + oddsValue(placement.value), bet}), TableActions.removeBet(bet)]);
    } else {
         return [];
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

function handleDontPassLine(diceTotal: number, table: TableState, dispatch: Dispatch) {
  const isBigRed = diceTotal === 7;
  const passLineBets = table.bets[Slot.DONT_PASS] || [];
  const tablePoint = table.point;
  if (tablePoint !== undefined) {
    if (table.point === diceTotal) {
      passLineBets.forEach(bet => {
        dispatch(TableActions.removeBet(bet));
      })
    } else if (isBigRed) {
      passLineBets.forEach(bet => {
        dispatch(PlayerActions.payoutBet({multiplier: 1 + 1, bet}))
        dispatch(TableActions.removeBet(bet));
      })
    }
  } else {
    if (isBigRed || diceTotal === 11) {
      passLineBets.forEach(bet => dispatch(TableActions.removeBet(bet)));
    } else if (diceTotal === 2 || diceTotal === 3) {
      passLineBets.forEach(bet => {
        dispatch(PlayerActions.payoutBet({multiplier: 1 + 1, bet}))
        dispatch(TableActions.removeBet(bet));
      });
    }
  }
}

function handleDontComeBet(diceTotal: number, table: TableState, dispatch: Dispatch) {
  const isBigRed = diceTotal === 7;
  const comeBet = table.bets[Slot.DONT_COME_BET] || [];
  if (comeBet.length > 0) {
    if (isBigRed || diceTotal === 11) {
      comeBet.forEach(bet => {
        dispatch(TableActions.removeBet(bet));
      })
    } else if (diceTotal === 2 || diceTotal === 3 || diceTotal === 12) {
      comeBet.forEach(bet => {
        dispatch(PlayerActions.payoutBet({multiplier: 1 + 1, bet}));
        dispatch(TableActions.removeBet(bet));
      })
    } else if (diceTotal === 4 || diceTotal === 5 || diceTotal === 6 || diceTotal === 8 || diceTotal === 9 || diceTotal === 10) {
      comeBet.forEach(bet => {
        dispatch(moveBet([bet, {
          ...bet,
          inPlay: true,
          placement: {
            type: Slot.DONT_COME_PLACE,
            value: diceTotal
          }
        }]));
      })
    }
  }
}


function handlePassLine(diceTotal: number, table: TableState, dispatch: Dispatch) {
  const isBigRed = diceTotal === 7;
  const passLineBets = table.bets[Slot.PASS_LINE] || [];
  if (table.point) {
    if (table.point === diceTotal) {
      passLineBets.forEach(bet => {
        dispatch(TableActions.removeBet(bet));
        dispatch(PlayerActions.payoutBet({multiplier: 2, bet}));
      })
    } else if (isBigRed) {
      passLineBets.forEach(bet => {
        dispatch(TableActions.removeBet(bet));
      })
    }
  } else {
    if (isBigRed || diceTotal === 11) {
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
          inPlay: true,
          placement: {
            type: Slot.COME_PLACE,
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
    let multiplier: number = oddsValue(diceTotal);
    oddsBet.forEach(bet => {
      dispatch(TableActions.removeBet(bet))
      dispatch(PlayerActions.payoutBet({ multiplier: 1 + multiplier, bet }))
    })
  }
}


/**
 * Handles doing the logic transformations based on the rules of Craps.
 */
export const CrapsMiddleware: Middleware<{}, {
  table: TableState, 
  player: PlayerState,
  mystery: MysteryOfFiftySeriesState, dice: DiceState}> = store => next => action => {
    const beforeState = store.getState();
  const result = next(action);
  if (beforeState.dice.counter !== store.getState().dice.counter) {
    const diceTotal: number = store.getState().dice.value.reduce((acc, item) => acc + item, 0);
    const afterState = store.getState();
    
    for (let key in store.getState().table.bets) {
      actionsForDice(store.getState().dice.value, diceTotal, store.getState().table.bets[key]).forEach(action => store.dispatch(action));
    }

    handleDontPassLine(diceTotal, store.getState().table, store.dispatch)
    handlePassLine(diceTotal, store.getState().table, store.dispatch)
    handleComeBet(diceTotal, store.getState().table, store.dispatch)
    handleDontComeBet(diceTotal, store.getState().table, store.dispatch)
    handleOddsBet(diceTotal, store.getState().table, store.dispatch)

    store.dispatch(MysteryActions.pushHistory({
      money: store.getState().player.money,
      lastPayout: store.getState().player.lastPayout
    }))

    if (store.getState().table.point) {
      if (store.getState().table.point === diceTotal || diceTotal === 7) {
        store.dispatch(TableActions.clearPoint({}));
      }
    } else {
      if (isPlaceNumber(diceTotal)) {
        store.dispatch(TableActions.setPoint({
          type: Slot.COME_PLACE,
          value: diceTotal
        }));
      }
    }
  }
  return result
};

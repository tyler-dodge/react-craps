import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { newStore } from '#src/Redux/Store';
import { Provider } from 'react-redux';
import { Actions } from '#src/Redux/Dice';
import { TableActions } from '#src/Redux/Table';
import { placeBet } from '#src/Redux/Actions';
import { PLAYER_NAME } from '#src/Redux/Player';
import Slot, { slotKeyName } from '#src/Slot';
import { Store } from '@reduxjs/toolkit';

const testFixture = (store: Store) => render(
    <React.StrictMode>
      <Provider store={store}>
        <div className="max-w-screen-lg mr-auto ml-auto">
          <App />
        </div>
      </Provider>
    </React.StrictMode>
);

test('renders as expected', () => {
    testFixture(newStore());
    const diceElement = screen.getByText(/Roll The Dice/i);
    expect(diceElement).toBeInTheDocument();
});


test('store should handle dice updates', () => {
    const store = newStore();
    expect(store.getState().player.money).toEqual(1000)
    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: {
            type: Slot.COME_PLACE,
            value: 6
        }
    }));
    store.dispatch(Actions.rollDice([3, 3]));
    expect(store.getState().dice.value).toEqual([3, 3])
    expect(store.getState().player.money).toEqual(1010)
    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: {
            type: Slot.COME_PLACE,
            value: 6
        }
    }));
    store.dispatch(Actions.rollDice([3, 3]))
    expect(store.getState().player.money).toEqual(1020)
    store.dispatch(Actions.rollDice([3, 3]))
    expect(store.getState().player.money).toEqual(1020)
});



test('store should handle come bet updates', () => {
    const store = newStore();
    expect(store.getState().player.money).toEqual(1000)

    store.dispatch(Actions.rollDice([3, 3]));
    expect(store.getState().dice.value).toEqual([3, 3])
    expect(store.getState().table.point).toEqual(6)

    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.COME_BET,
    }));

    expect(store.getState().player.money).toEqual(990)
    expect(store.getState().table.bets[slotKeyName(Slot.COME_BET)]).toEqual([{
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.COME_BET,
    }])

    store.dispatch(Actions.rollDice([3, 3]));
    expect(store.getState().dice.value).toEqual([3, 3])
    expect(store.getState().table.point).toEqual(undefined);
    expect(store.getState().player.money).toEqual(990)

    store.dispatch(Actions.rollDice([3, 3]));
    expect(store.getState().dice.value).toEqual([3, 3])
    expect(store.getState().table.point).toEqual(6);
    expect(store.getState().player.money).toEqual(1010)
    store.dispatch(Actions.rollDice([3, 3]));
    store.dispatch(Actions.rollDice([3, 3]));
    expect(store.getState().dice.value).toEqual([3, 3])
    expect(store.getState().table.point).toEqual(6);
    expect(store.getState().player.money).toEqual(1010)

    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.COME_BET,
    }));

    expect(store.getState().player.money).toEqual(1000)
    expect(store.getState().table.bets[slotKeyName(Slot.COME_BET)]).toEqual([{
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.COME_BET,
    }])
    store.dispatch(Actions.rollDice([4, 3]));
    expect(store.getState().player.money).toEqual(1020)
    expect(store.getState().table.bets[slotKeyName(Slot.COME_BET)]).toEqual([])

    store.dispatch(Actions.rollDice([3, 3]));
    expect(store.getState().dice.value).toEqual([3, 3])
    expect(store.getState().table.point).toEqual(6);
    expect(store.getState().player.money).toEqual(1020)

    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.COME_BET,
    }));

    expect(store.getState().player.money).toEqual(1010)
    expect(store.getState().table.bets[slotKeyName(Slot.COME_BET)]).toEqual([{
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.COME_BET,
    }])
    store.dispatch(Actions.rollDice([4, 3]));
    expect(store.getState().player.money).toEqual(1030)
    expect(store.getState().table.bets[slotKeyName(Slot.COME_BET)]).toEqual([])


    store.dispatch(Actions.rollDice([3, 3]));
    expect(store.getState().dice.value).toEqual([3, 3])
    expect(store.getState().table.point).toEqual(6);
    expect(store.getState().player.money).toEqual(1030)

    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.COME_BET,
    }));

    expect(store.getState().player.money).toEqual(1020)
    expect(store.getState().table.bets[slotKeyName(Slot.COME_BET)]).toEqual([{
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.COME_BET,
    }])
    store.dispatch(Actions.rollDice([6, 6]));
    expect(store.getState().player.money).toEqual(1020)
    expect(store.getState().table.bets[slotKeyName(Slot.COME_BET)]).toEqual([])

    store.dispatch(Actions.rollDice([6, 6]));
    expect(store.getState().player.money).toEqual(1020)
});


test('store should handle pass line odds updates', () => {
    const store = newStore();
    expect(store.getState().player.money).toEqual(1000)
    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.PASS_LINE,
    }));

    expect(store.getState().player.money).toEqual(990)

    store.dispatch(Actions.rollDice([3, 3]));
    expect(store.getState().dice.value).toEqual([3, 3])
    expect(store.getState().table.point).toEqual(6)

    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 30,
        isOn: true,
        inPlay: false,
        placement: Slot.ODDS,
    }));
    expect(store.getState().player.money).toEqual(960)

    store.dispatch(Actions.rollDice([3, 3]));
    expect(store.getState().dice.value).toEqual([3, 3])
    expect(store.getState().table.point).toEqual(undefined)
    expect(store.getState().player.money).toEqual(1046)


    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.PASS_LINE,
    }));

    expect(store.getState().player.money).toEqual(1036)

    store.dispatch(Actions.rollDice([3, 2]));
    expect(store.getState().dice.value).toEqual([3, 2])
    expect(store.getState().table.point).toEqual(5)

    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 30,
        isOn: true,
        inPlay: false,
        placement: Slot.ODDS,
    }));
    expect(store.getState().player.money).toEqual(1006)

    store.dispatch(Actions.rollDice([3, 2]));
    expect(store.getState().dice.value).toEqual([3, 2])
    expect(store.getState().table.point).toEqual(undefined)
    expect(store.getState().player.money).toEqual(1101)

    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.PASS_LINE,
    }));

    expect(store.getState().player.money).toEqual(1091)

    store.dispatch(Actions.rollDice([2, 2]));
    expect(store.getState().dice.value).toEqual([2, 2])
    expect(store.getState().table.point).toEqual(4)

    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 30,
        isOn: true,
        inPlay: false,
        placement: Slot.ODDS,
    }));
    expect(store.getState().player.money).toEqual(1061)

    store.dispatch(Actions.rollDice([2, 2]));
    expect(store.getState().dice.value).toEqual([2, 2])
    expect(store.getState().table.point).toEqual(undefined)
    expect(store.getState().player.money).toEqual(1171)


    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.PASS_LINE,
    }));

    expect(store.getState().player.money).toEqual(1161)

    store.dispatch(Actions.rollDice([2, 2]));
    expect(store.getState().dice.value).toEqual([2, 2])
    expect(store.getState().table.point).toEqual(4)

    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 30,
        isOn: true,
        inPlay: false,
        placement: Slot.ODDS,
    }));
    expect(store.getState().player.money).toEqual(1131)

    store.dispatch(Actions.rollDice([4, 3]));
    expect(store.getState().dice.value).toEqual([4, 3])
    expect(store.getState().table.point).toEqual(undefined)
    expect(store.getState().player.money).toEqual(1131)

    expect(store.getState().table.bets[slotKeyName(Slot.ODDS)]).toEqual([])
    expect(store.getState().table.bets[slotKeyName(Slot.PASS_LINE)]).toEqual([])
});

test('store should handle dont come updates', () => {
    const store = newStore();
    expect(store.getState().player.money).toEqual(1000)

    store.dispatch(Actions.rollDice([3, 3]));
    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.DONT_COME_BET,
    }));

    expect(store.getState().player.money).toEqual(990)
    expect(store.getState().dice.value).toEqual([3, 3])
    expect(store.getState().table.point).toEqual(6)

    store.dispatch(Actions.rollDice([3, 3]));
    expect(store.getState().dice.value).toEqual([3, 3])
    expect(store.getState().table.point).toEqual(undefined);
    expect(store.getState().table.bets[slotKeyName(Slot.DONT_COME_BET)]).toEqual([])
    expect(store.getState().player.money).toEqual(990)

    store.dispatch(Actions.rollDice([3, 3]));
    expect(store.getState().dice.value).toEqual([3, 3])
    expect(store.getState().player.money).toEqual(990)
    expect(store.getState().table.point).toEqual(6)

    store.dispatch(Actions.rollDice([3, 3]));
    expect(store.getState().dice.value).toEqual([3, 3])
    expect(store.getState().table.point).toEqual(undefined);
    expect(store.getState().player.money).toEqual(990)


    store.dispatch(Actions.rollDice([4, 4]));
    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.DONT_PASS,
    }));
    expect(store.getState().player.money).toEqual(980)
    store.dispatch(Actions.rollDice([4, 3]));
    expect(store.getState().dice.value).toEqual([4, 3])
    expect(store.getState().table.point).toEqual(undefined);
    expect(store.getState().player.money).toEqual(1000)
    expect(store.getState().table.bets[Slot.DONT_PASS]).toEqual([])

    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.DONT_PASS,
    }));
    expect(store.getState().table.bets[Slot.DONT_PASS]).toEqual([
        {"amount": 10, "inPlay": false, "isOn": true, "placement": Slot.DONT_PASS, "player": "user"}
    ])
    expect(store.getState().player.money).toEqual(990)
    store.dispatch(Actions.rollDice([6, 6]));
    expect(store.getState().dice.value).toEqual([6, 6])
    expect(store.getState().table.point).toEqual(undefined);
    expect(store.getState().player.money).toEqual(990)
    expect(store.getState().table.bets[Slot.DONT_PASS]).toEqual([
        {"amount": 10, "inPlay": false, "isOn": true, "placement": Slot.DONT_PASS, "player": "user"}
    ])

    store.dispatch(Actions.rollDice([1, 1]));
    expect(store.getState().table.point).toEqual(undefined);
    expect(store.getState().player.money).toEqual(1010)
    expect(store.getState().table.bets[Slot.DONT_PASS]).toEqual([])


    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.DONT_PASS,
    }));
    expect(store.getState().table.bets[Slot.DONT_PASS]).toEqual([
        {"amount": 10, "inPlay": false, "isOn": true, "placement": Slot.DONT_PASS, "player": "user"}
    ])
    expect(store.getState().player.money).toEqual(1000)
    store.dispatch(Actions.rollDice([1, 2]));
    expect(store.getState().dice.value).toEqual([1, 2])
    expect(store.getState().table.point).toEqual(undefined);
    expect(store.getState().player.money).toEqual(1020)
    expect(store.getState().table.bets[Slot.DONT_PASS]).toEqual([])

    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.DONT_PASS,
    }));
    expect(store.getState().table.bets[Slot.DONT_PASS]).toEqual([
        {"amount": 10, "inPlay": false, "isOn": true, "placement": Slot.DONT_PASS, "player": "user"}
    ])
    expect(store.getState().player.money).toEqual(1010)
    store.dispatch(Actions.rollDice([2, 2]));
    expect(store.getState().dice.value).toEqual([2, 2])
    expect(store.getState().table.point).toEqual(4);
    expect(store.getState().player.money).toEqual(1010)
    expect(store.getState().table.bets[Slot.DONT_PASS]).toEqual([
        {"amount": 10, "inPlay": false, "isOn": true, "placement": Slot.DONT_PASS, "player": "user"}]
    )
    store.dispatch(Actions.rollDice([4, 3]));
    expect(store.getState().dice.value).toEqual([4, 3])
    expect(store.getState().table.point).toEqual(undefined);
    expect(store.getState().player.money).toEqual(1030)

    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.DONT_PASS,
    }));
    expect(store.getState().table.bets[Slot.DONT_PASS]).toEqual([
        {"amount": 10, "inPlay": false, "isOn": true, "placement": Slot.DONT_PASS, "player": "user"}
    ])
    expect(store.getState().player.money).toEqual(1020)
    store.dispatch(Actions.rollDice([3, 2]));
    expect(store.getState().dice.value).toEqual([3, 2])
    expect(store.getState().table.point).toEqual(5);
    expect(store.getState().player.money).toEqual(1020)
    expect(store.getState().table.bets[Slot.DONT_PASS]).toEqual([
        {"amount": 10, "inPlay": false, "isOn": true, "placement": Slot.DONT_PASS, "player": "user"}]
    )
    store.dispatch(Actions.rollDice([4, 3]));
    expect(store.getState().dice.value).toEqual([4, 3])
    expect(store.getState().table.point).toEqual(undefined);
    expect(store.getState().player.money).toEqual(1040)

    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.DONT_PASS,
    }));
    expect(store.getState().table.bets[Slot.DONT_PASS]).toEqual([
        {"amount": 10, "inPlay": false, "isOn": true, "placement": Slot.DONT_PASS, "player": "user"}
    ])
    expect(store.getState().player.money).toEqual(1030)
    store.dispatch(Actions.rollDice([3, 3]));
    expect(store.getState().dice.value).toEqual([3, 3])
    expect(store.getState().table.point).toEqual(6);
    expect(store.getState().player.money).toEqual(1030)
    expect(store.getState().table.bets[Slot.DONT_PASS]).toEqual([
        {"amount": 10, "inPlay": false, "isOn": true, "placement": Slot.DONT_PASS, "player": "user"}]
    )
    store.dispatch(Actions.rollDice([4, 3]));
    expect(store.getState().dice.value).toEqual([4, 3])
    expect(store.getState().table.point).toEqual(undefined);
    expect(store.getState().player.money).toEqual(1050)

    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.DONT_PASS,
    }));
    store.dispatch(Actions.rollDice([5, 5]));
    store.dispatch(Actions.rollDice([6, 6]));
    expect(store.getState().dice.value).toEqual([6, 6])
    expect(store.getState().table.point).toEqual(10);
    expect(store.getState().player.money).toEqual(1040)
    expect(store.getState().table.bets[Slot.DONT_PASS]).toEqual([
        {"amount": 10, "inPlay": false, "isOn": true, "placement": Slot.DONT_PASS, "player": "user"}]
    )

    store.dispatch(Actions.rollDice([5, 5]));
    expect(store.getState().dice.value).toEqual([5, 5])
    expect(store.getState().table.point).toEqual(undefined);
    expect(store.getState().player.money).toEqual(1040)
    expect(store.getState().table.bets[Slot.DONT_PASS]).toEqual([])
});

test('store should handle dont come odds updates', () => {
    const store = newStore();
    expect(store.getState().player.money).toEqual(1000)

    store.dispatch(Actions.rollDice([3, 3]));
    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: Slot.DONT_COME_BET,
    }));
    store.dispatch(Actions.rollDice([3, 5]));
    store.dispatch(placeBet({
        player: PLAYER_NAME,
        amount: 10,
        isOn: true,
        inPlay: false,
        placement: {
            type: Slot.DONT_COME_ODDS,
            value: 6
        },
    }));
    expect(store.getState().player.money).toEqual(980)
    store.dispatch(Actions.rollDice([3, 4]));
    expect(store.getState().player.money).toEqual(1018.3333333333334)
});

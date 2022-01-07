import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { newStore } from 'Redux/Store';
import { Provider } from 'react-redux';
import { Actions } from 'Redux/Dice';
import { TableActions } from 'Redux/Table';
import { placeBet } from 'Redux/Actions';
import { PLAYER_NAME } from 'Redux/Player';
import Slot, { slotKeyName } from 'Slot';
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
      type: Slot.PLACE,
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
      type: Slot.PLACE,
      value: 6
    }
  }));
  store.dispatch(Actions.rollDice([3, 3]))
  expect(store.getState().player.money).toEqual(1020)
  store.dispatch(Actions.rollDice([3, 3]))
  expect(store.getState().player.money).toEqual(1020)
});


test('store should handle pass line updates', () => {
  const store = newStore();
  expect(store.getState().player.money).toEqual(1000)
  store.dispatch(placeBet({
    player: PLAYER_NAME,
    amount: 10,
    isOn: true,
    inPlay: false,
    placement: Slot.PASS_LINE,
  }));
  store.dispatch(Actions.rollDice([3, 3]));
  expect(store.getState().dice.value).toEqual([3, 3])
  store.dispatch(Actions.rollDice([3, 3]));
  expect(store.getState().dice.value).toEqual([3, 3])
  expect(store.getState().table.bets[slotKeyName(Slot.PASS_LINE)]).toEqual([])
});

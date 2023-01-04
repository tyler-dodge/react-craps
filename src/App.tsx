import React from 'react';
import { Die } from 'Components/Die';
import { ConnectedBoardSlot } from 'Redux/ConnectedBoardSlot';
import { ChipDisplay } from 'Components/ChipDisplay';
import { PlayerMoney } from 'Components/PlayerMoney';
import { DiceRoller } from 'Components/DiceRoller';
import Slot from 'Slot';
import ChipDenominationPicker from 'Components/ChipDenominationPicker';

function App() {
  return (
    <>
      <div className="sm:relative sm:grid-cols-3
        z-50 w-full place-items-center grid-cols-1 grid fixed border-lime-100 border-b-2 bg-slate-100">
        <div className="sm:text-left sm:text-6xl sm:justify-self-start
          md:text-7xl
          lg:text-8xl
          w-full text-center text-4xl self-end min-w-fit">CRAPS</div>
        <DiceRoller>
          <PlayerMoney />
        </DiceRoller>
      </div>
      <div className="sm:h-0 h-56"></div>
      <div className="grid grid-cols-1 sm:grid-cols-6">
        <ConnectedBoardSlot placement={{ type: Slot.PLACE, value: 4}} />
        <ConnectedBoardSlot placement={{ type: Slot.PLACE, value: 5}} />
        <ConnectedBoardSlot placement={{ type: Slot.PLACE, value: 6}} />
        <ConnectedBoardSlot placement={{ type: Slot.PLACE, value: 8}} />
        <ConnectedBoardSlot placement={{ type: Slot.PLACE, value: 9}} />
        <ConnectedBoardSlot placement={{ type: Slot.PLACE, value: 10}} />
        <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_PLACE, value: 4}} />
        <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_PLACE, value: 5}} />
        <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_PLACE, value: 6}} />
        <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_PLACE, value: 8}} />
        <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_PLACE, value: 9}} />
        <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_PLACE, value: 10}} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 min-h-max-content">
        <div className='flex gap-0 flex-col order-last sm:order-none items-stretch place-self-stretch border-r-2 border-lime-200'>
          <ConnectedBoardSlot placement={ Slot.COME_BET } />
          <ConnectedBoardSlot placement={ Slot.DONT_COME_BET } />
          <ConnectedBoardSlot placement={ Slot.FIELD } />
          <ConnectedBoardSlot placement={ Slot.DONT_PASS } />
          <ConnectedBoardSlot placement={ Slot.PASS_LINE } />
          <ConnectedBoardSlot placement={ Slot.ODDS } />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <h3 className="text-2xl sm:col-span-2 text-slate-900 lg:text-6xl uppercase">Hard Ways</h3>
          <ConnectedBoardSlot placement={{type: Slot.HARD_WAY, value: 4}} />
          <ConnectedBoardSlot placement={{type: Slot.HARD_WAY, value: 6}} />
          <ConnectedBoardSlot placement={{type: Slot.HARD_WAY, value: 8}} />
          <ConnectedBoardSlot placement={{type: Slot.HARD_WAY, value: 10}} />
          <h3 className="text-2xl sm:col-span-2 text-slate-900 lg:text-6xl uppercase">Single Roll Bets</h3>
          <ConnectedBoardSlot placement={{type: Slot.SINGLE_ROLL, value: 2}} />
          <ConnectedBoardSlot placement={{type: Slot.SINGLE_ROLL, value: 12}} />
          <ConnectedBoardSlot placement={{type: Slot.SINGLE_ROLL, value: 3}} />
          <ConnectedBoardSlot placement={{type: Slot.SINGLE_ROLL, value: 11}} />
        </div>
        <div className="md:left-0 md:bottom-0 grid grid-cols-5 sm:grid-cols-5 pt-4 pb-2 md:p-8 md:pt-4 md:pb-4 md:rounded-2xl bg-green-300 place-items-center">
          <ChipDenominationPicker />
        </div>
      </div>
      <div>
        <h3 className="text-2xl">Auto Gambler</h3>

      </div>
      <div className="h-[96px]"></div>
      <div className="sm:absolute sm:bottom-4 sm:right-4">
        <div className="text-slate-500">
          T Dodge Consulting LLC
        </div>
      </div>
    </>
  );
}

export default App;

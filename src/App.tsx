import React from 'react';
import { Die } from 'Components/Die';
import { ConnectedBoardSlot } from 'Redux/ConnectedBoardSlot';
import { ChipDisplay } from 'Components/ChipDisplay';
import { PlayerMoney } from 'Components/PlayerMoney';
import { DiceRoller } from 'Components/DiceRoller';
import Slot from 'Slot';

function App() {
    return (
        <>
            <div className="grid grid-cols-1 bg-slate-100 w-full z-50 fixed sm:relative sm:grid-cols-3 place-items-center border-b-2 border-lime-100">
                <div className="lg:text-8xl md:text-7xl sm:text-6xl w-full text-center sm:text-left sm:justify-self-start self-end min-w-fit text-4xl">CRAPS</div>
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 min-h-max-content">
                <div className='flex gap-0 flex-col order-last sm:order-none items-stretch place-self-stretch border-r-2 border-lime-200'>
                    <ConnectedBoardSlot placement={ Slot.COME_BET } />
                    <ConnectedBoardSlot placement={ Slot.FIELD } />
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
            </div>
        </>
    );
}

export default App;

import { useEffect } from 'react';
import { Die } from '#src/Components/Die';
import { ConnectedBoardSlot } from '#src/Redux/ConnectedBoardSlot';
import { ChipDisplay } from '#src/Components/ChipDisplay';
import { PlayerMoney } from '#src/Components/PlayerMoney';
import { DiceRoller } from '#src/Components/DiceRoller';
import Slot from '#src/Slot';
import ChipDenominationPicker from '#src/Components/ChipDenominationPicker';
import { PassLineBetAI } from '#src/Rules';
import { ConnectedAI } from '#src/Redux/ConnectedAI';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
    Line,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAppSelector } from './Redux/hooks';

let initialized = false;

if (!initialized) {
    initialized = true;
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        ChartTitle,
        Tooltip,
        Legend
    );
}

function App() {
    const money = useAppSelector((state) => state.mystery.moneyHistory);
    const labels = useAppSelector((state) => state.mystery.labels);
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
            <ConnectedBoardSlot placement={{ type: Slot.COME_PLACE, value: 4}} />
            <ConnectedBoardSlot placement={{ type: Slot.COME_PLACE, value: 5}} />
            <ConnectedBoardSlot placement={{ type: Slot.COME_PLACE, value: 6}} />
            <ConnectedBoardSlot placement={{ type: Slot.COME_PLACE, value: 8}} />
            <ConnectedBoardSlot placement={{ type: Slot.COME_PLACE, value: 9}} />
            <ConnectedBoardSlot placement={{ type: Slot.COME_PLACE, value: 10}} />
            <ConnectedBoardSlot placement={{ type: Slot.COME_ODDS, value: 4}} />
            <ConnectedBoardSlot placement={{ type: Slot.COME_ODDS, value: 5}} />
            <ConnectedBoardSlot placement={{ type: Slot.COME_ODDS, value: 6}} />
            <ConnectedBoardSlot placement={{ type: Slot.COME_ODDS, value: 8}} />
            <ConnectedBoardSlot placement={{ type: Slot.COME_ODDS, value: 9}} />
            <ConnectedBoardSlot placement={{ type: Slot.COME_ODDS, value: 10}} />
            <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_PLACE, value: 4}} />
            <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_PLACE, value: 5}} />
            <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_PLACE, value: 6}} />
            <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_PLACE, value: 8}} />
            <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_PLACE, value: 9}} />
            <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_PLACE, value: 10}} />
            <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_ODDS, value: 4}} />
            <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_ODDS, value: 5}} />
            <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_ODDS, value: 6}} />
            <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_ODDS, value: 8}} />
            <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_ODDS, value: 9}} />
            <ConnectedBoardSlot placement={{ type: Slot.DONT_COME_ODDS, value: 10}} />
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
            <h3 className="text-2xl">AUTO GAMBLER</h3>
            <ConnectedAI />
          </div>
            <Line className="col-span-3"
            height="300"
                  options={{ 
                      animations: false }}
                  data={{
                      labels: labels,
                      datasets: [{
                          backgroundColor: "#dbdeef",
                          borderColor: "#dbdeef",
                          label: "Money",
                          data: money
                      }]
                  }} />
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

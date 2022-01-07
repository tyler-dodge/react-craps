import { BoardSlotProps, DiceBoardSlot, PlaceBoardSlot, TextBoardSlot } from 'Components/BoardSlot';
import { ChipDisplay } from 'Components/ChipDisplay';
import Slot, { isHardway, isPlace, isSingleRoll, SlotPlacement } from 'Slot';
import { PlayerActions, PLAYER_NAME } from 'Redux/Player';
import { placeBet } from 'Redux/Actions';
import { useAppDispatch, useAppSelector } from './hooks';
import { TableActions, useTotalBetForSlotSelector, useTotalNotInPlayBetForSlotSelector } from './Table';
import { PointChip } from 'Components/PointChip';


/**
 * BoardSlot for ComeSlot. Uses a TextBoardSlot.
 */
function ComeSlot(props: BoardSlotProps) {
  const point = useAppSelector((state) => state.table.point);
  const childProps = {
    ...props,
    isDisabled: point === undefined,
  };

  return (<TextBoardSlot {...childProps } />);
}


/**
 * BoardSlot for PassLineSlot. Uses a TextBoardSlot.
 */
function PassLineSlot(props: BoardSlotProps) {
  const point = useAppSelector((state) => state.table.point);
  const childProps = {
    ...props,
    isDisabled: point !== undefined,
  };

  return (<TextBoardSlot {...childProps} />);
}

/**
 * BoardSlot for Odds. Uses a TextBoardSlot.
 */
function OddsSlot(props: BoardSlotProps) {
  const point = useAppSelector((state) => state.table.point);
  const betIncrement = useAppSelector((state) => state.player.betIncrement);
  const passLineSum = useTotalBetForSlotSelector(Slot.PASS_LINE);
  const oddsSum = useTotalBetForSlotSelector(Slot.ODDS);

  const childProps = {
    ...props,
    isDisabled: !(point !== undefined && passLineSum > 0 && oddsSum + betIncrement <= passLineSum * 2),
  };
  
  return (<TextBoardSlot {...childProps} />)
}

export interface ConnectedBoardSlotProps { 
  placement: SlotPlacement, 
  children?: JSX.Element[]
};

/**
 * Handles routing a given Slot to the correct kind of React Component with some defaults
 * from the redux store. This is meant to be the main entry point into BoardSlots.
 * 
 */
export function ConnectedBoardSlot(props: ConnectedBoardSlotProps) {
  const dispatch = useAppDispatch();
  const amount = useTotalBetForSlotSelector(props.placement);
  const notInPlayAmount = useTotalNotInPlayBetForSlotSelector(props.placement)
  const playerMoney = useAppSelector((state) => state.player.money);
  const point = useAppSelector((state) => state.table.point);
  const isPoint = isPlace(props.placement) && props.placement.value === point;
  const betIncrement = useAppSelector((state) => state.player.betIncrement);
  const canAffordIncrement = playerMoney >= betIncrement;

  let SlotType: (props: BoardSlotProps) => JSX.Element;
  if (props.placement === Slot.COME_BET) {
    SlotType = ComeSlot;
  } else if (props.placement === Slot.PASS_LINE) {
    SlotType = PassLineSlot;
  } else if (props.placement === Slot.ODDS) {
    SlotType = OddsSlot;
  } else if (isHardway(props.placement) || isSingleRoll(props.placement)) {
    SlotType = DiceBoardSlot;
  } else if (isPlace(props.placement)) {
    SlotType = PlaceBoardSlot;
  } else {
    SlotType = TextBoardSlot;
  }
  
  
  const dispatchPlaceBet = () => {
    if (betIncrement < 0) {
      const actualAmount = Math.min(notInPlayAmount, Math.abs(betIncrement))
      dispatch(TableActions.removeNotInPlayBet({
        placement: props.placement,
        amount: actualAmount
      }))
    } else {
      dispatch(placeBet({
        player: PLAYER_NAME,
        amount: betIncrement,
        isOn: true,
        inPlay: false,
        placement: props.placement
      }))
    }
  };
  
  const isEnabled = canAffordIncrement;
  
  return (
    <span className='cursor-pointer select-none'>
      <SlotType isDisabled={false} {...props} onClick={() => isEnabled && dispatchPlaceBet() }>
        <div className={ (betIncrement < 0 && "sm:hover:opacity-50 ") + " w-full h-full grid grid-cols-1 absolute place-items-center"}>
          {(amount > 0 && <div className="shadow-sm shadow-black w-fit h-fit rounded-full"><ChipDisplay volume={amount} /></div>) || <></> }
        </div>
        {(isPoint && <PointChip />) || <></> }
        <div className={" w-full h-full grid grid-cols-1 absolute place-items-center opacity-0 sm:hover:opacity-100"}>
        {(betIncrement > 0 && <div className="shadow-sm shadow-black w-fit h-fit bottom-4 absolute rounded-full z-50"><ChipDisplay volume={betIncrement} /></div>) || <></> }
        </div>
      </SlotType>
    </span>
  );
}

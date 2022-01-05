import { BoardSlotProps, DiceBoardSlot, PlaceBoardSlot, TextBoardSlot } from 'Components/BoardSlot';
import { ChipDisplay } from 'Components/ChipDisplay';
import Slot, { isHardway, isPlace, isSingleRoll, SlotPlacement } from 'Slot';
import { PLAYER_NAME } from 'Redux/Player';
import { placeBet } from 'Redux/Actions';
import { useAppDispatch, useAppSelector } from './hooks';
import {  useTotalBetForSlotSelector } from './Table';
import { PointChip } from 'Components/PointChip';
const betIncrement = 10; 


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
  const playerMoney = useAppSelector((state) => state.player.money);
  const point = useAppSelector((state) => state.table.point);
  const isPoint = isPlace(props.placement) && props.placement.value === point;
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
  
  
  const dispatchPlaceBet = () => dispatch(placeBet({
    player: PLAYER_NAME,
    amount: betIncrement,
    placement: props.placement
  }));
  
  const isEnabled = canAffordIncrement;
  
  return (
    <span className='cursor-pointer select-none'>
      <SlotType isDisabled={false} {...props} onClick={() => isEnabled && dispatchPlaceBet() }>
        {(amount > 0 && <ChipDisplay volume={amount} />) || <></> }
        {(isPoint && <PointChip />) || <></> }
      </SlotType>
    </span>
  );
}

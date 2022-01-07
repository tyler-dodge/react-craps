import { isHardway, isPlace, isSingleRoll, SlotPlacement } from 'Slot';
import Die from 'Components/Die';


export interface BoardSlotProps { 
  placement: SlotPlacement, 
  isDisabled: Boolean,
  onClick: React.MouseEventHandler,
  children?: JSX.Element[]
};

function commonSettings(props: BoardSlotProps): { disabledClass: string, onClick: React.MouseEventHandler } {
  return {
    disabledClass: props.isDisabled ? 'bg-green-200' : 'bg-green-300 hover:bg-green-400',
    onClick: (event) => props.isDisabled || props.onClick(event)
  }
}

export function PlaceBoardSlot(props: BoardSlotProps) {
  const {disabledClass, onClick} = commonSettings(props)
  if (!isPlace(props.placement)) {
    return <></>
  }
  return (
    <div className={ disabledClass + " text-1xl h-32 border-b-2 border-r-2 relative place-items-center border-lime-200 text-slate-700"} onClick={onClick}>
      <div className="border-b-2 border-r-2 p-2 border-lime-200 min-w-fit w-fit">
        {props.placement.value}
      </div>
      <div className="z-10 w-full grid grid-col-1 place-items-center h-full absolute top-0">
      {props.children}
      </div>
    </div>
  )
}

export function DiceBoardSlot(props: BoardSlotProps) {
  const {disabledClass, onClick} = commonSettings(props)
  if (!isHardway(props.placement) && !isSingleRoll(props.placement)) {
    return <></>
  }
  return (
    <div className={ disabledClass + " text-1xl relative h-16 sm:h-28 border-b-2 border-r-2 border-lime-200 text-slate-700"} onClick={onClick}>
      <div className="border-b-2 border-r-2 p-2 border-lime-200 min-w-fit w-fit grid grid-cols-2">
        <Die className="border-lime-600 bg-green-400" value={Math.floor(props.placement.value / 2)} />
        <Die className="border-lime-600 bg-green-400" value={Math.floor(props.placement.value / 2) + (props.placement.value % 2)} />
      </div>
      <div className="grid grid-col-1 absolute top-0 h-full items-center place-self-center place-items-center z-10 sm:bottom-8 w-full">
        {props.children}
      </div>
    </div>
  )
}

export function TextBoardSlot(props: BoardSlotProps) {
  const {disabledClass, onClick} = commonSettings(props)
  return (
    <div className={ disabledClass + " w-full min-h-fit p-8 h-16 grid grid-cols-1 border-b-2 border-lime-200 relative"} onClick={onClick}>
      <h3 className="text-1xl absolute text-center place-self-center uppercase text-2xl sm:text-6xl">{props.placement}</h3>
      <div className="grid grid-col-1 place-items-center place-self-center absolute z-10 bottom-0 w-full h-full">
        {props.children}
      </div>
    </div>
  )
}

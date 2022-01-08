import { range } from 'Utils';
import { first } from 'lodash'

export interface DieProps {
  value: number;
  className?: string;
  dieColor?: string;
  colorOverride?: DieOverride
}

enum DieOverride {
  BigRed = "BigRed",
  BoxCars = "BoxCars",
  SnakeEyes = "SnakeEyes",
  HardWay = "HardWay",
  Eleven = "Eleven",
}

export function overrideForDice(dice: number[]): DieOverride | undefined {
  const diceTotal = dice.reduce((acc, item) => acc + item, 0)
  const firstDice = first(dice)
  const diceEqual = !dice.reduce((acc, item) => acc || firstDice !== item, false)
  if (diceTotal === 11) {
    return DieOverride.Eleven;
  } else if (diceTotal === 7) {
    return DieOverride.BigRed;
  } else if (diceTotal === 12) {
    return DieOverride.BoxCars;
  } else if (diceTotal === 2) {
    return DieOverride.SnakeEyes;
  } else if (diceEqual) {
    return DieOverride.HardWay;
  }
  return undefined;
}

interface DieDotProps {
  visible: boolean;
  className?: string;
  dieColor?: string;
  colorOverride?: DieOverride
}

function DieDot(props: DieDotProps) {
  const visible_class = ((!props.visible && 'invisible') || '');
  const class_name = props.className || 'border-black';
  
  const die_color = props.dieColor || 'bg-slate-900'
  const style = class_name + " " + die_color + " border-4 bg-black block rounded-full p-0 w-1 h-1 " + visible_class;
  return (
    <span className={ style }></span>
  )
}


/**
 * Dice Slots
 * 0 1 2
 * 3 4 5
 * 6 7 8
 */
function is_dot_visible_for_config(value: number, index: number): boolean {
  switch (value) {
    case 1:
      return index === 4;
    case 2:
      return index === 0 || index === 8;
    case 3:
      return index === 0 || index === 8 || index === 4;
    case 4:
      return index === 0 || index === 2 || index === 6 || index === 8;
    case 5:
      return index === 0 || index === 2 || index === 4 || index === 6 || index === 8;
    case 6:
      return index === 0 || index === 3 || index === 6 || index === 2 || index === 5 || index === 8;
    default:
      return false;
  }
}

function outerDiceClassForOverride(override?: DieOverride): string {
  switch (override) {
      case DieOverride.BigRed: return "bg-red-500 border-2 border-black "
      case DieOverride.BoxCars: return "bg-blue-500 border-2 border-black "
      case DieOverride.SnakeEyes: return "bg-blue-500 border-2 border-black "
      case DieOverride.HardWay: return "bg-lime-300 border-2 border-black "
      case DieOverride.Eleven: return "bg-yellow-300 border-2 border-black "
      default: return "border-gray-800 bg-slate-50 "
  }
}

export function Die(props: DieProps) {
  const dieOverride = outerDiceClassForOverride(props.colorOverride)
  const class_name = props.className || '';
  return (
    <span className={ class_name + dieOverride + ' inline-block grid grid-cols-3 place-items-center leading-[0rem] w-10 h-10 p-1 rounded-md border-2' }>
      { Array.from(range(9)).map(index => (
        <DieDot 
          colorOverride={props.colorOverride}
          dieColor={props.dieColor} className={props.className} key={index} visible={is_dot_visible_for_config(props.value, index)}/>
      ))}
    </span>
  )
}

export default Die;

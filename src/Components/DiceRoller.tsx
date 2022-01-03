import { Die } from 'Components/Die';
import { useAppDispatch, useAppSelector } from 'Redux/hooks';
import { Actions, newDice } from 'Redux/Dice';

export interface DiceRollerProps {
    children?: JSX.Element;
}

export function DiceRoller(props: DiceRollerProps) {
    const dice: number[] = useAppSelector((state) => state.dice.value);
    const dispatch = useAppDispatch();
    return <>
        <div className="w-full bg-slate-200 grid grid-cols-1 place-items-center">
            <div className="grid grid-cols-2 place-items-center w-32 h-24 p-2 bg-slate-200">
            {dice.map((value, index) => <Die key={index} value={value} />)}
            </div>
        </div>
        <div className="grid grid-cols-2 w-full">
        {props.children}
        <button className="w-full h-24 text-2xl lg:text-3xl bg-green-300 hover:bg-green-500 uppercase" onClick={() => dispatch(Actions.rollDice(newDice()))}>Roll The Dice</button>
        </div>
    </>
}

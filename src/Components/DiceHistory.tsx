import { useAppSelector } from "Redux/hooks"
import Die, { overrideForDice } from "./Die";
import { chunk, concat } from 'lodash'

export function DiceHistory() {
  const history = useAppSelector((state) => state.dice.history);
  const historyDivs = history.map(roll => {
    const override = overrideForDice(roll.value)
    return (
      <div key={roll.counter} className="flex flex-horizontal">
      {roll.value.map((die, index) => <Die colorOverride={override} dieColor="bg-slate-900" key={index} value={die} />) || <></>}
    </div>
  )}).reverse()
  const group_size = 5
  const groupedHistory = chunk(historyDivs, group_size).flatMap((group, index) => concat(
    [<div key={"group-" + index} 
          className="text-4xl col-span-3 sm:grid-cols-3  lg:col-span-1 text-center lg:text-right mr-2 bg-slate-100">{index * group_size + 1}</div>],
    group
  ))
  return (
    <>
    {groupedHistory}
    </>
  )
}
export default DiceHistory

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "Redux/hooks"
import { PlayerActions } from "Redux/Player";
import { ChipDisplay } from "./ChipDisplay";

export function ChipDenominationPicker() {
  const betIncrement = useAppSelector((state) => state.player.betIncrement);
  const money = useAppSelector((state) => state.player.money);
  const dispatch = useAppDispatch();
  const setBetIncrement = useCallback((newIncrement: number) => dispatch(PlayerActions.setBetIncrement(newIncrement)), [dispatch])
  useEffect(() => {
    if (betIncrement > money) {
      let newIncrement: number;
      if (money >= 100) {
        newIncrement = 100
      } else if (money >= 50) {
        newIncrement = 50
      } else if (money >= 10) {
        newIncrement = 10
      } else {
        newIncrement = betIncrement;
      }
      setBetIncrement(newIncrement)
    }
  }, [money, betIncrement, setBetIncrement])
  
  const selected = (amount: number, css: string) => (Math.abs(betIncrement) === amount && 'border-2 shadow-lg shadow-lime-100 border-lime-900 rounded-full ' || '') + css
  
  function displayForVolume(volume: number) {
    const removeSelected = Math.abs(betIncrement) === volume && betIncrement < 0
    return (<div onClick={() => { setBetIncrement(volume)}} className={selected(volume, "")}>
      <ChipDisplay volume={volume} size="large">
        <div onClick={(event) => {
          event.stopPropagation();
          setBetIncrement(-Math.abs(volume))
        }} 
             className={ (removeSelected ? "bg-green-900 ": "bg-slate-900 hover:bg-slate-800 ") + "cursor-pointer bottom-0 absolute text-xs sm:text-sm text-slate-100 h-6 sm:h-8 w-full text-center uppercase"}>Remove</div>
      </ChipDisplay>
    </div>)
  }
  
  
  return (
    <>
      {displayForVolume(1)}
      {displayForVolume(10)}
      {displayForVolume(50)}
      {displayForVolume(100)}
      {displayForVolume(1000)}
    </>
  )
}
export default ChipDenominationPicker

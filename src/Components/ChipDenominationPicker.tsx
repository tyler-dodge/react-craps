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
        newIncrement = 1;
      }
      setBetIncrement(newIncrement)
    }
  }, [money, betIncrement, setBetIncrement])
  
  const selected = (amount: number, css: string) => (betIncrement === amount && 'border-2 shadow-lg shadow-lime-100 border-lime-900 rounded-full ' || '') + css
  
  return (
    <>
      <div onClick={() => setBetIncrement(1)} className={selected(1, "")}>
        <ChipDisplay volume={1} size="large"  />
      </div>
      <div onClick={() => setBetIncrement(10)} className={selected(10, ``)}>
        <ChipDisplay volume={10} size="large" />
      </div>
      <div onClick={() => setBetIncrement(50)} className={selected(50, ``)}>
        <ChipDisplay volume={50} size="large"  />
      </div>
      <div onClick={() => setBetIncrement(100)} className={selected(100, ``)}>
        <ChipDisplay volume={100} size="large"  />
      </div>
      <div onClick={() => setBetIncrement(1000)} className={selected(1000, ``)}>
        <ChipDisplay volume={1000} size="large"  />
      </div>
    </>
  )
}
export default ChipDenominationPicker

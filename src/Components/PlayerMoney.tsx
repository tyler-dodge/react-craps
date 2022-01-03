import { useAppSelector } from 'Redux/hooks';
import { format_chip_volume } from 'Utils';

export function PlayerMoney() {
    const money = useAppSelector((state) => state.player.money);
    const lastPayout = useAppSelector((state) => state.player.lastPayout);
    return (

        <div className="place-self-center w-full h-full text-left grid grid-cols-1 lg:grid-cols-2 relative pt-0 sm:pl-3">
            { (<h3 className={ (lastPayout > 0 ? '' : 'invisible') + " text-center text-sm absolute w-full top-2 text-lime-500 { lastPayout > 0 ? 'hidden' }"}>+{format_chip_volume(lastPayout)}</h3>) }
            <div className="absolute bottom-0 w-full">
                <h3 className="text-center text-2xl lg:text-3xl sm:text-2xl uppercase">Chips</h3>
                <h3 className="text-center text-2xl lg:text-3xl sm:text-2xl uppercase">{format_chip_volume(money)}</h3>
            </div>
        </div>
    )
}

export default PlayerMoney;

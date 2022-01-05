import { format_chip_volume } from 'Utils';

interface ChipDisplayProps {
  volume: number
}

export function ChipDisplay(props: ChipDisplayProps) {
  return (
    <div className="grid ml-auto mr-auto grid-cols-1 text-center min-w-fit w-8 p-1 aspect-square rounded-full bg-slate-100 border-slate-900 border-2">
      <span className="place-self-center">{format_chip_volume(props.volume)}</span>
    </div>
  )
}

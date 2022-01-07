import { format_chip_volume } from 'Utils';

interface ChipDisplayProps {
  volume: number
  size?: "small" | "large"
}

export function ChipDisplay(props: ChipDisplayProps) {
  let outer_class: string;
  let inner_class: string;
  if (props.volume >= 1000) {
    outer_class = `bg-yellow-500`
    inner_class = `bg-yellow-300 tex-yellow-900`
  } else if (props.volume >= 100) {
    outer_class = `bg-slate-600`
    inner_class = `bg-slate-500 text-slate-300`
  } else if (props.volume >= 50) {
    outer_class = `bg-blue-600`
    inner_class = `bg-blue-400 text-blue-900`
  } else if (props.volume >= 10) {
    outer_class = `bg-red-900`
    inner_class = `bg-red-500 text-slate-900`
  } else {
    outer_class = `bg-blue-100`
    inner_class = `bg-slate-200 text-blue-900`
  }
  
  let size_class = ` text-xs w-12 h-12 `
  if (props.size === "large") {
    size_class = ` text-xl sm:w-24 sm:h-24 sm:text-3xl w-16 h-16 `
  }
  
  return (
    <div className={outer_class + size_class + `rounded-full 
        border-2 border-slate-600
        p-1
        grid grid-cols-1 place-items-center`}>
      <span className={inner_class + ` rounded-full 
          border-2 border-slate-600
          w-full h-full grid grid-cols-1 place-items-center`}>{format_chip_volume(props.volume)}</span>
    </div>
  )
}

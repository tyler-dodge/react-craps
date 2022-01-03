import { range } from 'Utils';

export interface DieProps {
    value: number;
    className?: string;
}

interface DieDotProps {
    visible: boolean;
    className?: string;
}

function DieDot(props: DieDotProps) {
    const visible_class = ((!props.visible && 'invisible') || '');
    const class_name = props.className || 'border-black';
    const style = class_name + " border-4 block rounded-full p-0 w-1 h-1 " + visible_class;
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

export function Die(props: DieProps) {
    const class_name = props.className || 'border-gray-800 bg-slate-50';
    return (
        <span className={ class_name + ' inline-block grid grid-cols-3 place-items-center leading-[0rem] w-10 h-10 p-1 rounded-md border-2' }>
            { Array.from(range(9)).map(index => <DieDot className={props.className} key={index} visible={is_dot_visible_for_config(props.value, index)}/>) }
        </span>
    )
}

export default Die;

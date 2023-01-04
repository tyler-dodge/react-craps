export enum Slot {
  FIELD = 'Field',
  PLACE = 'Place',
  COME_BET = 'Come',
  DONT_COME_BET = 'Don\'t Come',
  DONT_COME_PLACE = 'DONT COME PLACE',
  PASS_LINE = 'Pass Line',
  ODDS = 'Odds',
  DONT_PASS = 'Don\'t Pass Line',
  HARD_WAY = 'Hard Way',
  SINGLE_ROLL = 'Single Roll'
}

export type PlaceSlotPlacement = { 
  type: Slot.PLACE;
  value: 4 | 5 | 6 | 7 | 8 | 9 | 10;
};

export type DontComeSlotPlacement = { 
  type: Slot.DONT_COME_PLACE;
  value: 4 | 5 | 6 | 7 | 8 | 9 | 10;
};

export type HardWayPlacement = {
  type: Slot.HARD_WAY,
  value: 4 | 6 | 8 | 10
}

export type SingleRollPlacement = {
  type: Slot.SINGLE_ROLL,
  value: 2 | 12 | 3 | 11
}

export type SlotPlacement = Slot.FIELD | Slot.COME_BET | Slot.PASS_LINE | PlaceSlotPlacement | HardWayPlacement | SingleRollPlacement | Slot.ODDS | Slot.DONT_PASS | Slot.DONT_COME_BET | DontComeSlotPlacement;

export function isHardway(placement: SlotPlacement): placement is HardWayPlacement {
  return typeof placement === 'object' && placement.type === Slot.HARD_WAY;
}

export function isPlace(placement: SlotPlacement): placement is PlaceSlotPlacement {
  return typeof placement === 'object' && placement.type === Slot.PLACE;
}

export function isDontComePlace(placement: SlotPlacement): placement is DontComeSlotPlacement {
  return typeof placement === 'object' && placement.type === Slot.DONT_COME_PLACE;
}

export function dontComeValue(placement: number): number {
    switch (placement) { 
        case 12: return 1
        case 4:
        case 10: return 1 + 2
        case 5:
        case 9: return 1 + 3.0 / 2
        case 6:
        case 8: return 1 + 6.0 / 5
        case 2:
        case 3: return 1 + 6.0 / 5
    }
    return 0;
}

export function isSingleRoll(placement: SlotPlacement): placement is SingleRollPlacement {
  return typeof placement === 'object' && placement.type === Slot.SINGLE_ROLL;
}

export function slotKeyName(placement: SlotPlacement): string {
  if (isHardway(placement) || isPlace(placement) || isDontComePlace(placement) || isSingleRoll(placement)) {
    return placement.type + placement.value;
  } else if (typeof placement === 'string') {
    return placement;
  } else {
    console.error("Unexpected placement type", placement);
    return "N/A";
  }
}

export default Slot;

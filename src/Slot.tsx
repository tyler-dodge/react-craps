export enum Slot {
  FIELD = 'Field',
  PLACE = 'Place',
  COME_BET = 'Come',
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

export type HardWayPlacement = {
  type: Slot.HARD_WAY,
  value: 4 | 6 | 8 | 10
}

export type SingleRollPlacement = {
  type: Slot.SINGLE_ROLL,
  value: 2 | 12 | 3 | 11
}

export type SlotPlacement = Slot.FIELD | Slot.COME_BET | Slot.PASS_LINE | PlaceSlotPlacement | HardWayPlacement | SingleRollPlacement | Slot.ODDS;

export function isHardway(placement: SlotPlacement): placement is HardWayPlacement {
  return typeof placement === 'object' && placement.type === Slot.HARD_WAY;
}

export function isPlace(placement: SlotPlacement): placement is HardWayPlacement {
  return typeof placement === 'object' && placement.type === Slot.PLACE;
}

export function isSingleRoll(placement: SlotPlacement): placement is SingleRollPlacement {
  return typeof placement === 'object' && placement.type === Slot.SINGLE_ROLL;
}

export function slotKeyName(placement: SlotPlacement): string {
  if (isHardway(placement) || isPlace(placement) || isSingleRoll(placement)) {
    return placement.type + placement.value;
  } else if (typeof placement === 'string') {
    return placement;
  } else {
    console.error("Unexpected placement type", placement);
    return "N/A";
  }
}

export default Slot;

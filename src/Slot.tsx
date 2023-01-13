export enum Slot {
  FIELD = 'FIELD',
  COME_BET = 'COME',
  DONT_COME_BET = 'DONT COME BET',
  COME_PLACE = 'COME_PLACE',
  COME_ODDS = 'COME_ODDS',
  DONT_COME_ODDS = 'DONT_COME_ODDS',
  DONT_COME_PLACE = 'DONT_COME_PLACE',
  PASS_LINE = 'PASS LINE',
  ODDS = 'ODDS',
  DONT_PASS = 'DONT PASS LINE',
  HARD_WAY = 'HARD WAY',
  SINGLE_ROLL = 'SINGLE ROLL'
}

export type CrapNumber = 2 | 3 | 12;
export type HardNumber = 4 | 6 | 8 | 10;
export type PlaceNumber = 4 | 5 | 6 | 8 | 9 | 10;
export type PlaceSlotPlacement = { 
  type: Slot.COME_PLACE;
  value: PlaceNumber;
};

export type ComeOddsPlacement = { 
  type: Slot.COME_ODDS;
  value: PlaceNumber;
};

export type DontComeSlotPlacement = { 
  type: Slot.DONT_COME_PLACE;
  value: PlaceNumber;
};

export type DontComeOddsPlacement = { 
  type: Slot.DONT_COME_ODDS;
  value: PlaceNumber;
};

export type HardWayPlacement = {
  type: Slot.HARD_WAY,
  value: HardNumber
}

export type SingleRollPlacement = {
  type: Slot.SINGLE_ROLL,
  value: CrapNumber | 11
}

export type SlotPlacement = Slot.FIELD | Slot.COME_BET | Slot.PASS_LINE | PlaceSlotPlacement | HardWayPlacement | SingleRollPlacement | Slot.ODDS | Slot.DONT_PASS | Slot.DONT_COME_BET | DontComeSlotPlacement | DontComeOddsPlacement | ComeOddsPlacement;

export function isHardway(placement: SlotPlacement): placement is HardWayPlacement {
  return typeof placement === 'object' && placement.type === Slot.HARD_WAY;
}

export function isPlace(placement: SlotPlacement): placement is PlaceSlotPlacement {
  return typeof placement === 'object' && placement.type === Slot.COME_PLACE;
}

export function isDontComePlace(placement: SlotPlacement): placement is DontComeSlotPlacement {
  return typeof placement === 'object' && placement.type === Slot.DONT_COME_PLACE;
}
export function isDontComeOdds(placement: SlotPlacement): placement is ComeOddsPlacement {
  return typeof placement === 'object' && placement.type === Slot.DONT_COME_ODDS;
}
export function isComeOdds(placement: SlotPlacement): placement is ComeOddsPlacement {
  return typeof placement === 'object' && placement.type === Slot.COME_ODDS;
}

export function placementNumbers(): (PlaceNumber)[] {
    return [4, 5, 6, 8, 9, 10];
}

export function oddsValue(placement: number): number {
    switch (placement) { 
        case 10:
        case 4: return 2.0
        case 5:
        case 9: return 3.0 / 2.0
        case 6:
        case 8: return 6.0 / 5.0
    }
    return 0;
}

export function dontComeValue(placement: number): number {
    switch (placement) { 
        case 12: return 0
        case 4:
        case 10: return 0.5
        case 5:
        case 9: return 2.0 / 3
        case 6:
        case 8: return 5.0 / 6
    }
    return 0;
}

export function isSingleRoll(placement: SlotPlacement): placement is SingleRollPlacement {
  return typeof placement === 'object' && placement.type === Slot.SINGLE_ROLL;
}

export function slotKeyName(placement: SlotPlacement): string {
  if (isHardway(placement) || isPlace(placement) || isComeOdds(placement)|| isDontComeOdds(placement) || isDontComePlace(placement) || isSingleRoll(placement)) {
    return placement.type + placement.value;
  } else if (typeof placement === 'string') {
    return placement;
  } else {
    console.error("Unexpected placement type", placement);
    return "N/A";
  }
}

export default Slot;

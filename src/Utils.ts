
export function* range(end: number): Iterable<number> {
  for (let i = 0; i < end; i++) {
    yield i;
  }
}

export function isPlaceNumber(slot: number): boolean {
  return slot === 4 || slot === 5 || slot === 6 || slot === 8 || slot === 9 || slot === 10;
}

export function format_chip_volume(volume: number) {
  let output_volume = volume;
  let output_units = "";
  if (volume > 1_000_000_000_000) {
    output_volume = volume / 1_000_000_000_000;
    output_units = "B";
  } else if (volume > 1_000_000) {
    output_volume = volume / 1_000_000;
    output_units = "M";
  } else if (volume > 1000) {
    output_volume = volume / 1000;
    output_units = "K";
  }
  return output_volume.toLocaleString('en-US', { maximumSignificantDigits: 2 }) + output_units;
}

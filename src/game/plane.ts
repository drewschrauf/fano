interface PlaneDefeat {
  beats: number;
  with: number;
}

const INTERVALS = [1, 2, 4];

const planarMod = (input: number, modulus: 7) => ((input - 1) % modulus) + 1;

export const resolve = (input: number): Set<PlaneDefeat> => {
  const result: Set<PlaneDefeat> = new Set();
  for (const interval of INTERVALS) {
    result.add({ beats: planarMod(input + interval, 7), with: planarMod(input + interval * 3, 7) });
  }
  return result;
};

export const checkValid = (attack: number, defend: number, additional: number): boolean => {
  const options = resolve(attack);

  for (const option of options) {
    if (option.beats === defend && option.with === additional) {
      return true;
    }
  }

  return false;
};

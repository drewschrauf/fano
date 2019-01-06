import { resolve } from '../plane';

describe('plane', () => {
  it('resolves for 1', () => {
    const result = resolve(1);
    expect(result).toEqual(
      new Set([{ beats: 2, with: 4 }, { beats: 3, with: 7 }, { beats: 5, with: 6 }]),
    );
  });

  it('resolves for 2', () => {
    const result = resolve(2);
    expect(result).toEqual(
      new Set([{ beats: 3, with: 5 }, { beats: 4, with: 1 }, { beats: 6, with: 7 }]),
    );
  });

  it('resolves for 3', () => {
    const result = resolve(3);
    expect(result).toEqual(
      new Set([{ beats: 4, with: 6 }, { beats: 5, with: 2 }, { beats: 7, with: 1 }]),
    );
  });

  it('resolves for 4', () => {
    const result = resolve(4);
    expect(result).toEqual(
      new Set([{ beats: 5, with: 7 }, { beats: 6, with: 3 }, { beats: 1, with: 2 }]),
    );
  });

  it('resolves for 5', () => {
    const result = resolve(5);
    expect(result).toEqual(
      new Set([{ beats: 6, with: 1 }, { beats: 7, with: 4 }, { beats: 2, with: 3 }]),
    );
  });

  it('resolves for 6', () => {
    const result = resolve(6);
    expect(result).toEqual(
      new Set([{ beats: 7, with: 2 }, { beats: 1, with: 5 }, { beats: 3, with: 4 }]),
    );
  });

  it('resolves for 7', () => {
    const result = resolve(7);
    expect(result).toEqual(
      new Set([{ beats: 1, with: 3 }, { beats: 2, with: 6 }, { beats: 4, with: 5 }]),
    );
  });
});

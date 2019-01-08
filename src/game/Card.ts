export default class Card {
  constructor(public value: number) {}
  public toString() {
    return `Card(${this.value})`;
  }
}

export enum FaceCards {
  Jack = 11,
  Queen = 12,
  King = 13,
}

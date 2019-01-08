export default class Card {
  constructor(public value: number) {}
  public toString() {
    return `Card(${this.value})`;
  }
}

import range from 'lodash/range';
import shuffle from 'lodash/shuffle';
import head from 'lodash/head';
import tail from 'lodash/tail';
import slice from 'lodash/slice';
import includes from 'lodash/includes';

import { InvalidMoveError } from './errors';

export class Card {
  constructor(public value: number) {}
  public toString() {
    return `Card(${this.value})`;
  }
}

export class GameSide {
  public drawPile: Card[];
  public hand: Card[] = [];
  public discardPile: Card[] = [];
  public rank: Card;
  public slots: (Card | null)[] = [null, null, null, null];

  constructor() {
    this.rank = new Card(11);
    this.drawPile = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => new Card(value));
    this.shuffle();
    this.drawHand();
  }

  private shuffle() {
    this.drawPile = [...this.drawPile, ...this.discardPile];
    this.discardPile = [];
    this.drawPile = shuffle(this.drawPile);
  }

  private drawHand() {
    while (this.hand.length < 3) {
      if (!this.drawPile.length) {
        this.shuffle();

        // forcibly break if there's still no cards after a shuffle
        if (this.drawPile.length === 0) {
          break;
        }
      }
      const drawnCard = head(this.drawPile) as Card;
      this.hand = [...this.hand, drawnCard];
      this.drawPile = tail(this.drawPile);
    }
  }

  public playToSlot(slot: number, card: Card) {
    if (!includes(this.hand, card)) {
      throw new InvalidMoveError(`Can't play ${card}, not in hand`);
    }
    this.hand = this.hand.filter(handCard => handCard !== card);

    const existingCard = this.slots[slot];
    if (existingCard) {
      this.discardPile = [...this.discardPile, existingCard];
    }
    this.slots = [...slice(this.slots, 0, slot), card, ...slice(this.slots, slot + 1)];
  }

  public combine(target: Card, other: Card, to: Card) {
    if (target.value + other.value !== to.value) {
      throw new InvalidMoveError(`Can't combine, ${target} and ${other} do not add up to ${to}`);
    }
    if (!includes(this.slots, target)) {
      throw new InvalidMoveError(`Can't combine, ${target} is not in a slot`);
    }
    if (!includes(this.slots, other)) {
      throw new InvalidMoveError(`Can't combine, ${other} is not in a slot`);
    }
    if (!includes(this.hand, to)) {
      throw new InvalidMoveError(`Can't combine, ${to} is not in the hand`);
    }

    const targetSlot = this.slots.indexOf(target);
    const otherSlot = this.slots.indexOf(other);
    this.discardPile = [...this.discardPile, target, other];
    this.slots = [...slice(this.slots, 0, targetSlot), to, ...slice(this.slots, targetSlot + 1)];
    this.slots = [...slice(this.slots, 0, otherSlot), null, ...slice(this.slots, otherSlot + 1)];
  }
}

export default class Game {
  players: GameSide[] = [];
  public playerTurn = 0;

  constructor(playerCount: number) {
    for (const _playerIdx in range(playerCount)) {
      this.players = [...this.players, new GameSide()];
    }
  }

  public playToSlot(player: number, slot: number, card: Card) {
    if (player !== this.playerTurn) {
      throw new InvalidMoveError(`It is not player ${player}'s turn`);
    }
    this.players[this.playerTurn].playToSlot(slot, card);
  }
}

import range from 'lodash/range';
import shuffle from 'lodash/shuffle';
import head from 'lodash/head';
import tail from 'lodash/tail';
import slice from 'lodash/slice';

export class Card {
  constructor(public value: number) {}
  public toString() {
    return `Card<${this.value}>`;
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
    if (this.slots[slot]) {
      // discard card already there
    }

    this.slots = [...slice(this.slots, 0, slot), card, ...slice(this.slots, slot + 1)];
  }
}

export default class Game {
  players: GameSide[] = [];
  public playerTurn = 0;

  constructor(playerCount: number) {
    for (const _playerIdx in range(playerCount)) {
      this.players = [...this.players, new GameSide()];
    }
    this.playToSlot(0, this.players[0].hand[0]);
  }

  public playToSlot(slot: number, card: Card) {
    this.players[this.playerTurn].playToSlot(slot, card);
  }
}

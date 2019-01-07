import _ from 'lodash';
import Game, { GameSide, Card } from '../Game';
import { InvalidMoveError } from '../errors';

describe('Game', () => {
  it('should initialize with two sides', () => {
    const game = new Game(2);
    expect(game.players).toHaveLength(2);
    // console.log(JSON.stringify(game, null, 2));
  });
});

describe('GameSide', () => {
  describe('initialization', () => {
    it('should default the rank to jack', () => {
      const side = new GameSide();
      expect(side.rank).toEqual(new Card(11));
    });

    it('should initialize a hand with 3 cards', () => {
      const side = new GameSide();
      expect(side.hand).toHaveLength(3);
    });

    it('should initialize a draw pile with 7 cards', () => {
      const side = new GameSide();
      expect(side.drawPile).toHaveLength(7);
    });

    it('should have all ten cards between the hand and draw pile', () => {
      const side = new GameSide();
      const allCards = [...side.hand, ...side.drawPile];
      for (const rank of _.range(1, 11)) {
        const foundCard = _.find(allCards, card => card.value === rank);
        expect(foundCard).toBeTruthy();
      }
    });
  });

  describe('playToSlot', () => {
    it('should place the card in the specified slot', () => {
      const side = new GameSide();
      const card = side.hand[0];
      side.playToSlot(0, card);
      expect(side.slots).toEqual([card, null, null, null]);
    });

    it('should remove the card from the hand', () => {
      const side = new GameSide();
      const card = side.hand[0];
      side.playToSlot(0, card);
      expect(side.hand).not.toContain(card);
    });

    it('should move any card already in the slot to the discard pile', () => {
      const side = new GameSide();
      const card = side.hand[0];
      const secondCard = side.hand[1];
      side.playToSlot(0, card);
      side.playToSlot(0, secondCard);
      expect(side.slots).toEqual([secondCard, null, null, null]);
      expect(side.discardPile).toEqual([card]);
    });

    it('should throw if the card is not in the hand', () => {
      const side = new GameSide();
      const card = new Card(-1);
      expect(() => {
        side.playToSlot(0, card);
      }).toThrow(new InvalidMoveError("Can't play Card(-1), not in hand"));
    });
  });

  describe('combine', () => {
    it('should replace the two cards with the third', () => {
      const side = new GameSide();
      const card1 = new Card(1);
      const card2 = new Card(2);
      const card3 = new Card(3);
      side.hand = [card3];
      side.slots = [card1, card2, null, null];
      side.combine(card1, card2, card3);
      expect(side.slots).toEqual([card3, null, null, null]);
    });

    it('should move the two cards to the discard pile', () => {
      const side = new GameSide();
      const card1 = new Card(1);
      const card2 = new Card(2);
      const card3 = new Card(3);
      side.hand = [card3];
      side.slots = [card1, card2, null, null];
      side.combine(card1, card2, card3);
      expect(side.discardPile).toEqual([card1, card2]);
    });

    it("should throw if the two cards don't add up to the third", () => {
      const side = new GameSide();
      const card1 = new Card(1);
      const card2 = new Card(2);
      const card3 = new Card(4);
      side.hand = [card3];
      side.slots = [card1, card2, null, null];
      expect(() => {
        side.combine(card1, card2, card3);
      }).toThrow(
        new InvalidMoveError("Can't combine, Card(1) and Card(2) do not add up to Card(4)"),
      );
    });

    it('should throw if the first card is not in a slot', () => {
      const side = new GameSide();
      const card1 = new Card(1);
      const card2 = new Card(2);
      const card3 = new Card(3);
      side.hand = [card3];
      side.slots = [null, card2, null, null];
      expect(() => {
        side.combine(card1, card2, card3);
      }).toThrow(new InvalidMoveError("Can't combine, Card(1) is not in a slot"));
    });

    it('should throw if the second card is not in a slot', () => {
      const side = new GameSide();
      const card1 = new Card(1);
      const card2 = new Card(2);
      const card3 = new Card(3);
      side.hand = [card3];
      side.slots = [card1, null, null, null];
      expect(() => {
        side.combine(card1, card2, card3);
      }).toThrow(new InvalidMoveError("Can't combine, Card(2) is not in a slot"));
    });

    it('should throw if the third card is not in the hand', () => {
      const side = new GameSide();
      const card1 = new Card(1);
      const card2 = new Card(2);
      const card3 = new Card(3);
      side.hand = [];
      side.slots = [card1, card2, null, null];
      expect(() => {
        side.combine(card1, card2, card3);
      }).toThrow(new InvalidMoveError("Can't combine, Card(3) is not in the hand"));
    });
  });
});

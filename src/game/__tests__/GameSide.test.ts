import _ from 'lodash';

import GameSide from '../GameSide';
import Card from '../Card';
import { InvalidMoveError } from '../errors';

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

  describe('discardFromHand', () => {
    it('should remove the cards from the hand', () => {
      const side = new GameSide();
      const card1 = new Card(1);
      const card2 = new Card(2);
      side.hand = [card1, card2];
      side.discardFromHand([card1, card2]);
      expect(side.hand).not.toContain(card1);
      expect(side.hand).not.toContain(card2);
    });

    it('should draw back to 3', () => {
      const side = new GameSide();
      const card1 = new Card(1);
      const card2 = new Card(2);
      side.hand = [card1, card2];
      side.discardFromHand([card1, card2]);
      expect(side.hand).toHaveLength(3);
    });

    it('should throw if attempting to discard a card not in hand', () => {
      const side = new GameSide();
      const card1 = new Card(1);
      const card2 = new Card(2);
      const card3 = new Card(3);
      side.hand = [card1, card2];
      expect(() => {
        side.discardFromHand([card3]);
      }).toThrow(new InvalidMoveError("Can't discard, Card(3) not in hand"));
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

  describe('removeFromSlots', () => {
    it('should remove the cards from slots', () => {
      const side = new GameSide();
      const card1 = new Card(1);
      const card2 = new Card(2);
      const card3 = new Card(3);
      side.slots = [card1, card2, card3, null];
      side.removeFromSlots([card1, card2]);
      expect(side.slots).toEqual([null, null, card3, null]);
    });

    it('should add removed cards to discard pile', () => {
      const side = new GameSide();
      const card1 = new Card(1);
      const card2 = new Card(2);
      const card3 = new Card(3);
      side.slots = [card1, card2, card3, null];
      side.removeFromSlots([card1, card2]);
      expect(side.discardPile).toEqual([card1, card2]);
    });

    it('should throw if card not in slot', () => {
      const side = new GameSide();
      const card1 = new Card(1);
      const card2 = new Card(2);
      const card3 = new Card(3);
      const card4 = new Card(4);
      side.slots = [card1, card2, card3, null];
      expect(() => {
        side.removeFromSlots([card4]);
      }).toThrow(new InvalidMoveError("Can't remove, Card(4) not in a slot"));
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
      side.combine(card1, card2, card3, card1);
      expect(side.slots).toEqual([card3, null, null, null]);
    });

    it('should move the kept card back to the hand', () => {
      const side = new GameSide();
      const card1 = new Card(1);
      const card2 = new Card(2);
      const card3 = new Card(3);
      side.hand = [card3];
      side.slots = [card1, card2, null, null];
      side.combine(card1, card2, card3, card1);
      expect(side.hand).toContain(card1);
    });

    it('should move the non-kept card to the discard pile', () => {
      const side = new GameSide();
      const card1 = new Card(1);
      const card2 = new Card(2);
      const card3 = new Card(3);
      side.hand = [card3];
      side.slots = [card1, card2, null, null];
      side.combine(card1, card2, card3, card1);
      expect(side.discardPile).toEqual([card2]);
    });

    it('should throw if the keep card is not one of the two cards', () => {
      const side = new GameSide();
      const card1 = new Card(1);
      const card2 = new Card(2);
      const card3 = new Card(3);
      const card4 = new Card(4);
      side.hand = [card3];
      side.slots = [card1, card2, null, null];
      expect(() => {
        side.combine(card1, card2, card3, card4);
      }).toThrow(new InvalidMoveError("Can't combine, Card(4) is not one of the combining cards"));
    });

    it("should throw if the two cards don't add up to the third", () => {
      const side = new GameSide();
      const card1 = new Card(1);
      const card2 = new Card(2);
      const card3 = new Card(4);
      side.hand = [card3];
      side.slots = [card1, card2, null, null];
      expect(() => {
        side.combine(card1, card2, card3, card1);
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
        side.combine(card1, card2, card3, card1);
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
        side.combine(card1, card2, card3, card1);
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
        side.combine(card1, card2, card3, card1);
      }).toThrow(new InvalidMoveError("Can't combine, Card(3) is not in the hand"));
    });
  });
});

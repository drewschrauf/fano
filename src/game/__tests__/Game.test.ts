import _ from 'lodash';

import Game from '../Game';
import Card from '../Card';
import { InvalidMoveError } from '../errors';

describe('Game', () => {
  describe('constructor', () => {
    it('should initialize with two sides', () => {
      const game = new Game(2);
      expect(game.players).toHaveLength(2);
    });
  });

  describe('attack', () => {
    it("should remove the opponent's card from the slot", () => {
      const game = new Game(2);

      const p1SlotCard = new Card(1);
      const p1HandCard = new Card(4);
      const p2SlotCard = new Card(2);

      game.players[0].slots = [p1SlotCard, null, null, null];
      game.players[0].hand = [p1HandCard];
      game.players[1].slots = [p2SlotCard, null, null, null];

      game.attack(
        {
          player: 0,
          slotCard: p1SlotCard,
          handCard: p1HandCard,
        },
        {
          player: 1,
          slotCard: p2SlotCard,
        },
      );
    });

    it('should throw if the attack is not legal', () => {
      const game = new Game(2);

      const p1SlotCard = new Card(1);
      const p1HandCard = new Card(2);
      const p2SlotCard = new Card(3);

      game.players[0].slots = [p1SlotCard, null, null, null];
      game.players[0].hand = [p1HandCard];
      game.players[1].slots = [p2SlotCard, null, null, null];

      expect(() => {
        game.attack(
          {
            player: 0,
            slotCard: p1SlotCard,
            handCard: p1HandCard,
          },
          {
            player: 1,
            slotCard: p2SlotCard,
          },
        );
      }).toThrow(
        new InvalidMoveError("Can't attack, Card(1) with Card(2) does not defeat Card(3)"),
      );
    });
  });

  describe('discardFromHand', () => {
    it('should invoke discardFromHand for the current player', () => {
      const game = new Game(2);
      game.players[0].discardFromHand = jest.fn();

      const discardedCards = [new Card(1), new Card(2)];
      game.discardFromHand(0, discardedCards);

      expect(game.players[0].discardFromHand).toHaveBeenCalledWith(discardedCards);
    });

    it('should increment to the next player', () => {
      const game = new Game(2);
      game.playerTurn = 1;
      game.players[1].discardFromHand = jest.fn();

      game.discardFromHand(1, [new Card(1), new Card(2)]);

      expect(game.playerTurn).toEqual(0);
    });

    it('should throw if the player is not the current player', () => {
      const game = new Game(2);

      expect(() => {
        game.discardFromHand(1, [new Card(1), new Card(2)]);
      }).toThrow(new InvalidMoveError("Can't discard, it is not player 1's turn"));
    });
  });
});

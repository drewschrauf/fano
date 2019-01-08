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
});

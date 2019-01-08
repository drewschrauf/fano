import range from 'lodash/range';

import GameSide from './GameSide';
import Card from './Card';
import { InvalidMoveError } from './errors';

import { checkValid } from './plane';

export default class Game {
  public players: GameSide[] = [];
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

  public attack(
    {
      player: attackingPlayer,
      slotCard: attackingSlotCard,
      handCard: attackingHandCard,
    }: { player: number; slotCard: Card; handCard: Card },
    { player: defendingPlayer, slotCard: defendingSlotCard }: { player: number; slotCard: Card },
  ) {
    const valid = checkValid(
      attackingSlotCard.value,
      defendingSlotCard.value,
      attackingHandCard.value,
    );
    if (!valid) {
      throw new InvalidMoveError(
        `Can't attack, ${attackingSlotCard} with ${attackingHandCard} does not defeat ${defendingSlotCard}`,
      );
    }
    const slot = this.players[attackingPlayer].slots.indexOf(attackingSlotCard);
    this.players[attackingPlayer].removeFromSlots([attackingSlotCard]);
    this.players[attackingPlayer].playToSlot(slot, attackingHandCard);
    this.players[defendingPlayer].removeFromSlots([defendingSlotCard]);
  }
}

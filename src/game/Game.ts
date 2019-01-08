import range from 'lodash/range';

import GameSide from './GameSide';
import Card from './Card';
import { InvalidMoveError } from './errors';

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

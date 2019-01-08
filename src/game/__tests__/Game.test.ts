import _ from 'lodash';
import Game from '../Game';

describe('Game', () => {
  it('should initialize with two sides', () => {
    const game = new Game(2);
    expect(game.players).toHaveLength(2);
  });
});

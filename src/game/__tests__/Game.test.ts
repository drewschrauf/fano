import Game from '../Game';

describe('Game', () => {
  it('should initialize with two sides', () => {
    const game = new Game(2);
    console.log(JSON.stringify(game, null, 2));
  });
});

import * as PIXI from 'pixi.js';
import Renderer from './Renderer';

export const setup = () => {
  const renderer = new Renderer({ resolution: window.devicePixelRatio });
  document.body.appendChild(renderer.view);

  const stage = new PIXI.Container();
  const text = new PIXI.Text("It's working!", { fill: '#FFFFFF' });
  text.x = 30;
  text.y = 90;
  stage.addChild(text);

  renderer.render(stage);
};

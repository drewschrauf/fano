import { WebGLRenderer, WebGLRendererOptions } from 'pixi.js';

export default class Renderer extends WebGLRenderer {
  constructor(options: WebGLRendererOptions) {
    super(options);
    window.addEventListener('resize', this.resizeHandler);
    this.resizeHandler();
  }

  private resizeHandler = () => {
    this.resize(window.innerWidth, window.innerHeight);
  };
}

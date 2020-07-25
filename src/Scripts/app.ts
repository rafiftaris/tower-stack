import "phaser";
import {config, PhaserConfig} from "./Config/PhaserConfig";
import * as React from 'jsx-dom';
window['React'] = React;
export { React };

var game;

export class PhaserGame extends Phaser.Game {
  constructor(config: PhaserConfig) {
    super(config);
  }
}
window.onload = () => {
   game = new PhaserGame(config);
};

export function getGame()
{
    return game;
}
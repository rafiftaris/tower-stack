import * as Phaser from 'phaser';
import { SceneKeys } from '../Config/SceneKeys';

import Background from '../Object/Background';
import { IBackground } from '../Interfaces/interface';

export default class GameUI extends Phaser.Scene {
  private background: IBackground;
  // private fpsText: FpsText;

  constructor() {
    super({ key: SceneKeys.GameUI });
  }

  preload(): void {}

  create(): void {
    this.background = new Background(this);
    this.cameras.main.setBackgroundColor('#85cff5');
    // this.fpsText = new FpsText(this);
  }

  update(): void {
    this.background.update();
    // this.fpsText.update();
  }
}
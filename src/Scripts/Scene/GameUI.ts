import * as Phaser from 'phaser';
import { SceneKeys } from '../Config/SceneKeys';

import { InputZone } from "../Object/InputZone";
import { Timer } from "../Object/Timer";
import Background from '../Object/Background';

import { IBackground } from '../Interfaces/interface';

import { TextPopUp } from "../Util/TextPopUp";
import { ImagePopUp } from "../Util/ImagePopUp";

import DepthConfig from "../Config/DepthConfig";

export default class GameUI extends Phaser.Scene {
  private background: IBackground;
  // private fpsText: FpsText;

  constructor() {
    super({ key: SceneKeys.GameUI });
  }

  preload(): void {}

  create(): void {
    this.initializeStaticElements();
    this.background = new Background(this);
    this.cameras.main.setBackgroundColor('#85cff5');
    // this.fpsText = new FpsText(this);
  }

  update(): void {
    this.background.update();
    // this.fpsText.update();
  }

  initializeStaticElements(): void {
    TextPopUp.init(this, DepthConfig.gameHeaderUI);
    ImagePopUp.init(this, DepthConfig.gameHeaderUI);
    InputZone.init(this);
    Timer.init(this, DepthConfig.gameHeaderUI);
    Timer.hide();  
  }
}

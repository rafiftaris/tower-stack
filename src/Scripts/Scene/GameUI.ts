import * as Phaser from 'phaser';
import { SceneKeys } from '../Config/SceneKeys';
import DepthConfig from '../Config/DepthConfig';
import { BACKGROUND_COLOR } from '../Config/GameConfig';
import SoundConfig from '../Config/SoundConfig';

import { InputZone } from '../Object/InputZone';
import { Timer } from '../Object/Timer';
import Background from '../Object/Background';

import { IBackground } from '../Interfaces/interface';

import { TextPopUp } from '../Util/TextPopUp';
import { ImagePopUp } from '../Util/ImagePopUp';

import { AudioKeys } from '../Enum/enum';

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
    this.cameras.main.setBackgroundColor(BACKGROUND_COLOR);
    this.sound.play(AudioKeys.Bgm, {
      loop: true,
      volume: SoundConfig.bgmVolume
    });
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

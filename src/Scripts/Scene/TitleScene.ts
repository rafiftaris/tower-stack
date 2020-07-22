import * as Phaser from "phaser";
import FpsText from "../Object/FpsText";
import Background from "../Object/Background";
import Ground from "../Object/Ground";

import {ImagePopUp, ANIMATION_TYPE} from "../Util/ImagePopUp";
import {TextPopUp} from "../Util/TextPopUp";

import DepthConfig from "../Config/DepthConfig";
import SoundConfig from "../Config/SoundConfig";
import AlignTool from "../Util/AlignTool";
import PlayButton from "../Object/PlayButton";

export default class TitleScene extends Phaser.Scene {
  private fpsText: FpsText;
  private titleText: Phaser.GameObjects.Image;
  private ground: Ground;
  private background: Background;
  private playButton: PlayButton;

  constructor() {
    super({ key: "TitleScene" });
  }

  preload(): void {}

  create(): void {
    this.cameras.main.setBackgroundColor("#5fb3e5");
    this.initializeStaticElements();

    this.background = new Background(this);
    this.ground = new Ground(this, 1);

    this.fpsText = new FpsText(this);

    this.titleText = ImagePopUp.showImage({
      x: AlignTool.getXfromScreenWidth(this,0.5),
      y: AlignTool.getYfromScreenHeight(this,0.15),
      image: "title",
      width: 591,
      height: 146,
      duration: 2,
      animType: ANIMATION_TYPE.EMBIGGEN,
      retain: true
    }).image;
    this.titleText.setAngle(-5);

    this.playButton = new PlayButton(
      this,
      AlignTool.getXfromScreenWidth(this,0.5),
      AlignTool.getYfromScreenHeight(this,1.2),
      0.7,
      1
    );
    this.playButton.setPlayButton(this);

    this.time.addEvent({
      delay:2000,
      callback: () => {
        let buttonSlideIn = this.tweens.add({  
          targets: this.playButton,
          y: AlignTool.getYfromScreenHeight(this,0.7),
          duration: 500,
          yoyo: false,
          repeat: 0
        });
      }
    })

    if(!this.sound.get("bgm")){
      this.sound.play("bgm", { loop: true, volume: SoundConfig.bgmVolume });
    }

    // this.scene.start("LevelScene");
  }
  
  update(): void {
    this.background.update();
    this.fpsText.update();
  }

  initializeStaticElements(): void{
    TextPopUp.init(this, DepthConfig.score);
    ImagePopUp.init(this, DepthConfig.gameOverPanel);
  }
}

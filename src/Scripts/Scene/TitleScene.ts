import * as Phaser from "phaser";
import Ground from "../Object/Ground";

import {ImagePopUp, ANIMATION_TYPE} from "../Util/ImagePopUp";
import {TextPopUp} from "../Util/TextPopUp";

import DepthConfig from "../Config/DepthConfig";
import SoundConfig from "../Config/SoundConfig";
import AlignTool from "../Util/AlignTool";
import PlayButton from "../Object/PlayButton";
import { SceneKeys } from "../Config/SceneKeys";

export default class TitleScene extends Phaser.Scene {
  private titleText: Phaser.GameObjects.Image;
  private ground: Ground;
  private playButton: PlayButton;

  constructor() {
    super({ key: SceneKeys.Title });
  }

  preload(): void {}

  create(): void {
    this.scene.run(SceneKeys.GameUI);
    this.scene.sendToBack(SceneKeys.GameUI);
    
    this.initializeStaticElements();

    this.ground = new Ground(this, 1);

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
      0.3,
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
  
  update(): void {}

  initializeStaticElements(): void{
    TextPopUp.init(this, DepthConfig.score);
    ImagePopUp.init(this, DepthConfig.gameOverPanel);
  }
}

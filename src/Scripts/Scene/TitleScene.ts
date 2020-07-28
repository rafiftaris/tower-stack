import * as Phaser from "phaser";
import Ground from "../Object/Ground";

import {ImagePopUp, ANIMATION_TYPE} from "../Util/ImagePopUp";
import {TextPopUp, ANIMATION_TYPE as TEXT_ANIM_TYPE} from "../Util/TextPopUp";
import AlignTool from "../Util/AlignTool";

import DepthConfig from "../Config/DepthConfig";
import SoundConfig from "../Config/SoundConfig";
import { SceneKeys } from "../Config/SceneKeys";

import PlayButton from "../Object/PlayButton";

import {BUTTON_TYPE} from "../Enum/enum";

export default class TitleScene extends Phaser.Scene {
  private titleText: Phaser.GameObjects.Image;
  private ground: Ground;

  private playButton: PlayButton;
  private howToButton: PlayButton;

  private playText: Phaser.GameObjects.Text;
  private howToText: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SceneKeys.Title });
  }

  preload(): void {}

  create(): void {
    this.initializeStaticElements();

    this.ground = new Ground(this, 1);

    // Title text
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

    // Play Button
    this.playButton = new PlayButton(
      this,
      AlignTool.getXfromScreenWidth(this,-0.25),
      AlignTool.getYfromScreenHeight(this,0.4),
      0.2,
      1,
      BUTTON_TYPE.Play
    );

    // How To Button
    this.howToButton = new PlayButton(
      this,
      AlignTool.getXfromScreenWidth(this,-0.25),
      AlignTool.getYfromScreenHeight(this,0.7),
      0.2,
      1,
      BUTTON_TYPE.HowTo
    );

    this.time.addEvent({
      delay:2000,
      callback: () => {
        this.tweens.add({  
          targets: this.playButton,
          x: AlignTool.getXfromScreenWidth(this,0.25),
          duration: 500,
          yoyo: false,
          repeat: 0
        });
        this.tweens.add({  
          delay: 500,
          targets: this.howToButton,
          x: AlignTool.getXfromScreenWidth(this,0.25),
          duration: 500,
          yoyo: false,
          repeat: 0
        });
      }
    })

    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.playText = TextPopUp.showText({
          x: AlignTool.getXfromScreenWidth(this,0.61),
          y: AlignTool.getYfromScreenHeight(this,0.4),
          text: "Start Game",
          duration: 0.5,
          style: {
              fontSize: 72,
              fontFamily: "TrulyMadly",
              color: "black",
              strokeThickness: 1
          },
          animType: TEXT_ANIM_TYPE.EMBIGGEN,
          retain: true,
        })?.text as Phaser.GameObjects.Text;
        this.add.existing(this.playText);

        this.howToText = TextPopUp.showText({
          x: AlignTool.getXfromScreenWidth(this,0.62),
          y: AlignTool.getYfromScreenHeight(this,0.7),
          text: "How To Play",
          duration: 0.5,
          style: {
              fontSize: 72,
              fontFamily: "TrulyMadly",
              color: "black",
              strokeThickness: 1
          },
          animType: TEXT_ANIM_TYPE.EMBIGGEN,
          retain: true,
        })?.text as Phaser.GameObjects.Text;
        this.add.existing(this.howToText);

        // Enable buttons
        this.playButton.setEnabled(true);
        this.howToButton.setEnabled(true);
      },
      callbackScope: this
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

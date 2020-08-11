import * as Phaser from 'phaser';
import Ground from '../Object/Ground';

import { ImagePopUp, ANIMATION_TYPE } from '../Util/ImagePopUp';
import { TextPopUp, ANIMATION_TYPE as TEXT_ANIM_TYPE } from '../Util/TextPopUp';
import AlignTool from '../Util/AlignTool';

import DepthConfig from '../Config/DepthConfig';
import { SceneKeys } from '../Config/SceneKeys';

import Button from '../Object/Button';

import {
  ButtonType,
  FontKeys,
  LocalStorageKeys
} from '../Enum/enum';
import { IGround, IButton } from '../Interfaces/interface';

export default class TitleScene extends Phaser.Scene {
  private titleText: Phaser.GameObjects.Image;
  private ground: IGround;

  private playButton: IButton;
  private howToButton: IButton;

  private playText: Phaser.GameObjects.Text;
  private howToText: Phaser.GameObjects.Text;
  private highScoreText: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SceneKeys.Title });
  }

  preload(): void {}

  create(): void {
    this.initializeStaticElements();

    this.ground = new Ground(this, 1);

    // Title text
    this.titleText = ImagePopUp.showImage({
      x: AlignTool.getXfromScreenWidth(this, 0.5),
      y: AlignTool.getYfromScreenHeight(this, 0.1),
      image: 'title',
      width: 591,
      height: 146,
      duration: 2,
      animType: ANIMATION_TYPE.EMBIGGEN,
      retain: true
    }).image;
    this.titleText.setAngle(-5);

    // Play Button
    this.playButton = new Button(
      this,
      AlignTool.getXfromScreenWidth(this, -0.25),
      AlignTool.getYfromScreenHeight(this, 0.4),
      0.2,
      1,
      ButtonType.Play
    );

    // How To Button
    this.howToButton = new Button(
      this,
      AlignTool.getXfromScreenWidth(this, -0.25),
      AlignTool.getYfromScreenHeight(this, 0.7),
      0.2,
      1,
      ButtonType.HowTo
    );

    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.tweens.add({
          targets: this.playButton,
          x: AlignTool.getXfromScreenWidth(this, 0.25),
          duration: 500,
          yoyo: false,
          repeat: 0
        });
        this.tweens.add({
          delay: 500,
          targets: this.howToButton,
          x: AlignTool.getXfromScreenWidth(this, 0.25),
          duration: 500,
          yoyo: false,
          repeat: 0
        });
      }
    });

    this.time.addEvent({
      delay: 3000,
      callback: () => {
        let highscore = 0;
        if (localStorage.getItem(LocalStorageKeys.HighScore) !== null) {
          highscore = parseInt(
            localStorage.getItem(LocalStorageKeys.HighScore)
          );
        }

        this.highScoreText = TextPopUp.showText({
          x: AlignTool.getXfromScreenWidth(this, 0.5),
          y: AlignTool.getYfromScreenHeight(this, 0.25),
          text: 'High Score: ' + highscore.toString(),
          duration: 0.5,
          style: {
            fontSize: 72,
            fontFamily: FontKeys.TrulyMadly,
            color: 'black',
            strokeThickness: 1
          },
          animType: TEXT_ANIM_TYPE.EMBIGGEN,
          retain: true
        })?.text as Phaser.GameObjects.Text;
        this.add.existing(this.highScoreText);

        this.playText = TextPopUp.showText({
          x: AlignTool.getXfromScreenWidth(this, 0.61),
          y: AlignTool.getYfromScreenHeight(this, 0.4),
          text: 'Start Game',
          duration: 0.5,
          style: {
            fontSize: 72,
            fontFamily: FontKeys.TrulyMadly,
            color: 'black',
            strokeThickness: 1
          },
          animType: TEXT_ANIM_TYPE.EMBIGGEN,
          retain: true
        })?.text as Phaser.GameObjects.Text;
        this.add.existing(this.playText);

        this.howToText = TextPopUp.showText({
          x: AlignTool.getXfromScreenWidth(this, 0.62),
          y: AlignTool.getYfromScreenHeight(this, 0.7),
          text: 'How To Play',
          duration: 0.5,
          style: {
            fontSize: 72,
            fontFamily: FontKeys.TrulyMadly,
            color: 'black',
            strokeThickness: 1
          },
          animType: TEXT_ANIM_TYPE.EMBIGGEN,
          retain: true
        })?.text as Phaser.GameObjects.Text;
        this.add.existing(this.howToText);

        // Enable buttons
        this.playButton.setEnabled(true);
        this.howToButton.setEnabled(true);
      },
      callbackScope: this
    });

    // this.scene.start("LevelScene");
  }

  update(): void {}

  initializeStaticElements(): void {
    TextPopUp.init(this, DepthConfig.score);
    ImagePopUp.init(this, DepthConfig.gameOverPanel);
  }
}

import * as Phaser from 'phaser';

import { SceneKeys } from '../Config/SceneKeys';
import DepthConfig from '../Config/DepthConfig';

import { ButtonType, FontKeys } from '../Enum/enum';

import AlignTool from '../Util/AlignTool';
import { TextPopUp, ANIMATION_TYPE as TEXT_ANIM_TYPE } from '../Util/TextPopUp';
import { ImagePopUp, ANIMATION_TYPE } from '../Util/ImagePopUp';

import Ground from '../Object/Ground';
import Bird from '../Object/Bird';
import Button from '../Object/Button';

export default class HowToScene extends Phaser.Scene {
  private readonly titleTransTime = 0.3;
  private readonly goalTransTime = 1;
  private readonly itemDescTransTime = 0.5;
  private readonly transDelay = 0.5;

  private ground: Ground;

  private title: Phaser.GameObjects.Text;
  private goalDescription: Phaser.GameObjects.Text;
  private itemDescription: Phaser.GameObjects.Text;
  private hourglassInfo: Phaser.GameObjects.Text;
  private birdInfo: Phaser.GameObjects.Text;

  private hourglass: Phaser.GameObjects.Image;
  private bird: Bird;
  private backToTitleButton: Button;

  constructor() {
    super({ key: SceneKeys.HowTo });
  }

  preload(): void {}

  create(): void {
    this.initializeStaticElements();

    this.ground = new Ground(this, 1);

    this.hourglassInfo = TextPopUp.showText({
      x: AlignTool.getXfromScreenWidth(this, -0.5),
      y: AlignTool.getYfromScreenHeight(this, 0.65),
      text: 'Gain extra 3 seconds by hitting',
      duration: 0.01,
      style: {
        fontSize: 40,
        fontFamily: FontKeys.TrulyMadly,
        color: 'black',
        strokeThickness: 1
      },
      animType: TEXT_ANIM_TYPE.EMBIGGEN,
      retain: true
    })?.text as Phaser.GameObjects.Text;

    this.birdInfo = TextPopUp.showText({
      x: AlignTool.getXfromScreenWidth(this, -0.6),
      y: AlignTool.getYfromScreenHeight(this, 0.75),
      text: 'Lose 1 second when you hit',
      duration: 0.01,
      style: {
        fontSize: 40,
        fontFamily: FontKeys.TrulyMadly,
        color: 'black',
        strokeThickness: 1
      },
      animType: TEXT_ANIM_TYPE.EMBIGGEN,
      retain: true
    })?.text as Phaser.GameObjects.Text;

    this.bird = new Bird(this);
    this.bird.setDefaultSettings();
    this.bird.setPosition(
      AlignTool.getXfromScreenWidth(this, -0.15),
      AlignTool.getYfromScreenHeight(this, 0.75)
    );

    this.title = TextPopUp.showText({
      x: AlignTool.getXfromScreenWidth(this, -0.5),
      y: AlignTool.getYfromScreenHeight(this, 0.15),
      text: 'How To Play',
      duration: 0.01,
      style: {
        fontSize: 72,
        fontFamily: FontKeys.SlopeOpera,
        color: 'black',
        strokeThickness: 1
      },
      animType: TEXT_ANIM_TYPE.EMBIGGEN,
      retain: true
    })?.text as Phaser.GameObjects.Text;
    this.tweens.add({
      targets: this.title,
      x: AlignTool.getXfromScreenWidth(this, 0.5),
      duration: this.titleTransTime * 1000
    });

    // Goal Desc
    this.time.addEvent({
      delay: (this.titleTransTime + this.transDelay) * 1000,
      callback: () => {
        this.goalDescription = TextPopUp.showText({
          x: AlignTool.getXfromScreenWidth(this, 0.5),
          y: AlignTool.getYfromScreenHeight(this, 0.35),
          text:
            'Stack the box as high as you can.\n\nThe higher the box,\nthe greater the score you get!',
          duration: this.goalTransTime,
          style: {
            fontSize: 48,
            fontFamily: FontKeys.TrulyMadly,
            color: 'black',
            strokeThickness: 1
          },
          animType: TEXT_ANIM_TYPE.EMBIGGEN,
          retain: true
        })?.text as Phaser.GameObjects.Text;
      },
      callbackScope: this
    });

    // Item desc
    this.time.addEvent({
      delay:
        (this.titleTransTime + this.goalTransTime + this.transDelay * 2) * 1000,
      callback: () => {
        this.itemDescription = TextPopUp.showText({
          x: AlignTool.getXfromScreenWidth(this, 0.5),
          y: AlignTool.getYfromScreenHeight(this, 0.55),
          text: 'There are also items that you can collect:',
          duration: this.itemDescTransTime,
          style: {
            fontSize: 42,
            fontFamily: FontKeys.TrulyMadly,
            color: 'black',
            strokeThickness: 1
          },
          animType: TEXT_ANIM_TYPE.EMBIGGEN,
          retain: true
        })?.text as Phaser.GameObjects.Text;
      },
      callbackScope: this
    });

    // Hourglass info
    this.time.addEvent({
      delay:
        (this.titleTransTime +
          this.goalTransTime +
          this.itemDescTransTime +
          this.transDelay * 3) *
        1000,
      callback: () => {
        this.tweens.add({
          targets: this.hourglassInfo,
          x: AlignTool.getXfromScreenWidth(this, 0.4),
          duration: this.itemDescTransTime * 1000
        });
      },
      callbackScope: this
    });

    // Hourglass image
    this.time.addEvent({
      delay:
        (this.titleTransTime +
          this.goalTransTime +
          this.itemDescTransTime * 2 +
          this.transDelay * 4) *
        1000,
      callback: () => {
        this.hourglass = ImagePopUp.showImage({
          x: AlignTool.getXfromScreenWidth(this, 0.85),
          y: AlignTool.getYfromScreenHeight(this, 0.65),
          image: 'hourglass',
          width: 100,
          height: 100,
          duration: this.itemDescTransTime,
          animType: ANIMATION_TYPE.EMBIGGEN,
          retain: true
        }).image;

        this.time.addEvent({
          delay: 10,
          callback: () => {
            this.hourglass.setAngle(this.hourglass.angle + 1);
          },
          callbackScope: this,
          repeat: -1
        });
      },
      callbackScope: this
    });

    // Bird info
    this.time.addEvent({
      delay:
        (this.titleTransTime +
          this.goalTransTime +
          this.itemDescTransTime * 3 +
          this.transDelay * 5) *
        1000,
      callback: () => {
        this.tweens.add({
          targets: this.bird,
          x: AlignTool.getXfromScreenWidth(this, 0.85),
          duration: 1000
        });
        this.tweens.add({
          targets: this.birdInfo,
          x: AlignTool.getXfromScreenWidth(this, 0.4),
          duration: 1000
        });
      },
      callbackScope: this
    });

    // Button
    this.backToTitleButton = new Button(
      this,
      AlignTool.getXfromScreenWidth(this, 0.5),
      AlignTool.getYfromScreenHeight(this, 0.94),
      0.175,
      DepthConfig.gameHeaderUI,
      ButtonType.BackFromHowTo
    );
  }

  initializeStaticElements(): void {
    TextPopUp.init(this, DepthConfig.score);
    ImagePopUp.init(this, DepthConfig.gameOverPanel);
  }
}

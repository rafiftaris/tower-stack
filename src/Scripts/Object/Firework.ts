import * as Phaser from 'phaser';
import { TextureKeys, AudioKeys } from "../Enum/enum";
import AlignTool from '../Util/AlignTool';
import DepthConfig from '../Config/DepthConfig';
import { IFirework } from '../Interfaces/interface';

export default class Firework
extends Phaser.Physics.Matter.Image 
implements IFirework{
    
  private frameNumber: number;
  private realX: number;
  private realY: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    scalePercentage: number
  ) {
    super(scene.matter.world, x, y, TextureKeys.Firework, 0);
    this.frameNumber = 0;
    this.realX = x;
    this.realY = y;

    this.setDefaultSettings(scalePercentage);
    this.hide();
  }

  /**
   * Set default settings for firework
   * @param scalePercentage: scale percentage from screen height
   */
  setDefaultSettings(scalePercentage: number): void {
    this.setSensor(true);
    this.setIgnoreGravity(true);
    this.setDepth(DepthConfig.firework);

    AlignTool.scaleToScreenHeight(this.scene, this, scalePercentage);

    this.scene.add.existing(this);
  }

  /**
   * Show firework
   * @param playSound: play firework sfx when true, false otherwise
   */
  show(playSound: boolean): void {
    this.setPosition(this.realX, this.realY);
    this.setVisible(true);
    this.setActive(true);
    this.frameNumber = 0;

    if (playSound) {
      this.scene.sound.play(AudioKeys.Firework);
    }

    this.scene.time.addEvent({
      delay: 50,
      callback: () => {
        this.setTexture(TextureKeys.Firework, this.frameNumber);
        this.frameNumber++;
      },
      callbackScope: this,
      repeat: 29
    });
    this.scene.time.addEvent({
      delay: 50 * 29,
      callback: this.hide,
      callbackScope: this
    });
  }

  /**
   * Hide firework
   */
  hide(): void {
    this.setPosition(AlignTool.getXfromScreenWidth(this.scene, 2), this.y);
    this.setVisible(false);
    this.setActive(false);
  }
}

import * as Phaser from 'phaser';
import AlignTool from '../Util/AlignTool';
import DepthConfig from '../Config/DepthConfig';

export default class Firework extends Phaser.Physics.Matter.Image {
  private frameNumber: number;
  private realX: number;
  private realY: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    scalePercentage: number
  ) {
    super(scene.matter.world, x, y, 'firework', 0);
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
   */
  show(playSound: boolean): void {
    this.setPosition(this.realX, this.realY);
    this.setVisible(true);
    this.setActive(true);
    this.frameNumber = 0;

    if (playSound) {
      this.scene.sound.play('firework');
    }

    this.scene.time.addEvent({
      delay: 50,
      callback: () => {
        this.setTexture('firework', this.frameNumber);
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

import * as Phaser from 'phaser';
import AlignTool from '../Util/AlignTool';
import DepthConfig from '../Config/DepthConfig';

import { DIRECTION } from '../Enum/enum';

import { IItem } from '../Interfaces/interface';

const CONFIG = {
  label: 'Hourglass',
  frictionAir: 0
};

export default class Hourglass extends Phaser.Physics.Matter.Sprite
  implements IItem {
  private direction: DIRECTION;
  private flyingTween: Phaser.Tweens.Tween;
  itemType: string;
  isHit: boolean;

  constructor(scene: Phaser.Scene) {
    super(
      scene.matter.world,
      AlignTool.getXfromScreenWidth(scene, 0.5),
      AlignTool.getYfromScreenHeight(scene, 0.5),
      'hourglass',
      0,
      CONFIG
    );
  }

  /**
   * Set default settings of hourglass item
   */
  setDefaultSettings(): void {
    this.itemType = 'Hourglass';
    this.isHit = false;
    this.setSensor(true);
    this.setIgnoreGravity(true);
    AlignTool.scaleToScreenHeight(this.scene, this, 0.09);
    this.setDepth(DepthConfig.item);
    this.scene.add.existing(this);
  }

  /**
   * Fly to the desired direction
   * @param direction: left or right
   */
  fly(direction: DIRECTION, height: number): void {
    this.isHit = false;

    if (direction == DIRECTION.right) {
      this.setPosition(AlignTool.getXfromScreenWidth(this.scene, -1), height);
      this.flyingTween = this.scene.tweens.add({
        targets: this,
        x: AlignTool.getXfromScreenWidth(this.scene, 2.1),
        duration: 4000
      });
    } else if (direction == DIRECTION.left) {
      this.setPosition(AlignTool.getXfromScreenWidth(this.scene, 2), height);
      this.flyingTween = this.scene.tweens.add({
        targets: this,
        x: AlignTool.getXfromScreenWidth(this.scene, -1.1),
        duration: 4000
      });
    }
  }

  /**
   * Hide hourglass item
   */
  hide(): void {
    this.setVisible(false);
    this.setActive(false);
  }

  /**
   * Hide hourglass after hit by falling block
   */
  hideAfterHit(): void {
    this.isHit = true;
    this.hide();
    this.resetSettings();
  }

  /**
   * Reset hourglass settings
   */
  resetSettings(): void {
    this.setAngle(0);
    this.setAngularVelocity(0);
    this.setVelocity(0);
  }
}

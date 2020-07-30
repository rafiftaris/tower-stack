import * as Phaser from 'phaser';
import AlignTool from '../Util/AlignTool';
import DepthConfig from '../Config/DepthConfig';

import { DIRECTION } from '../Enum/enum';

import { IItem } from '../Interfaces/interface';

const CONFIG = {
  label: 'Bird',
  frictionAir: 0
};

export default class Bird extends Phaser.Physics.Matter.Sprite implements IItem {
  private direction: DIRECTION;
  private frameNumber: number;
  private flyingTween: Phaser.Tweens.Tween;
  private animationEvent: Phaser.Time.TimerEvent;
  itemType: string;
  isHit: boolean;

  constructor(scene: Phaser.Scene) {
    super(
      scene.matter.world,
      AlignTool.getXfromScreenWidth(scene, 0.5),
      AlignTool.getYfromScreenHeight(scene, 0.5),
      'birdsheet',
      0,
      CONFIG
    );
  }

  setDefaultSettings(): void {
    this.itemType = 'Bird';
    this.isHit = false;
    this.frameNumber = 0;
    this.setSensor(true);
    this.setIgnoreGravity(true);
    AlignTool.scaleToScreenHeight(this.scene, this, 0.1);
    this.setFlipX(false);
    this.setDepth(DepthConfig.item);
    this.animate();
    this.scene.add.existing(this);
  }

  /**
   * Fly to the desired direction
   * @param direction: left or right
   */
  fly(direction: DIRECTION, height: number): void {
    this.direction = direction;
    this.isHit = false;

    if (direction == DIRECTION.right) {
      this.setPosition(AlignTool.getXfromScreenWidth(this.scene, -1), height);
      this.flyingTween = this.scene.tweens.add({
        targets: this,
        x: AlignTool.getXfromScreenWidth(this.scene, 2.1),
        duration: 4000
      });
    } else if (direction == DIRECTION.left) {
      this.setFlipX(true);
      this.setPosition(AlignTool.getXfromScreenWidth(this.scene, 2), height);
      this.flyingTween = this.scene.tweens.add({
        targets: this,
        x: AlignTool.getXfromScreenWidth(this.scene, -1.1),
        duration: 4000
      });
    }
  }

  /**
   * Animate bird flying movement
   */
  animate(): void {
    if (this.animationEvent) {
      return;
    }

    this.animationEvent = this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        this.frameNumber = (this.frameNumber + 1) % 9;
        this.setFrame(this.frameNumber);
      },
      callbackScope: this,
      repeat: -1
    });
  }

  hide(): void {
    this.isHit = false;
    this.setVisible(false);
    this.setActive(false);
  }

  hideAfterHit(): void {
    this.isHit = true;
    this.hide();
    this.resetSettings();
  }

  resetSettings(): void {
    this.setAngle(0);
    this.setAngularVelocity(0);
    this.setVelocity(0);
    this.setFlipX(false);
  }
}

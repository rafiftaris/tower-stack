import * as Phaser from 'phaser';
import AlignTool from '../Util/AlignTool';
import DepthConfig from '../Config/DepthConfig';

import { Direction, TextureKeys, ItemTypes } from '../Enum/enum';

import { IItem } from '../Interfaces/interface';

const CONFIG = {
  frictionAir: 0
};

export default class Item extends Phaser.Physics.Matter.Sprite
  implements IItem {
  private direction: Direction;
  private frameNumber: number;
  private flyingTween: Phaser.Tweens.Tween;
  private animationEvent: Phaser.Time.TimerEvent;
  itemType: ItemTypes;
  isHit: boolean;

  constructor(scene: Phaser.Scene) {
    super(
      scene.matter.world,
      AlignTool.getXfromScreenWidth(scene, 0.5),
      AlignTool.getYfromScreenHeight(scene, 0.5),
      TextureKeys.Birdsheet,
      0,
      CONFIG
    );
  }

  /**
   * Set default settings of hourglass item
   */
  setDefaultSettings(itemType: ItemTypes): void {
    this.itemType = itemType;
    this.isHit = false;
    this.frameNumber = 0;
    this.setDepth(DepthConfig.item);

    switch (this.itemType) {
      case ItemTypes.Hourglass:
        this.setTexture(TextureKeys.Hourglass);
        AlignTool.scaleToScreenHeight(this.scene, this, 0.09);
        this.setCircle(this.displayWidth / 2);
        break;
      case ItemTypes.Bird:
        this.setTexture(TextureKeys.Birdsheet, 0);
        AlignTool.scaleToScreenHeight(this.scene, this, 0.1);
        this.setFlipX(false);
        this.setRectangle(this.displayWidth, this.displayHeight);
        break;
    }

    this.setSensor(true);
    this.setIgnoreGravity(true);
    this.animate();
    this.scene.add.existing(this);
  }

  /**
   * Fly to the desired direction
   * @param direction: left or right
   */
  fly(direction: Direction, height: number): void {
    this.isHit = false;

    if (direction === Direction.Right) {
      this.setPosition(AlignTool.getXfromScreenWidth(this.scene, -1), height);

      this.flyingTween = this.scene.tweens.add({
        targets: this,
        x: AlignTool.getXfromScreenWidth(this.scene, 2.1),
        duration: 4500
      });
    } else if (direction === Direction.Left) {
      if (this.itemType === ItemTypes.Bird) {
        this.setFlipX(true);
      }

      this.setPosition(AlignTool.getXfromScreenWidth(this.scene, 2), height);

      this.flyingTween = this.scene.tweens.add({
        targets: this,
        x: AlignTool.getXfromScreenWidth(this.scene, -1.1),
        duration: 4500
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
        if (this.itemType !== ItemTypes.Bird) {
          return;
        }
        this.frameNumber = (this.frameNumber + 1) % 9;
        this.setFrame(this.frameNumber);
      },
      callbackScope: this,
      repeat: -1
    });
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

    if (this.itemType === ItemTypes.Bird) {
      this.setFlipX(false);
    }
  }
}

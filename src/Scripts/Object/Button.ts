import * as Phaser from 'phaser';
import { SceneKeys } from '../Config/SceneKeys';

import AlignTool from '../Util/AlignTool';

import { ButtonType } from '../Enum/enum';
import { IButton } from '../Interfaces/interface';

export default class Button extends Phaser.GameObjects.Image
  implements IButton {
  private buttonType: ButtonType;
  private isEnabled: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    scalePercentage: number,
    depth: number,
    buttonType: ButtonType
  ) {
    super(scene, x, y, 'play');
    this.buttonType = buttonType;
    this.isEnabled = true;

    this.setSettings();
    this.setInteractive();
    this.setDepth(depth);
    AlignTool.scaleToScreenWidth(scene, this, scalePercentage);
    scene.add.existing(this);

    this.on(
      'pointerover',
      () => {
        this.setScale(this.scale + 0.1);
      },
      this
    );

    this.on(
      'pointerout',
      () => {
        this.setScale(this.scale - 0.1);
      },
      this
    );
  }

  /**
   * Set settings for specific button
   */
  private setSettings(): void {
    switch (this.buttonType) {
      case ButtonType.Play:
        this.on(
          'pointerdown',
          () => {
            if (this.isEnabled) {
              this.scene.scene.stop(SceneKeys.Title);
              this.scene.scene.start(SceneKeys.Level);
            }
          },
          this
        );
        this.isEnabled = false;
        break;

      case ButtonType.HowTo:
        this.on(
          'pointerdown',
          () => {
            if (this.isEnabled) {
              this.scene.scene.stop(SceneKeys.Title);
              this.scene.scene.start(SceneKeys.HowTo);
            }
          },
          this
        );
        this.isEnabled = false;
        break;

      case ButtonType.BackFromGameOver:
        this.setFlipX(true);
        this.on(
          'pointerdown',
          () => {
            if (this.isEnabled) {
              this.scene.scene.stop(SceneKeys.GameOver);
              this.scene.scene.stop(SceneKeys.Level);
              this.scene.scene.start(SceneKeys.Title);
            }
          },
          this
        );
        break;

      case ButtonType.BackFromHowTo:
        this.setFlipX(true);
        this.on(
          'pointerdown',
          () => {
            if (this.isEnabled) {
              this.scene.scene.stop(SceneKeys.HowTo);
              this.scene.scene.start(SceneKeys.Title);
            }
          },
          this
        );
        break;

      case ButtonType.Restart:
        this.setTexture('restart');
        this.on(
          'pointerdown',
          () => {
            this.scene.scene.stop(SceneKeys.GameOver);
            this.scene.scene.stop(SceneKeys.Level);
            this.scene.scene.start(SceneKeys.Level);
          },
          this
        );
    }
  }

  /**
   * Enable/disable button for input
   * @param value: true to enable button, false otherwise
   */
  public setEnabled(value: boolean) {
    this.isEnabled = value;
  }
}

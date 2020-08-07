import * as Phaser from 'phaser';
import { TextureKeys } from '../Enum/enum';
import AlignTool from '../Util/AlignTool';
import DepthConfig from '../Config/DepthConfig';
import { IBackground } from '../Interfaces/interface';

class BackgroundHelper implements IBackground {
  private static instance: BackgroundHelper;
  private background: Phaser.GameObjects.TileSprite;
  private scene: Phaser.Scene;

  public static get Instance() {
    const instance = this.instance || (this.instance = new this());
    return instance;
  }
  init(scene: Phaser.Scene) {
    this.scene = scene;
    this.background = new Phaser.GameObjects.TileSprite(
      scene,
      0,
      AlignTool.getYfromScreenHeight(scene, 0.35),
      1920,
      860,
      TextureKeys.Background
    );

    AlignTool.scaleToScreenHeight(scene, this.background, 1);
    this.background.setDepth(DepthConfig.background);
    scene.add.existing(this.background);
  }

  /**
   * Scroll background to give movement effects.
   */
  update(): void {
    this.background.tilePositionX += 0.5;
  }

  /**
   * Scroll down when stacking
   */
  scrollDown(): void {
    this.scene.time.addEvent({
      delay: 1,
      callback: () => {
        this.background.tilePositionY -= 0.5;
      },
      callbackScope: this,
      repeat: 50
    });
  }

  /**
   * Reset tile position to normal
   */
  reset(): void {
    this.background.tilePositionY = 0;
  }
}

export const Background = BackgroundHelper.Instance;

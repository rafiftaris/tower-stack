import * as Phaser from 'phaser';
import { TextureKeys } from '../Enum/enum';
import AlignTool from '../Util/AlignTool';
import DepthConfig from '../Config/DepthConfig';
import { IBackground } from '../Interfaces/interface';

export default class Background extends Phaser.GameObjects.TileSprite
  implements IBackground {
  constructor(scene: Phaser.Scene) {
    super(
      scene,
      0,
      AlignTool.getYfromScreenHeight(scene, 0.35),
      1920,
      860,
      TextureKeys.Background
    );

    AlignTool.scaleToScreenHeight(scene, this, 0.75);
    this.setDepth(DepthConfig.background);
    scene.add.existing(this);
  }

  /**
   * Scroll background to give movement effects.
   */
  update(): void {
    this.tilePositionX += 0.5;
  }
}

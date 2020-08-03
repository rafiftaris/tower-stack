import * as Phaser from 'phaser';
import { TextureKeys } from '../Enum/enum';
import AlignTool from '../Util/AlignTool';
import { IGround } from '../Interfaces/interface';

export default class Ground implements IGround {
  readonly PADDING_LEFT = 160;
  readonly PADDING_TOP = 1100;
  readonly SCALE = 5;
  readonly LENGTH = 3;
  readonly DEPTH = 3;

  private scene: Phaser.Scene;
  private groundTiles: Phaser.Physics.Matter.Sprite[];

  constructor(scene: Phaser.Scene, bitfield: number) {
    this.groundTiles = [];
    this.scene = scene;

    for (let i = 0; i < this.LENGTH; i++) {
      let image: string;
      let margin: number;

      if (i == 0) {
        image = TextureKeys.GrassLeft;
        margin = 0;
      } else if (i == this.LENGTH - 1) {
        image = TextureKeys.GrassRight;
        margin = this.groundTiles[i - 1].displayWidth;
      } else {
        image = TextureKeys.GrassMid;
        margin = this.groundTiles[i - 1].displayWidth;
      }

      const groundTile = scene.matter.add.sprite(0, 0, image);
      this.setDefaultSettings(i, groundTile, bitfield);
      this.groundTiles.push(groundTile);
    }
  }

  /**
   * Set default settings of a ground tile.
   * @param groundTile: ground tile
   * @param bitfield: collision bitfield
   */
  private setDefaultSettings(
    index: number,
    groundTile: Phaser.Physics.Matter.Sprite,
    bitfield: number
  ): void {
    AlignTool.scaleToScreenWidth(this.scene, groundTile, 0.25);

    const x =
      AlignTool.getXfromScreenWidth(this.scene, 0.25) +
      groundTile.displayWidth * index;
    const y = AlignTool.getYfromScreenHeight(this.scene, 0.95);
    groundTile.setPosition(x, y);

    groundTile.setStatic(true);
    groundTile.setCollisionCategory(bitfield);
    groundTile.setBounce(0);
  }

  /**
   * Get array of the ground blocks.
   */
  getGroundArray(): Phaser.Physics.Matter.Sprite[] {
    return this.groundTiles;
  }
}

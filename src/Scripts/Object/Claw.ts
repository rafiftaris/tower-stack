import * as Phaser from 'phaser';
import { TextureKeys } from '../Enum/enum';
import AlignTool from '../Util/AlignTool';
import DepthConfig from '../Config/DepthConfig';

export default class Claw extends Phaser.Physics.Matter.Sprite {
  public readonly jointLength = AlignTool.getYfromScreenHeight(this.scene, 0.3);
  public readonly scalePercentage = 0.2;

  private textureFrame: number;
  private clawPole: Phaser.Physics.Matter.Sprite;

  constructor(scene: Phaser.Scene) {
    super(
      scene.matter.world,
      AlignTool.getXfromScreenWidth(scene, 0.5),
      AlignTool.getYfromScreenHeight(scene, 0.5),
      TextureKeys.Claw,
      0
    );
    this.clawPole = new Phaser.Physics.Matter.Sprite(
      scene.matter.world,
      AlignTool.getXfromScreenWidth(scene, 0.5),
      AlignTool.getYfromScreenHeight(scene, 0.5),
      TextureKeys.ClawPole
    );

    this.textureFrame = 0;
    this.scene = scene;

    this.setDepth(DepthConfig.claw);
    this.setSensor(true);
    this.setIgnoreGravity(true);

    this.clawPole.setDepth(DepthConfig.clawpole);
    this.clawPole.setSensor(true);
    this.clawPole.setIgnoreGravity(true);
  }
}

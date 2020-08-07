import * as Phaser from 'phaser';
import { TextureKeys } from '../Enum/enum';
import AlignTool from '../Util/AlignTool';
import { IGround } from '../Interfaces/interface';
import BuildingBlock from './Block';
import DepthConfig from '../Config/DepthConfig';

export default class Ground implements IGround {
  readonly LENGTH = 3;

  private scene: Phaser.Scene;
  private groundContainer: Phaser.GameObjects.Container;
  private groundPhysContainer: Phaser.Physics.Matter.Sprite;

  private timeline: Phaser.Tweens.Timeline;

  constructor(scene: Phaser.Scene, bitfield: number) {
    let groundTiles: Phaser.GameObjects.Image[] = [];
    this.scene = scene;
    this.timeline = this.scene.tweens.createTimeline();

    for (let i = 0; i < this.LENGTH; i++) {
      let textureKey: string;
      let margin: number;

      if (i == 0) {
        textureKey = TextureKeys.GrassLeft;
        margin = 0;
      } else if (i == this.LENGTH - 1) {
        textureKey = TextureKeys.GrassRight;
        margin = groundTiles[i - 1].displayWidth;
      } else {
        textureKey = TextureKeys.GrassMid;
        margin = groundTiles[i - 1].displayWidth;
      }

      let groundTile = scene.add.image(
        AlignTool.getXfromScreenWidth(scene,-0.2) + margin*i,
        AlignTool.getYfromScreenHeight(scene,0.95),
        TextureKeys.GrassLeft
      );
      groundTiles.push(groundTile);
      
    }

    this.groundContainer = scene.add.container(
      groundTiles[1].x,
      groundTiles[1].y,
      groundTiles
    );

    this.groundContainer.list.forEach((element,index) =>{
      const child = <Phaser.GameObjects.Image>element;
      AlignTool.scaleToScreenWidth(scene,child,0.25);
      child.setPosition(
        AlignTool.getXfromScreenWidth(scene,0) + groundTiles[0].displayWidth*(index-1),
        AlignTool.getYfromScreenHeight(scene,0)
      );
    });

    this.groundContainer.setSize(
      groundTiles[0].displayWidth * groundTiles.length,
      groundTiles[0].displayHeight
    );

    this.groundPhysContainer = <Phaser.Physics.Matter.Sprite>(scene.matter.add.gameObject(this.groundContainer));
    this.groundPhysContainer.setIgnoreGravity(true)
    this.groundPhysContainer.setStatic(true);
  }

  /**
   * Get array of the ground blocks.
   */
  getGround(): Phaser.Physics.Matter.Sprite {
    return this.groundPhysContainer;
  }

  /**
   * Move ground down after stack added
   */
  moveDown(block: BuildingBlock): void{
    this.scene.tweens.add({
      targets: this.groundPhysContainer,
      y: this.groundPhysContainer.y + block.displayHeight,
      duration: 500
    });
  }

  /**
   * Give earthquake effect when game over
   */
  shake(): void{
    if(this.timeline.isPlaying()){
      return;
    }
    const positionX = this.groundPhysContainer.body.position.x;

    this.timeline.add({
      targets: this.groundPhysContainer,
      x: positionX - 10,
      duration: 10
    });

    this.timeline.add({
      targets: this.groundPhysContainer,
      x: positionX + 10,
      duration: 20,
      yoyo: true,
      repeat: 10
    });

    this.timeline.add({
      targets: this.groundPhysContainer,
      x: positionX,
      duration: 10
    });

    this.timeline.play();
    console.log('shake some asses');
  }
}

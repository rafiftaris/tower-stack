import * as Phaser from 'phaser';
import { TextureKeys } from '../Enum/enum';
import AlignTool from '../Util/AlignTool';
import { IGround } from '../Interfaces/interface';
import BuildingBlock from './Block';

export default class Ground implements IGround {
  readonly LENGTH = 3;

  private scene: Phaser.Scene;
  private groundTiles: Phaser.Physics.Matter.Sprite[];
  private groundTileBodies: MatterJS.BodyType[];

  private timeline: Phaser.Tweens.Timeline;

  constructor(scene: Phaser.Scene, bitfield: number) {
    this.groundTiles = [];
    this.groundTileBodies = [];
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
        margin = this.groundTiles[i - 1].displayWidth;
      } else {
        textureKey = TextureKeys.GrassMid;
        margin = this.groundTiles[i - 1].displayWidth;
      }

      let groundTile = scene.matter.add.sprite(0, 0, textureKey);
      this.setDefaultSettings(i, groundTile, bitfield);
      
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

    this.groundTiles.push(groundTile);
    this.groundTileBodies.push(<MatterJS.BodyType>groundTile.body);
  }

  /**
   * Get array of the ground blocks.
   */
  getGroundArray(): Phaser.Physics.Matter.Sprite[] {
    return this.groundTiles;
  }

  /**
   * Move ground down after stack added
   */
  moveDown(block: BuildingBlock): void{
    this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        this.scene.tweens.add({
          targets: this.groundTiles,
          y: this.groundTiles[1].y + block.displayHeight,
          duration: 500
        });
      },
      callbackScope: this
    });
    

    // this.groundTiles.forEach(ground => {
    //   ground.setPosition(
    //     ground.x,
    //     ground.y + block.displayHeight
    //   );
    // });
  }

  /**
   * Give earthquake effect when game over
   */
  // shake(): void{
  //   if(this.timeline.isPlaying()){
  //     return;
  //   }
  //   const positionX = this.groundTiles

  //   this.timeline.add({
  //     targets: this.groundTiles,
  //     x: positionX - 10,
  //     duration: 10
  //   });

  //   this.timeline.add({
  //     targets: this.groundTiles,
  //     x: positionX + 10,
  //     duration: 20,
  //     yoyo: true,
  //     repeat: 10
  //   });

  //   this.timeline.add({
  //     targets: this.groundTiles,
  //     x: positionX,
  //     duration: 10
  //   });

  //   this.timeline.play();
  //   console.log('shake some asses');
  // }
}

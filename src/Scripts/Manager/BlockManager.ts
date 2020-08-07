import * as Phaser from 'phaser';

import BuildingBlock from '../Object/Block';
import Ground from '../Object/Ground';
import Firework from '../Object/Firework';

import AlignTool from '../Util/AlignTool';
import AnimationHelper from '../Util/AnimationHelper';
import { ANIMATION_TYPE, TextPopUp } from '../Util/TextPopUp';

import SoundConfig from '../Config/SoundConfig';
import { IGround } from '../Interfaces/interface';
import { AudioKeys, GameState } from '../Enum/enum';
import { times } from 'lodash';

class BlockManagerHelper {
  private smallPendulumForce: Phaser.Math.Vector2;

  private static instance: BlockManagerHelper;

  private scene!: Phaser.Scene;
  private stackedBlocks: BuildingBlock[];
  private blocksGroup: Phaser.GameObjects.Group;
  private aimBlock: BuildingBlock;
  private currentFallingBlock: BuildingBlock;
  private pivot: BuildingBlock;
  private joint: MatterJS.ConstraintType;

  private bitfield: number;
  private maxHeight: number;
  private score: number;

  public static get Instance() {
    const instance = this.instance || (this.instance = new this());
    return instance;
  }

  init(scene: Phaser.Scene, bitfield: number) {
    this.scene = scene;
    this.stackedBlocks = [];
    this.bitfield = bitfield;
    this.maxHeight = AlignTool.getYfromScreenHeight(scene, 0.95);
    this.score = 0;

    // Init blocks group
    this.blocksGroup = scene.add.group({
      classType: BuildingBlock,
      defaultKey: 'block',
      maxSize: 50
    });

    this.blocksGroup.createMultiple({
      classType: BuildingBlock,
      key: 'block',
      active: false,
      visible: false,
      quantity: 50,
      setXY: {
        x: AlignTool.getXfromScreenWidth(scene, -0.5),
        y: AlignTool.getYfromScreenHeight(scene, 0)
      }
    });

    this.pivot = this.blocksGroup.get();
    this.pivot.setPivotBlockSettings();

    this.aimBlock = this.blocksGroup.get();
    this.joint = this.aimBlock.setAimBlockSettings(this.pivot);

    this.smallPendulumForce = new Phaser.Math.Vector2(
      0,
      AlignTool.getYfromScreenHeight(
        this.scene,
        this.aimBlock.scalePercentage / 1250
      )
    );
  }

  /**
   * Get building block from block group
   * @returns building block
   */
  private getBlockFromGroup(): BuildingBlock {
    const block: BuildingBlock = this.blocksGroup.get();

    if (block) {
      block.setActive(true);
      block.setVisible(true);
      block.setDefaultSettings(this.bitfield);

      return block;
    }

    const newBlock = new BuildingBlock(this.scene, this.bitfield);
    newBlock.setDefaultSettings(this.bitfield);
    return newBlock;
  }

  /**
   * Get current score
   * @returns score
   */
  getScore(): number {
    return this.score;
  }

  /**
   * Get moving block
   * @returns Building block
   */
  getMovingBlock(): BuildingBlock {
    return this.aimBlock;
  }

  /**
   * Get dropping block group
   * @returns dropping block group
   */
  getBlockGroup(): Phaser.GameObjects.Group {
    return this.blocksGroup;
  }

  /**
   * Get stacked blocks
   * @returns stacked blocks
   */
  getStackedBlock(): BuildingBlock[] {
    return this.stackedBlocks;
  }

  /**
   * Get current dropping block
   * @returns current dropping block
   */
  getCurrentDroppingBlock(): BuildingBlock {
    return this.currentFallingBlock;
  }

  /**
   * Prepare game over state by counting score on stacked blocks.
   */
  setGameOver(): void {
    // this.aimBlock.hide();
    this.aimBlock.setStatic(true);

    let penalty = 0;
    this.stackedBlocks.forEach((block) => {
      const blockBody = <MatterJS.BodyType>block.body;
      if (
        Math.abs(blockBody.velocity.x) >= 0.5 ||
        Math.abs(blockBody.velocity.y) >= 0.5
      ) {
        block.setVisible(false);
        new Firework(this.scene, block.x, block.y, block.scalePercentage).show(
          false
        );
        penalty++;
      }
    });
    this.score -= penalty;

    this.blocksGroup.clear();
  }

  /**
   * Drop block from moving block position
   */
  dropBlock(): void {
    const position: Phaser.Math.Vector2 = this.aimBlock.hide();

    // Reset dropping block
    const blockBody = this.getBlockFromGroup();
    blockBody.setFallingBlockSettings(
      position,
      this.bitfield,
      this.aimBlock.getTextureFrame()
    );
    this.currentFallingBlock = blockBody;
  }

  /**
   * Apply force to swing when it reaches highest point
   */
  swingAimBlock(): void {
    // console.log(Math.abs(this.aimBlock.x-this.pivot.x));
    // console.log(this.aimBlock.body.velocity.x);
    const aimBlockBody = <MatterJS.BodyType>this.aimBlock.body;

    if (Math.abs(aimBlockBody.velocity.x) < 0.1) {
      const sign = new Phaser.Math.Vector2(
        Math.sign(this.aimBlock.x - this.pivot.x),
        1
      );

      this.aimBlock.applyForce(this.smallPendulumForce.multiply(sign));
    }
  }

  /**
   * Move swing block up
   */
  moveSwingUp(): void {
    console.log('move up');
    const diff = this.aimBlock.displayHeight;
    // if(n == 2){
    //   diff *= 2;
    // }

    this.scene.tweens.add({
      targets: this.aimBlock,
      y: this.aimBlock.y - diff,
      duration: 500
    });

    this.scene.tweens.add({
      targets: this.pivot,
      y: this.pivot.y - diff,
      duration: 500
    });
  }

  /**
   * Check stacked blocks every update.
   * Remove block when its falling outside the ground.
   * Reduce horizontal speed when its rolling too fast.
   * @returns game state
   */
  checkStackedBlocks(gameState: GameState, ground: Ground): GameState {
    if (gameState === GameState.GameOver) {
      return;
    }

    const topmostBlock = this.stackedBlocks[this.stackedBlocks.length - 1];
    if (!topmostBlock) {
      return GameState.GameOn;
    }

    if (this.stackedBlocks.length >= 2) {
      const newMax = this.stackedBlocks[this.stackedBlocks.length - 2].y;

      if (newMax < this.maxHeight) {
        this.maxHeight = newMax;
      }
    }
    // console.log("active",topmostBlock.active);
    // console.log("visible",topmostBlock.visible);
    // console.log("position",[topmostBlock.body.position, this.maxHeight - topmostBlock.y]);

    // Check if topmost block position is not on the top of the stack
    const TOL = 10;
    if (
      this.maxHeight - topmostBlock.y <=
      topmostBlock.displayHeight / 2 - TOL
    ) {
      // console.log('top height', topmostBlock.y);
      // console.log('diff', (this.maxHeight - topmostBlock.y));
      // console.log('diff limit', topmostBlock.displayHeight/2);
      return GameState.GameOverSetup;
    }

    return GameState.GameOn;
  }

  /**
   * Show moving block after player drop a block.
   */
  showAimBlock(): void {
    this.aimBlock.show();
    this.aimBlock.changeTexture();
    this.aimBlock.updateDegree(this.aimBlock.getDegree() + 2, this.pivot);
  }

  /**
   * Add block to stacked blocks.
   * @param block: block that is going to be added
   */
  addBlockToStack(): void {
    this.currentFallingBlock.hasStacked = true;

    this.stackedBlocks.push(this.currentFallingBlock);
    // console.log('max height', this.maxHeight);
    // console.log('top height', this.currentFallingBlock.y);

    // Set boxes below to static so the game becomes easier
    if (this.stackedBlocks.length > 4) {
      this.stackedBlocks[this.stackedBlocks.length - 4].setStatic(true);
    }

    this.score++;

    this.currentFallingBlock = null;
  }

  /**
   * Update height of moving block
   * @params newHeight: new height adjustment
   */
  updateHeight(): void {
    this.stackedBlocks.forEach((block, idx) => {
      const index = this.stackedBlocks.length - idx;

      // if(index > 8){
      //   return;
      // }
      if (index == 7) {
        // console.log('deactivate', idx);
        block.deactivate();
        this.stackedBlocks.shift();
      }
      // else if(index == 7){
      //   console.log('set static');
      //   block.setStatic(true);
      // }
      else {
        this.scene.time.addEvent({
          delay: 100,
          callback: () => {
            // block.setStatic(true);
            this.scene.tweens.add({
              targets: block,
              y: block.y + block.displayHeight,
              duration: 500
            });
            // block.setStatic(false);
          },
          callbackScope: this
        });

        // block.setPosition(
        //   block.x,
        //   block.y + block.displayHeight
        // );
      }
      // console.log(idx,{
      //   "position": block.body.position,
      //   "active": block.active,
      //   "visible": block.visible,
      //   "hasStacked": block.hasStacked,
      //   "static": block.isStatic()
      // });
    });

    // let blockSequence = 1;
    // while(blockSequence <= 5){
    //   let index = this.stackedBlocks.length - blockSequence;
    //   let block = this.stackedBlocks[index];

    //   if(!block){
    //     break;
    //   }

    //   if(blockSequence < 5){
    //     this.scene.time.addEvent({
    //       delay:100,
    //       callback: () => {
    //         // block.setStatic(true);
    //         this.scene.tweens.add({
    //           targets: block,
    //           y: block.y + block.displayHeight,
    //           duration: 500,
    //         });
    //         // block.setStatic(false);
    //       },
    //       callbackScope: this
    //     })
    //   } else {
    //     console.log('deactivate');
    //     block.deactivate();
    //   }

    //   blockSequence++;
    // }

    // this.stackedBlocks[7]?.setActive(false);
    // this.stackedBlocks[7]?.setVisible(false);
    // this.stackedBlocks[7]?.setStatic(true);
  }
}

export const BlockManager = BlockManagerHelper.Instance;

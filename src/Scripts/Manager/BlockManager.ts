import * as Phaser from 'phaser';
import { STARTING_DEGREE } from '../Config/GameConfig';

import BuildingBlock from '../Object/Block';
import Ground from '../Object/Ground';

import AlignTool from '../Util/AlignTool';

import { GameState, Direction, EventKeys } from '../Enum/enum';
import e = require('express');

class BlockManagerHelper {
  private static instance: BlockManagerHelper;

  private scene!: Phaser.Scene;
  private stackedBlocks: BuildingBlock[];
  private blocksGroup: Phaser.GameObjects.Group;
  private aimBlock: BuildingBlock;
  private currentFallingBlock: BuildingBlock;
  private pivot: BuildingBlock;
  private pivotTween: Phaser.Tweens.Tween;
  private pivotTweenDirection: Direction;
  private joint: MatterJS.ConstraintType;

  private bitfield: number;
  private maxHeight: number;
  private score: number;
  private slopeDistance: number;
  private slopeDirection: Direction;

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
    this.slopeDistance = 0;

    // Init blocks group
    this.blocksGroup = scene.add.group({
      classType: BuildingBlock,
      defaultKey: 'block',
      maxSize: 1000
    });

    // Init pivot
    this.pivot = this.blocksGroup.get();
    this.pivot.setPivotBlockSettings();
    this.pivotTweenDirection = Direction.Right;

    // Swinging aim block and joint
    this.aimBlock = this.blocksGroup.get();
    this.joint = this.aimBlock.setAimBlockSettings(this.pivot);
    this.aimBlock.updateDegree(STARTING_DEGREE, this.pivot);
  }

  /**
   * Get building block from block group
   * @returns building block
   */
  private getBlockFromGroup(): BuildingBlock {
    const block: BuildingBlock = this.blocksGroup.get();

    if (block) {
      this.scene.events.emit(EventKeys.BlockGenerated, block);
    }

    block.setActive(true);
    block.setVisible(true);
    block.setDefaultSettings(this.bitfield);

    return block;
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
   * Get topmost block of stack
   */
  getTopmostBlock(): BuildingBlock {
    return this.stackedBlocks[this.stackedBlocks.length - 1];
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

    this.stackedBlocks.forEach((block) => {
      block.removeSwingTween();
    });

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
   * Move swing block up
   */
  moveSwingUp(): void {
    const diff = this.aimBlock.displayHeight;
    // if(n == 2){
    //   diff *= 2;
    // }

    this.scene.tweens.add({
      targets: this.aimBlock,
      y: this.aimBlock.y - diff,
      duration: 500
    });

    this.pivotTween?.remove();
    this.pivotTween = null;

    this.scene.tweens.add({
      targets: this.pivot,
      y: this.pivot.y - diff,
      duration: 500
    });

    if (this.aimBlock.getDegree() == 80) {
      this.scene.time.delayedCall(500, () => {
        this.pivotTween = this.scene.tweens.add({
          targets: this.pivot,
          y: this.pivot.y - 30 * this.pivotTweenDirection,
          duration: 750,
          yoyo: true,
          repeat: -1
        });
        this.pivotTweenDirection *= -1;
      });
    }
  }

  /**
   * Check stacked blocks every update.
   * Remove block when its falling outside the ground.
   * Reduce horizontal speed when its rolling too fast.
   * @returns game state
   */
  checkStackedBlocks(gameState: GameState): GameState {
    if (gameState === GameState.GameOver) {
      return;
    }

    const topmostBlock = this.stackedBlocks[this.stackedBlocks.length - 1];
    if (!topmostBlock) {
      return GameState.GameOn;
    }

    if (this.stackedBlocks.length >= 2) {
      const boundBlock = this.stackedBlocks[this.stackedBlocks.length - 2];

      if (boundBlock.y < this.maxHeight) {
        this.maxHeight = boundBlock.y;
      }

      if (Math.abs(topmostBlock.angle) > 5 || Math.abs(boundBlock.angle) > 5) {
        topmostBlock.removeSwingTween();
        boundBlock.removeSwingTween();
      }
    }

    // Check if topmost block position is not on the top of the stack
    const TOL = 10;
    // console.log(this.stackedBlocks.length,{
    //   'maxheight': this.maxHeight,
    //   'topmost': topmostBlock.y,
    //   'diff': this.maxHeight - topmostBlock.y, 
    //   'limit': topmostBlock.displayHeight / 2 - TOL})
    if (
      this.maxHeight - topmostBlock.y <=
      topmostBlock.displayHeight / 2 - TOL
    ) {
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
    const currentSlope =
      this.stackedBlocks[this.stackedBlocks.length - 1].x -
      this.stackedBlocks[0].x;

    if (this.stackedBlocks.length > 7) {
      let index = 4;
      let direction: Direction = this.slopeDirection;
      let divider = 7.5 - 0.2 * Math.floor(this.stackedBlocks.length / 10);

      while (index > 0) {
        let block = this.stackedBlocks[this.stackedBlocks.length - index];
        direction = block.createSwingTween(direction, divider);
        index--;
      }
      this.stackedBlocks[this.stackedBlocks.length - 4].removeSwingTween();
    } else {
      if (this.slopeDistance < 0 && currentSlope < this.slopeDistance) {
        this.slopeDistance = currentSlope;
        this.slopeDirection = Direction.Left;
      } else if (this.slopeDistance > 0 && currentSlope > this.slopeDistance) {
        this.slopeDistance = currentSlope;
        this.slopeDirection = Direction.Right;
      } else if (this.slopeDistance == 0) {
        this.slopeDistance = currentSlope;
        if(this.slopeDistance > 0){
          this.slopeDirection = Direction.Right;
        } else {
          this.slopeDirection = Direction.Left;
        }
      }
    }

    // Set boxes below to static so the game becomes easier
    if (this.stackedBlocks.length > 4) {
      this.stackedBlocks[this.stackedBlocks.length - 4].setStatic(true);
    }

    // Check if boxes stacked too far from root
    if (Math.abs(currentSlope) > this.pivot.displayWidth * 0.7) {
      let index = 1;
      while (index <= 3) {
        const block = this.stackedBlocks[this.stackedBlocks.length - index];

        block.removeSwingTween();
        block.setRotation(Phaser.Math.DegToRad(30 * this.slopeDirection));
        index++;
      }
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

      if (index == 7) {
        block.deactivate();
        this.stackedBlocks.shift();
      } else {
        this.scene.time.addEvent({
          delay: 100,
          callback: () => {
            this.scene.tweens.add({
              targets: block,
              y: block.y + block.displayHeight,
              duration: 500
            });
          },
          callbackScope: this
        });
      }
    });

    /*
    CODE DOESN'T WORK 
    Push all stacks down so the block can be recycled.
    Some blocks disappear randomly
    */
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

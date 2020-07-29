import * as Phaser from 'phaser';

import BuildingBlock from '../Object/Block';
import Ground from '../Object/Ground';
import Firework from '../Object/Firework';

import AlignTool from '../Util/AlignTool';
import AnimationHelper from '../Util/AnimationHelper';
import { ANIMATION_TYPE, TextPopUp } from '../Util/TextPopUp';

import SoundConfig from '../Config/SoundConfig';
import { IGround } from '../Interfaces/interface';

class BlockManagerHelper {
  private static instance: BlockManagerHelper;

  private scene!: Phaser.Scene;
  private stackedBlocks!: BuildingBlock[];
  private blocksGroup!: Phaser.GameObjects.Group;
  private movingBlock!: BuildingBlock;
  private currentDroppingBlock: BuildingBlock;

  private score = 0;
  private bitfield: number;
  private maxStackLevel: number;

  public static get Instance() {
    const instance = this.instance || (this.instance = new this());
    return instance;
  }

  init(scene: Phaser.Scene, bitfield: number) {
    this.scene = scene;
    this.stackedBlocks = [];
    this.score = 0;
    this.bitfield = bitfield;
    this.maxStackLevel = 1;

    // Init blocks group
    this.blocksGroup = scene.add.group({
      classType: BuildingBlock,
      defaultKey: 'block',
      maxSize: 30
    });
    this.movingBlock = this.getBlockFromGroup();
    this.movingBlock.setMovingBlockSettings(this.bitfield);
  }

  /**
   * Get building block from block group
   * @returns: building block
   */
  private getBlockFromGroup(): BuildingBlock {
    const block: BuildingBlock = this.blocksGroup.get();

    if (block) {
      block.setActive(true);
      block.setVisible(true);
      block.setDefaultSettings(this.bitfield);

      return block;
    }
    return null;
  }

  /**
   * Get current score
   * @returns: score
   */
  getScore(): number {
    return this.score;
  }

  /**
   * Get moving block
   * @returns: Building block
   */
  getMovingBlock(): BuildingBlock {
    return this.movingBlock;
  }

  /**
   * Get delay duration for game over panel popup
   * @returns: delay duration
   */
  getDelayDuration(): number {
    return this.stackedBlocks.length * 750 + 1000;
  }

  /**
   * Get current max level of block stack
   * @returns: max stack level
   */
  getMaxStackLevel(): number{
    return this.maxStackLevel
  }

  /**
   * Prepare game over state by counting score on stacked blocks.
   * @param ground: In-game ground sprites
   */
  setGameOver(ground: IGround): void {
    this.movingBlock.hide();
    if (this.currentDroppingBlock) {
      this.scene.time.addEvent({
        delay: 1000,
        callback: () => {
          if (this.currentDroppingBlock) {
            this.currentDroppingBlock.setIgnoreGravity(true);
            this.currentDroppingBlock.setVisible(false);
            this.currentDroppingBlock.setVelocityY(0);
          }
        },
        callbackScope: this
      });
    }

    this.scene.time.addEvent({
      delay: 1000,
      callback: this.freezeStack,
      callbackScope: this
    });

    // Calculate Score
    this.scene.time.addEvent({
      delay: 750,
      callback: this.countBlockScore,
      args: [ground],
      callbackScope: this,
      repeat: this.stackedBlocks.length
    });
  }

  /**
   * Drop block from moving block position
   */
  dropBlock(): void {
    const position: Phaser.Math.Vector2 = this.movingBlock.hide();

    // Reset dropping block
    const blockBody = this.getBlockFromGroup();
    blockBody.setDroppingBlockSettings(
      position,
      this.bitfield,
      this.movingBlock.getTextureFrame()
    );
    this.currentDroppingBlock = blockBody;
  }

  /**
   * Get level of block, relative to ground
   * @param block: current block
   * @param ground: ground
   * @param countScore: set true for counting score
   */
  private getBlockLevel(block: BuildingBlock, ground: Ground): number{
    const groundBlock = ground.getGroundArray()[0];
    const blockY = AlignTool.getYfromScreenHeight(
      this.scene,
      (groundBlock.y - groundBlock.displayHeight / 2 - block.y) /
        AlignTool.getYfromScreenHeight(this.scene, 1)
    );
    const maxHeight = AlignTool.getYfromScreenHeight(
      this.scene,
      Math.sqrt(2 * (block.displayHeight / 2) ** 2) /
        AlignTool.getYfromScreenHeight(this.scene, 1) // When block is standing on one of its corner
    );
    const blockLevel =
      Math.ceil((blockY - maxHeight) / block.displayHeight) + 1;
    
    return blockLevel
  }

  /**
   * Count score of each block and accumulate to final score
   * @param ground: In-game ground sprites
   */
  private countBlockScore(ground: Ground): void {
    if (this.stackedBlocks.length > 0) {
      const block = this.stackedBlocks.shift();
      AnimationHelper.ChangeAlpha(this.scene, block, 0.5, 0);

      const currentBlockScore = this.getBlockLevel(block, ground);
      
      const scoreText = TextPopUp.showText({
        x: block.x,
        y: block.y,
        text: currentBlockScore.toString(),
        duration: 1,
        style: {
          fontSize: 96,
          fontStyle: 'Bold',
          fontFamily: 'Courier',
          color: 'black',
          strokeThickness: 1
        },
        animType: ANIMATION_TYPE.EMBIGGEN,
        retain: true
      })?.text as Phaser.GameObjects.Text;

      const firework = new Firework(this.scene, block.x, block.y, 0.14).show(
        false
      );

      this.scene.sound.play('score', { volume: SoundConfig.sfxVolume });
      this.score += currentBlockScore;
    }
  }

  /**
   * Check stacked blocks every update.
   * Remove block when its falling outside the ground.
   * Reduce horizontal speed when its rolling too fast.
   */
  checkStackedBlocks(ground: Ground): void {
    let currentMaxLevel = 1;
    this.stackedBlocks.forEach((block, index) => {
      const body = <MatterJS.BodyType>block.body;
      const velocityLimit = AlignTool.getXfromScreenWidth(this.scene, 0.002);

      // Check velocity limit
      if (body.velocity.x >= velocityLimit) {
        block.setVelocityX(velocityLimit);
      } else if (body.velocity.x <= -velocityLimit) {
        block.setVelocityX(-velocityLimit);
      }

      // Check if falling
      if (
        block.y >= AlignTool.getYfromScreenHeight(this.scene, 0.925) ||
        block.x <= AlignTool.getXfromScreenWidth(this.scene, 0) ||
        block.x >= AlignTool.getXfromScreenWidth(this.scene, 1)
      ) {
        block.setPosition(
          AlignTool.getXfromScreenWidth(this.scene, 0.5),
          AlignTool.getYfromScreenHeight(this.scene, 1)
        );
        block.setVisible(false);
        block.setActive(false);

        this.stackedBlocks.splice(index, 1);
        // console.log("fall",this.stackedBlocks.length);
      }

      let level = this.getBlockLevel(block, ground);
      if(level > currentMaxLevel) {
        currentMaxLevel = level;
      }
    });

    this.maxStackLevel = currentMaxLevel;
  }

  /**
   * Show moving block after player drop a block.
   */
  showMovingBlock(): void {
    this.movingBlock.show();
    this.movingBlock.changeTexture();
  }

  /**
   * Add block to stacked blocks.
   * @param block: block that is going to be added
   */
  addBlockToStack(block: BuildingBlock): void {
    this.stackedBlocks.push(block);
    this.currentDroppingBlock = null;
  }

  /**
   * Freeze stack after game over.
   */
  freezeStack(): void {
    this.currentDroppingBlock?.setVisible(false);
    this.currentDroppingBlock?.setActive(false);
    this.stackedBlocks.forEach((block, index) => {
      // Freeze box when not falling, remove from stack otherwise
      const body = <MatterJS.BodyType>block.body;
      if (body.velocity.y < 2) {
        block.setStatic(true);
        block.setIgnoreGravity(true);
      } else {
        block.setVisible(false);
        block.setActive(false);
        this.stackedBlocks.splice(index, 1);
      }
    });
  }

  /**
   * Update height of moving block
   * @params newHeight: new height adjustment
   */
  updateHeight(newHeight: number): void{
    this.movingBlock.setPosition(
      this.movingBlock.x,
      this.movingBlock.movingBlockStartingHeight + (AlignTool.getYfromScreenHeight(this.scene,1) - newHeight) / 2
    );
    console.log(AlignTool.getYfromScreenHeight(this.scene,0.1), this.movingBlock.y);
  }
}

export const BlockManager = BlockManagerHelper.Instance;

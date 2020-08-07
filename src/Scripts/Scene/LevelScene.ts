import * as Phaser from 'phaser';
import { SceneKeys } from '../Config/SceneKeys';

import { InputZone } from '../Object/InputZone';
import Ground from '../Object/Ground';
import BuildingBlock from '../Object/Block';
import Item from '../Object/Item';

import { BlockManager } from '../Manager/BlockManager';
import { ItemManager } from '../Manager/ItemManager';

import { ImagePopUp } from '../Util/ImagePopUp';
import { TextPopUp } from '../Util/TextPopUp';
import AlignTool from '../Util/AlignTool';

import { GameState, AudioKeys, EventKeys } from '../Enum/enum';

import DepthConfig from '../Config/DepthConfig';
import SoundConfig from '../Config/SoundConfig';

export default class LevelScene extends Phaser.Scene {
  private ground: Ground;

  private gameState: GameState;

  private timeline: Phaser.Tweens.Timeline;

  constructor() {
    super({ key: SceneKeys.Level });
  }

  preload(): void {}

  create(): void {
    const bitfield = this.matter.world.nextCategory();
    this.gameState = GameState.GameOn;
    this.timeline = this.tweens.createTimeline();

    this.initializeStaticElements(bitfield);

    this.cameras.main.zoomTo(0.9,500);

    this.matter.world.setBounds(
      AlignTool.getXfromScreenWidth(this, -1),
      AlignTool.getYfromScreenHeight(this, -8.5),
      AlignTool.getXfromScreenWidth(this, 3),
      AlignTool.getYfromScreenHeight(this, 10)
    );

    this.ground = new Ground(this, bitfield);

    const droppingBlocks = <BuildingBlock[]>(
      BlockManager.getBlockGroup().getChildren()
    );

    // Set collision
    droppingBlocks.forEach((block) => {
      block.setOnCollideWith(this.ground.getGroundArray(), () => {
        if (!block.hasStacked) {
          this.sound.play(AudioKeys.Thud, { volume: SoundConfig.thudVolume });

          BlockManager.addBlockToStack();

          this.moveUp();
        }
      });

      block.setOnCollideWith(droppingBlocks, () => {
        if (!block.active || !block.visible) {
          return;
        }

        if (!block.hasStacked) {
          this.sound.play(AudioKeys.Thud, { volume: SoundConfig.thudVolume });

          BlockManager.addBlockToStack();

          this.moveUp();
        }
      });
    });
  }

  update(): void {
    BlockManager.swingAimBlock();

    if (this.gameState === GameState.GameOverSetup) {
      this.setGameOver();
      this.gameState = GameState.GameOver;
    } else if (this.gameState === GameState.GameOn) {
      this.gameState = BlockManager.checkStackedBlocks(
        this.gameState,
        this.ground
      );
      // ItemManager.checkItem();
    }

    this.input.activePointer;
  }

  initializeStaticElements(bitfield: number): void {
    TextPopUp.init(this, DepthConfig.score);
    ImagePopUp.init(this, DepthConfig.gameOverPanel);
    BlockManager.init(this, bitfield);
    // ItemManager.init(this);
    InputZone.setState(GameState.GameOn);
  }

  setGameOver(): void {
    InputZone.setState(this.gameState);

    this.shakeCamera();
    // this.ground.shake();

    // ItemManager.setGameOver();
    BlockManager.setGameOver();

    this.time.addEvent({
      delay: 500,
      callback: () => {
        if (!this.scene.get(SceneKeys.GameOver).scene.isActive()) {
          this.scene.run(SceneKeys.GameOver);
        }
      },
      callbackScope: this
    });
  }

  /**
   * Give shake camera effect when game over
   */
  shakeCamera(): void {
    if (this.timeline.isPlaying()) {
      return;
    }

    const peak = this.cameras.main.y;
    const cameraX = this.cameras.main.x;

    this.timeline.add({
      targets: this.cameras.main,
      x: cameraX - 10,
      duration: 10
    });

    this.timeline.add({
      targets: this.cameras.main,
      x: cameraX + 10,
      duration: 20,
      yoyo: true,
      repeat: 10
    });

    this.timeline.add({
      targets: this.cameras.main,
      x: cameraX,
      duration: 10
    });

    this.timeline.play();

    // this.time.delayedCall(
    //   10+20*10+10+50,
    //   () => {
    //     this.cameras.main.pan(
    //       AlignTool.getXfromScreenWidth(this, 0.5),
    //       AlignTool.getYfromScreenHeight(this, 0.5),
    //       750
    //     );
    //   }
    // );

    // console.log('shake some ass');
  }

  moveUp(): void {
    if (this.gameState === GameState.GameOver) {
      return;
    }
    const stackedBlock = BlockManager.getStackedBlock();
    const movingBlock = BlockManager.getMovingBlock();

    if (stackedBlock.length > 1) {
      // console.log('update height');

      // if(stackedBlock.length < 6){
      //   this.ground.moveDown(movingBlock);
      // }
      // BlockManager.updateHeight();
      this.updateHeight(stackedBlock.length);
    }
  }

  updateHeight(n: number): void {
    this.cameras.main.pan(
      AlignTool.getXfromScreenWidth(this, 0.5),
      AlignTool.getYfromScreenHeight(this, 0.5) -
        BlockManager.getMovingBlock().displayHeight * (n - 1),
      500
    );

    BlockManager.moveSwingUp();
  }
}

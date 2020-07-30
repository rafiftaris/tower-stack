import * as Phaser from 'phaser';
import { SceneKeys } from '../Config/SceneKeys';

import { Timer } from '../Object/Timer';
import { InputZone } from '../Object/InputZone';
import Ground from '../Object/Ground';
import BuildingBlock from '../Object/Block';

import { BlockManager } from '../Manager/BlockManager';
import { ItemManager } from '../Manager/ItemManager';

import { ImagePopUp } from '../Util/ImagePopUp';
import { TextPopUp } from '../Util/TextPopUp';
import AlignTool from '../Util/AlignTool';

import { GameState, AudioKeys } from '../Enum/enum';
import { IItem } from '../Interfaces/interface';

import DepthConfig from '../Config/DepthConfig';
import SoundConfig from '../Config/SoundConfig';

export default class LevelScene extends Phaser.Scene {
  private ground: Ground;

  private gameState: GameState;
  private score: number;

  constructor() {
    super({ key: SceneKeys.Level });
  }

  preload(): void {}

  create(): void {
    const bitfield = this.matter.world.nextCategory();
    this.gameState = GameState.GameOn;

    this.initializeStaticElements(bitfield);

    this.matter.world.setBounds(
      AlignTool.getXfromScreenWidth(this, -0.5),
      AlignTool.getYfromScreenHeight(this, -1.25),
      AlignTool.getXfromScreenWidth(this, 2),
      AlignTool.getYfromScreenHeight(this, 2.5)
    );

    this.ground = new Ground(this, bitfield);

  }

  update(): void {
    BlockManager.checkStackedBlocks(this.ground);
    ItemManager.checkItem();
    
    this.matter.world.on('collisionstart', this.checkCollision, this);

    if (Timer.timesUp() && this.gameState === GameState.GameOn) {
      this.setGameOver();
    }

    this.input.activePointer;
  }

  checkCollision(event, obj1, obj2) {
    let block: BuildingBlock;

    // Check if either object is world bounds
    if (!obj1.gameObject || !obj2.gameObject || this.gameState === GameState.GameOver) {
      return;
    }

    // hasCollided undefined on ground objects
    if (obj1.gameObject.hasCollided !== undefined) {
      block = <BuildingBlock>obj1.gameObject;

      // Falling block collided with item
      if (obj2.gameObject.itemType !== undefined) {
        if (!obj2.gameObject.isHit && !block.hasCollided) {
          if (obj2.gameObject.itemType == 'Hourglass') {
            console.log("hourglass hit");
            Timer.increase(obj2.position.x, obj2.position.y);
          } else {
            Timer.decrease(obj2.position.x, obj2.position.y);
          }
          const item = <IItem>obj2.gameObject;
          item.hideAfterHit();
        }
      }

      // Falling block collided with ground
      else {
        if (!block.hasCollided) {
          this.sound.play(AudioKeys.Thud, { volume: SoundConfig.sfxVolume });
          block.hasCollided = true;
          BlockManager.addBlockToStack(block);
          BlockManager.checkStackedBlocks(this.ground);
          this.zoomCamera();
        }
      }
    }

    if (obj2.gameObject.hasCollided !== undefined) {
      block = <BuildingBlock>obj2.gameObject;

      // Falling block collided with item
      if (obj1.gameObject.itemType !== undefined) {
        if (!obj1.gameObject.isHit && !block.hasCollided) {
          if (obj1.gameObject.itemType == 'Hourglass') {
            console.log("hourglass hit");
            Timer.increase(obj1.position.x, obj1.position.y);
          } else {
            Timer.decrease(obj1.position.x, obj1.position.y);
          }
          const item = <IItem>obj1.gameObject;
          item.hideAfterHit();
        }
      }

      // Falling block collided with ground
      else {
        if (!block.hasCollided) {
          this.sound.play(AudioKeys.Thud, { volume: SoundConfig.sfxVolume });
          block.hasCollided = true;
          BlockManager.addBlockToStack(block);
          BlockManager.checkStackedBlocks(this.ground);
          this.zoomCamera();
        }
      }
    }
  }

  initializeStaticElements(bitfield: number): void {
    TextPopUp.init(this, DepthConfig.score);
    ImagePopUp.init(this, DepthConfig.gameOverPanel);
    BlockManager.init(this, bitfield);
    ItemManager.init(this);
    Timer.show();
    InputZone.setState(GameState.GameOn);
  }

  setGameOver(): void {
    this.gameState = GameState.GameOver;

    InputZone.setState(this.gameState);

    Timer.destroyTimeEvent();
    ItemManager.setGameOver();
    BlockManager.setGameOver(this.ground);

    this.time.delayedCall(
      BlockManager.getDelayDuration(),
      () => {
        this.scene.run(SceneKeys.GameOver);
      },
      null,
      this
    );
  }

  zoomCamera(): void{
    let zoomFactor = 1 / Math.pow(BlockManager.getMaxStackLevel(), 1/4);
    this.cameras.main.zoomTo(zoomFactor,500);

    const newHeight = AlignTool.getYfromScreenHeight(this,1) / zoomFactor;
    this.cameras.main.pan(
      AlignTool.getXfromScreenWidth(this,1) / 2, 
      (2*AlignTool.getYfromScreenHeight(this,1) - newHeight) / 2, 500
    );
    
    BlockManager.updateHeight(newHeight);
    ItemManager.updateHeightRange(newHeight);
  }
}

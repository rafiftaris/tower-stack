import * as Phaser from 'phaser';
import { SceneKeys } from '../Config/SceneKeys';

import { Timer } from '../Object/Timer';
import Ground from '../Object/Ground';
import BuildingBlock from '../Object/Block';

import { BlockManager } from '../Manager/BlockManager';
import { ItemManager } from '../Manager/ItemManager';

import { ImagePopUp } from '../Util/ImagePopUp';
import { TextPopUp } from '../Util/TextPopUp';
import AlignTool from '../Util/AlignTool';

import { GAME_STATE } from '../Enum/enum';
import { IItem, IGround } from '../Interfaces/interface';

import DepthConfig from '../Config/DepthConfig';
import SoundConfig from '../Config/SoundConfig';

export default class LevelScene extends Phaser.Scene {
  private ground: IGround;

  private inputZone: Phaser.GameObjects.Zone;

  private gameState: GAME_STATE;
  private inputDisabled: boolean;
  private score: number;

  constructor() {
    super({ key: SceneKeys.Level });
  }

  preload(): void {}

  create(): void {
    const bitfield = this.matter.world.nextCategory();
    this.gameState = GAME_STATE.GAME_ON;

    this.initializeStaticElements(bitfield);

    this.matter.world.setBounds(
      -500,
      -300,
      AlignTool.getXfromScreenWidth(this, 2),
      AlignTool.getYfromScreenHeight(this,1.5)
    );

    this.ground = new Ground(this, bitfield);

    // Input zone
    this.inputZone = new Phaser.GameObjects.Zone(
      this,
      0,
      100,
      AlignTool.getXfromScreenWidth(this, 1),
      AlignTool.getYfromScreenHeight(this, 0.95)
    );
    this.inputZone.setOrigin(0, 0);
    this.inputZone.setInteractive();
    this.add.existing(this.inputZone);
    this.inputDisabled = false;

    this.inputZone.on(
      'pointerdown',
      () => {
        if (this.inputDisabled || this.gameState === GAME_STATE.GAME_OVER) {
          return;
        }
        this.inputDisabled = true;
        ItemManager.addGenerateItemEvent();
        BlockManager.dropBlock();
        Timer.createTimerEvent();

        this.time.addEvent({
          delay: 1000,
          callback: this.showMovingBlock,
          callbackScope: this
        });
      },
      this
    );
  }

  update(): void {
    // this.background.update();
    BlockManager.checkStackedBlocks();
    ItemManager.checkItem();

    this.matter.world.on('collisionstart', this.checkCollision, this);

    if (Timer.timesUp() && this.gameState === GAME_STATE.GAME_ON) {
      this.setGameOver();
    }

    this.input.activePointer;
  }

  checkCollision(event, obj1, obj2) {
    let block: BuildingBlock;

    // Check if either object is world bounds
    if (!obj1.gameObject || !obj2.gameObject) {
      return;
    }

    // hasCollided undefined on ground objects
    if (obj1.gameObject.hasCollided !== undefined) {
      block = <BuildingBlock>obj1.gameObject;

      // Falling block collided with item
      if (obj2.gameObject.itemType !== undefined) {
        if (!obj2.gameObject.isHit && !block.hasCollided) {
          if (obj2.gameObject.itemType == 'Hourglass') {
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
          this.sound.play('thud', { volume: SoundConfig.sfxVolume });
          block.hasCollided = true;
          BlockManager.addBlockToStack(block);
        }
      }
    }

    if (obj2.gameObject.hasCollided !== undefined) {
      block = <BuildingBlock>obj2.gameObject;

      // Falling block collided with item
      if (obj1.gameObject.itemType !== undefined) {
        if (!obj1.gameObject.isHit && !block.hasCollided) {
          if (obj1.gameObject.itemType == 'Hourglass') {
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
          this.sound.play('thud', { volume: SoundConfig.sfxVolume });
          block.hasCollided = true;
          BlockManager.addBlockToStack(block);
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
  }

  showMovingBlock(): void {
    if (this.gameState === GAME_STATE.GAME_OVER) {
      return;
    }
    BlockManager.showMovingBlock();
    this.inputDisabled = false;
  }

  setGameOver(): void {
    this.gameState = GAME_STATE.GAME_OVER;
    Timer.destroyTimeEvent();
    ItemManager.setGameOver();
    this.inputZone.destroy();
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
}

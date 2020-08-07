import * as Phaser from 'phaser';
import AlignTool from '../Util/AlignTool';

import { GameState, EventKeys } from '../Enum/enum';

import { BlockManager } from '../Manager/BlockManager';
import { ItemManager } from '../Manager/ItemManager';

import { TextPopUp, ANIMATION_TYPE as TEXT_ANIM_TYPE } from '../Util/TextPopUp';

class InputZoneHelper {
  private static instance: InputZoneHelper;

  private inputZone: Phaser.GameObjects.Zone;
  private inputDisabled: boolean;
  private gameState: GameState;

  private instruction: Phaser.GameObjects.Text;

  public static get Instance() {
    const instance = this.instance || (this.instance = new this());
    return instance;
  }

  init(scene: Phaser.Scene) {
    this.inputZone = new Phaser.GameObjects.Zone(
      scene,
      0,
      100,
      AlignTool.getXfromScreenWidth(scene, 1),
      AlignTool.getYfromScreenHeight(scene, 0.95)
    );
    this.inputZone.setOrigin(0, 0);
    this.inputZone.setInteractive();
    scene.add.existing(this.inputZone);
    this.inputDisabled = false;
    this.gameState = null;

    this.instruction = TextPopUp.showText({
      x: AlignTool.getXfromScreenWidth(scene, 0.5),
      y: AlignTool.getYfromScreenHeight(scene, 0.5),
      text: 'Touch to drop box',
      duration: 0.01,
      style: {
        fontSize: 72,
        fontFamily: 'TrulyMadly',
        color: 'black',
        strokeThickness: 1
      },
      animType: TEXT_ANIM_TYPE.EMBIGGEN,
      retain: true
    })?.text as Phaser.GameObjects.Text;
    this.instruction.setVisible(false);

    this.inputZone.on(
      'pointerdown',
      () => {
        if (this.inputDisabled || this.gameState !== GameState.GameOn) {
          return;
        }
        if (this.instruction.visible) {
          this.instruction.setVisible(false);
        }
        this.inputDisabled = true;
        // ItemManager.addGenerateItemEvent();

        BlockManager.dropBlock();

        scene.time.addEvent({
          delay: 1000,
          callback: this.showMovingBlock,
          callbackScope: this
        });

        if (BlockManager.getStackedBlock().length > 1) {
          scene.events.emit(EventKeys.BlockDrop);
        }
      },
      this
    );
  }

  showMovingBlock(): void {
    if (this.gameState === GameState.GameOver) {
      return;
    }
    BlockManager.showAimBlock();
    this.inputDisabled = false;
  }

  setState(gameState: GameState) {
    this.gameState = gameState;
    if (this.gameState === GameState.GameOn) {
      this.inputDisabled = false;
      this.instruction.setVisible(true);
    }
  }
}

export const InputZone = InputZoneHelper.Instance;

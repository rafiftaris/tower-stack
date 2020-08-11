import * as Phaser from 'phaser';
import AlignTool from '../Util/AlignTool';

import { GameState, EventKeys, FontKeys } from '../Enum/enum';

import { BlockManager } from '../Manager/BlockManager';

import { TextPopUp, ANIMATION_TYPE as TEXT_ANIM_TYPE } from '../Util/TextPopUp';

class InputZoneHelper {
  private static instance: InputZoneHelper;

  private inputZone: Phaser.GameObjects.Zone;
  private inputDisabled: boolean;
  private gameState: GameState;

  private instruction: Phaser.GameObjects.Text;

  private scene: Phaser.Scene;
  private phaseOneDelay: Phaser.Time.TimerEvent;
  private phaseTwoDelay: Phaser.Time.TimerEvent;
  private countdownTimes: number;

  private textPositionY: number;

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
    this.scene = scene;
    this.textPositionY = AlignTool.getYfromScreenHeight(this.scene, 0.5);

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
        this.inputPressed();

        if (this.phaseOneDelay) {
          this.phaseOneDelay.remove();
        }
        this.phaseOneDelay = this.scene.time.delayedCall(
          10 * 1000,
          () => {
            this.countdownTimes = 0;
            if (this.phaseTwoDelay) {
              this.phaseTwoDelay.remove();
            }
            this.phaseTwoDelay = this.scene.time.addEvent({
              delay: 1000,
              callback: () => {
                this.showCountdown();
              },
              callbackScope: this,
              repeat: 5
            });
          },
          null,
          this
        );
      },
      this
    );
  }

  /**
   * Drop blocks when input
   */
  inputPressed(): void {
    if (this.inputDisabled || this.gameState !== GameState.GameOn) {
      return;
    }
    if (this.instruction.visible) {
      this.instruction.setVisible(false);
    }
    this.inputDisabled = true;
    // ItemManager.addGenerateItemEvent();

    BlockManager.dropBlock();

    this.scene.time.addEvent({
      delay: 1000,
      callback: this.showAimBlock,
      callbackScope: this
    });

    if (BlockManager.getStackedBlock().length > 1) {
      this.scene.events.emit(EventKeys.BlockDrop);
    }

    this.moveTextUp();
  }

  /**
   * Show countdown of input time limit
   */
  showCountdown(): void {
    TextPopUp.showText({
      x: AlignTool.getXfromScreenWidth(this.scene, 0.5),
      y: this.textPositionY,
      text: (5 - this.countdownTimes).toString(),
      duration: 0.8,
      style: {
        fontSize: 120,
        fontFamily: FontKeys.TrulyMadly,
        color: 'red',
        strokeThickness: 0.5
      },
      animType: TEXT_ANIM_TYPE.EMBIGGEN,
      retain: false
    })?.text as Phaser.GameObjects.Text;

    if (this.countdownTimes == 5) {
      this.inputPressed();
    }

    this.countdownTimes++;
  }

  /**
   * Show swinging aim block
   */
  showAimBlock(): void {
    if (this.gameState === GameState.GameOver) {
      return;
    }
    BlockManager.showAimBlock();
    this.inputDisabled = false;
  }

  /**
   * Set state of input listener
   * @param gameState current game state
   */
  setState(gameState: GameState) {
    this.gameState = gameState;
    if (this.gameState === GameState.GameOn) {
      this.inputDisabled = false;
      this.instruction.setVisible(true);
    }
  }

  /**
   * Move the countdown text up, following
   * the movement of stack
   */
  moveTextUp(): void {
    this.textPositionY -= BlockManager.getMovingBlock().displayHeight;
  }
}

export const InputZone = InputZoneHelper.Instance;

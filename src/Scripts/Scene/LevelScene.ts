import * as Phaser from 'phaser';
import { SceneKeys } from '../Config/SceneKeys';

import { InputZone } from '../Object/InputZone';
import Ground from '../Object/Ground';
import BuildingBlock from '../Object/Block';
import Item from '../Object/Item';

import { BlockManager } from '../Manager/BlockManager';
import { ItemManager } from '../Manager/ItemManager';

import { ImagePopUp } from '../Util/ImagePopUp';
import { TextPopUp, ANIMATION_TYPE as TEXT_ANIM_TYPE } from '../Util/TextPopUp';
import AlignTool from '../Util/AlignTool';

import { GameState, AudioKeys, FontKeys, EventKeys } from '../Enum/enum';

import DepthConfig from '../Config/DepthConfig';
import SoundConfig from '../Config/SoundConfig';

export default class LevelScene extends Phaser.Scene {
  private ground: Ground;

  private gameState: GameState;

  private timeline: Phaser.Tweens.Timeline;

  private scoreText: Phaser.GameObjects.Text;
  private warningText: Phaser.GameObjects.Text;

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

    this.scoreText = TextPopUp.showText({
      x: AlignTool.getXfromScreenWidth(this, 0.5),
      y: AlignTool.getYfromScreenHeight(this, 0.6),
      text: "Score: 0",
      duration: 0.01,
      style: {
        fontSize: 64,
        fontFamily: FontKeys.TrulyMadly,
        color: 'Black',
        strokeThickness: 1
      },
      animType: TEXT_ANIM_TYPE.EMBIGGEN,
      retain: true
    })?.text as Phaser.GameObjects.Text;

    this.warningText = TextPopUp.showText({
      x: AlignTool.getXfromScreenWidth(this, 0.5),
      y: AlignTool.getYfromScreenHeight(this, 0.5),
      text: "\t\t\t\t\t\t\tWarning: Tower imbalance\nDon't put block too far from middle",
      duration: 0.01,
      style: {
        fontSize: 28,
        fontFamily: FontKeys.TrulyMadly,
        color: "Red",
        strokeThickness: 0.5
      },
      animType: TEXT_ANIM_TYPE.EMBIGGEN,
      retain: true
    })?.text as Phaser.GameObjects.Text;
    this.warningText.setVisible(false);

    this.matter.world.setBounds(
      AlignTool.getXfromScreenWidth(this, -1),
      AlignTool.getYfromScreenHeight(this, -8.5),
      AlignTool.getXfromScreenWidth(this, 3),
      AlignTool.getYfromScreenHeight(this, 10)
    );

    this.ground = new Ground(this, bitfield);

    this.events.addListener(
      EventKeys.BlockGenerated,
      (block: BuildingBlock) => {
        console.log('listend')
        this.setCollision(block);
      },
      this
    );
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

  setCollision(block: BuildingBlock): void{
    // Set collision
    block.setOnCollideWith(
      this.ground.getGroundArray(), 
      () => {
      if (!block.hasStacked) {
        this.sound.play(AudioKeys.Thud, { volume: SoundConfig.thudVolume });

        BlockManager.addBlockToStack();

        this.moveUp();
      }
    });

    block.setOnCollideWith(
      BlockManager.getStackedBlock(),
      () => {
      if (!block.active || !block.visible) {
        return;
      }

      if (!block.hasStacked) {
        this.sound.play(AudioKeys.Thud, { volume: SoundConfig.thudVolume });

        BlockManager.addBlockToStack();

        this.moveUp();
      }
    });
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
    this.scoreText.setText("Score: " + BlockManager.getScore().toString());

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
    
    const topmostBlock = BlockManager.getTopmostBlock();
    this.tweens.add({
      targets: this.scoreText,
      x: topmostBlock.x,
      y: topmostBlock.y - topmostBlock.displayHeight/2 - AlignTool.getYfromScreenHeight(this,0.05),
      duration: 500
    });

    BlockManager.moveSwingUp();
  }
}

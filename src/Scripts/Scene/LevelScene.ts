import * as Phaser from 'phaser';
import { SceneKeys } from '../Config/SceneKeys';

import { Timer } from '../Object/Timer';
import { InputZone } from '../Object/InputZone';
import Ground from '../Object/Ground';
import BuildingBlock from '../Object/Block';
import Item from '../Object/Item'; 

import { BlockManager } from '../Manager/BlockManager';
import { ItemManager } from '../Manager/ItemManager';

import { ImagePopUp } from '../Util/ImagePopUp';
import { TextPopUp } from '../Util/TextPopUp';
import AlignTool from '../Util/AlignTool';

import { GameState, AudioKeys, EventNames } from '../Enum/enum';

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

    const droppingBlocks = <BuildingBlock[]>BlockManager.getDroppingBlockGroup().getChildren();
    const items = <Item[]>ItemManager.getItemGroup().getChildren();

    // Set collision
    droppingBlocks.forEach(block => {
      block.setOnCollideWith(
        this.ground.getGroundArray(),
        () => {
          if(!this.sound.get(AudioKeys.Thud)?.isPlaying){
            this.sound.play(AudioKeys.Thud, { volume: SoundConfig.thudVolume });
          }
          if(!block.hasStacked){
            BlockManager.addBlockToStack();
            BlockManager.checkStackedBlocks(this.ground);
            this.zoomCamera();
          }
        }
      );

      block.setOnCollideWith(
        droppingBlocks,
        () => {
          if(!BlockManager.getCurrentDroppingBlock()){
            return;
          }
          if(!this.sound.get(AudioKeys.Thud)?.isPlaying){
            this.sound.play(AudioKeys.Thud, { volume: SoundConfig.thudVolume });
          }
          if(!block.hasStacked){
            BlockManager.addBlockToStack();
            BlockManager.checkStackedBlocks(this.ground);
            this.zoomCamera();
          }
        }
      );

      // Must use custom event listener because item body is resetted everytime
      this.events.addListener(
        EventNames.ItemGenerated,
        (item: Item) => {
          block.setOnCollideWith(
            item,
            () => {
              const currentItem = ItemManager.getCurrentItem();
              Timer.itemHit(currentItem.itemType, block.body.position.x, block.body.position.y);
              currentItem.hideAfterHit();
            }
          );
        },
        this
      );

    });

  }

  update(): void {
    BlockManager.checkStackedBlocks(this.ground);
    ItemManager.checkItem();

    if (Timer.timesUp() && this.gameState === GameState.GameOn) {
      this.setGameOver();
    }

    this.input.activePointer;
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

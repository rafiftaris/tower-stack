import * as Phaser from "phaser";
import FpsText from "../Object/FpsText";
import Timer from "../Object/Timer";
import Ground from "../Object/Ground";
import GameOverPanel from "../Object/GameOverPanel";
import BuildingBlock from "../Object/Block";
import Background from "../Object/Background";

import {BlockManager} from "../Manager/BlockManager";

import {getResolution} from '../Util/Util';
import {ImagePopUp} from "../Util/ImagePopUp";
import {TextPopUp} from "../Util/TextPopUp";
import AlignTool from "../Util/AlignTool";

import {GAME_STATE} from "../Enum/enum";

import DepthConfig from "../Config/DepthConfig";
import SoundConfig from "../Config/SoundConfig";


export default class LevelScene extends Phaser.Scene {
  private fpsText: FpsText;
  private timeText: Timer;
  private ground: Ground;
  private background: Background;
  private inputZone: Phaser.GameObjects.Zone;
  private gameState: GAME_STATE = GAME_STATE.GAME_ON;
  private inputDisabled: boolean;
  private score: number;
  private gameOverPanel: GameOverPanel;
  private stopwatch: Phaser.GameObjects.Image;

  constructor() {
    super({ key: "LevelScene" });
  }

  preload(): void {}

  create(): void {
    this.cameras.main.setBackgroundColor("#5fb3e5");
    this.initializeStaticElements();

    this.matter.world.setBounds(-500,-300,getResolution().width+1000,getResolution().height+500);
    this.background = new Background(this);

    this.fpsText = new FpsText(this);
    this.timeText = new Timer(this);

    this.ground = new Ground(this);

    this.inputZone = new Phaser.GameObjects.Zone(
      this,
      0,
      100,
      AlignTool.getXfromScreenWidth(this,1),
      AlignTool.getYfromScreenHeight(this,0.95)
    );
    this.inputZone.setOrigin(0,0);
    this.inputZone.setInteractive();
    this.add.existing(this.inputZone);

    this.gameOverPanel = new GameOverPanel(this);

    this.stopwatch = new Phaser.GameObjects.Image(
      this,
      AlignTool.getXfromScreenWidth(this,0.88),
      AlignTool.getYfromScreenHeight(this,0.025),
      "stopwatch"
    );
    this.stopwatch.setScale(0.12);
    this.add.existing(this.stopwatch);
    
    this.inputDisabled = false;

    let me = this;
    this.inputZone.on('pointerdown', () => {
      if(this.inputDisabled || this.gameState === GAME_STATE.GAME_OVER) { return; }
      me.inputDisabled = true;
      BlockManager.dropBlock();
      me.timeText.createTimerEvent();

      me.time.addEvent({
        delay: 1000,
        callback: me.showMovingBlock,
        callbackScope: me
      });
    },this);
  }

  initializeStaticElements(): void{
    TextPopUp.init(this, DepthConfig.score);
    ImagePopUp.init(this, DepthConfig.gameOverPanel);
    BlockManager.init(this);
  }

  showMovingBlock(): void{
    if(this.gameState === GAME_STATE.GAME_OVER) { return; }
    BlockManager.showMovingBlock();
    this.inputDisabled = false;
  }

  update(): void {
    this.background.update();
    BlockManager.checkFallingBlocks();
    this.matter.world.on('collisionstart',this.checkCollision,this);

    this.fpsText.update();
    if(this.timeText.timesUp() && this.gameState === GAME_STATE.GAME_ON){
      this.setGameOver();
    }

    this.input.activePointer;
  }

  checkCollision(event, obj1, obj2){
    let block: BuildingBlock;

    // Check if either object is world bounds
    if(!obj1.gameObject || !obj2.gameObject){ return; }

    // hasCollided undefined on ground objects
    if(obj1.gameObject.hasCollided !== undefined){
      block = <BuildingBlock>obj1.gameObject;
      
      if(!block.hasCollided){
        this.sound.play("thud", { volume: SoundConfig.sfxVolume });
        block.hasCollided = true;
        BlockManager.addBlockToStack(block);
      }
    }

    if(obj2.gameObject.hasCollided !== undefined){
      block = <BuildingBlock>obj2.gameObject;
      
      if(!block.hasCollided){
        this.sound.play("thud", { volume: SoundConfig.sfxVolume });
        block.hasCollided = true;
        BlockManager.addBlockToStack(block);
      }
    }
  }

  setGameOver(): void{
    this.gameState = GAME_STATE.GAME_OVER;
    this.timeText.destroyTimeEvent();
    this.inputZone.removeInteractive();
    this.inputZone.destroy();
    BlockManager.setGameOver(this.ground);
    this.time.delayedCall(BlockManager.getDelayDuration(),this.showPanel,null,this);
  }

  showPanel(): void{
    this.score = BlockManager.getScore();
    this.gameOverPanel.showScore(this.score);
  }
}

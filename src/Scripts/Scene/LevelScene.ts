import * as Phaser from "phaser";
import FpsText from "../Object/FpsText";
import Timer from "../Object/Timer";
import Ground from "../Object/Ground";
import BlockManager from "../Manager/BlockManager";

import {getResolution} from '../Util/Util';
import {ImagePopUp} from "../Util/ImagePopUp";
import {TextPopUp} from "../Util/TextPopUp";
import {GAME_STATE} from "../Enum/enum";
import GameOverPanel from "../Object/GameOverPanel";
import BuildingBlock from "../Object/Block";
import DepthConfig from "../Config/DepthConfig";
import AlignTool from "../Util/AlignTool";


export default class LevelScene extends Phaser.Scene {
  private fpsText: FpsText;
  private timeText: Timer;
  private ground: Ground;
  private blockManager: BlockManager;
  private inputZone: Phaser.GameObjects.Zone;
  private gameState: GAME_STATE = GAME_STATE.GAME_ON;
  private inputDisabled: boolean;
  private score: number;
  private gameOverPanel: GameOverPanel;
  private background: Phaser.GameObjects.Image;

  constructor() {
    super({ key: "LevelScene" });
  }

  preload(): void {}

  create(): void {
    this.sound.play("bgm",{
      loop: true,
      volume: 0.4
    });
    this.initializeStaticElements();
    this.matter.world.setBounds(-500,-300,getResolution().width+1000,getResolution().height+500);
    this.fpsText = new FpsText(this);
    this.timeText = new Timer(this);
    this.ground = new Ground(this);
    this.blockManager = new BlockManager(this);
    this.inputZone = new Phaser.GameObjects.Zone(this,0,100,getResolution().width,getResolution().height-100);
    this.inputZone.setOrigin(0,0);
    this.inputZone.setInteractive();
    this.add.existing(this.inputZone);
    this.inputDisabled = false;
    this.gameOverPanel = new GameOverPanel(this);
    this.background = new Phaser.GameObjects.Image(this,0,AlignTool.getYfromScreenHeight(this,0.5),"background");
    this.background.setScale(1.5);
    this.background.setDepth(DepthConfig.background);
    this.add.existing(this.background);

    let me = this;
    this.inputZone.on('pointerdown', () => {
      if(this.inputDisabled || this.gameState === GAME_STATE.GAME_OVER) { return; }
      me.inputDisabled = true;
      me.blockManager.dropBlock();
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
  }

  showMovingBlock(): void{
    if(this.gameState === GAME_STATE.GAME_OVER) { return; }
    this.blockManager.showMovingBlock();
    this.inputDisabled = false;
  }

  update(): void {
    this.blockManager.checkFallingBlocks();
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
    if(!obj1 && obj1.gameObject.hasCollided !== undefined){
      // console.log("obj1",obj1.gameObject);
      block = <BuildingBlock>obj1.gameObject;
      if(!block.hasCollided){
        this.sound.play("thud", { volume: 1.3 });
        block.hasCollided = true;
        this.blockManager.addBlockToStack(block);
      }
    }
    if(obj2.gameObject.hasCollided !== undefined){
      // console.log("obj2",obj2.gameObject);
      block = <BuildingBlock>obj2.gameObject;
      if(!block.hasCollided){
        this.sound.play("thud", { volume: 1.3 });
        block.hasCollided = true;
        this.blockManager.addBlockToStack(block);
      }
    }
  }

  setGameOver(): void{
    this.gameState = GAME_STATE.GAME_OVER;
    this.timeText.destroyTimeEvent();
    this.inputZone.removeInteractive();
    this.inputZone.destroy();
    this.blockManager.setGameOver(this.ground);
    this.time.delayedCall(this.blockManager.getDelayDuration(),this.showPanel,null,this);
  }

  showPanel(): void{
    this.score = this.blockManager.getScore();
    this.gameOverPanel.showScore(this.score);
  }
}

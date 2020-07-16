import * as Phaser from "phaser";
import FpsText from "../Object/FpsText";
import TimerText from "../Object/TimerText";
import Ground from "../Object/Ground";
import BlockManager from "../Manager/BlockManager";

import {getResolution} from '../Util/Util';
import {GAME_STATE} from "../Enum/enum";
import BuildingBlock from "../Object/Block";
import AlignTool from "../Util/AlignTool";


export default class LevelScene extends Phaser.Scene {
  private fpsText: FpsText;
  private timeText: TimerText;
  private ground: Ground;
  private blockManager: BlockManager;
  private inputZone: Phaser.GameObjects.Zone;
  private gameState: GAME_STATE = GAME_STATE.GAME_ON;
  private inputDisabled: boolean;

  constructor() {
    super({ key: "LevelScene" });
  }

  preload(): void {}

  create(): void {
    this.matter.world.setBounds(-500,-300,getResolution().width+1000,getResolution().height+500);
    this.fpsText = new FpsText(this);
    this.timeText = new TimerText(this);
    this.ground = new Ground(this);
    this.blockManager = new BlockManager(this);
    this.inputZone = new Phaser.GameObjects.Zone(this,0,100,getResolution().width,getResolution().height-100);
    this.inputZone.setOrigin(0,0);
    this.inputZone.setInteractive();
    this.add.existing(this.inputZone);
    this.inputDisabled = false;

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

  showMovingBlock(): void{
    this.blockManager.showMovingBlock();
    this.inputDisabled = false;
  }

  update(): void {
    this.blockManager.checkFallingBlocks();
    // this.matter.world.on('collisionstart',this.checkCollision,this);

    this.fpsText.update();
    if(this.timeText.timesUp()){
      this.setGameOver();
    }

    this.input.activePointer;
  }

  checkCollision(event, obj1, obj2){
    const threshY = AlignTool.getXfromScreenWidth(this,0.3)
    let allowCreateBlock = false;
    let worldBoundCollision = false;

    // Check if obj1 is world bounds
    if(!obj1.gameObject){
      if(!obj2.collidedWithWorldBounds){
        obj2.collidedWithWorldBounds = true;
        this.inputDisabled = false;
        allowCreateBlock = true;
        worldBoundCollision = true;
      }
    }

    if(!obj2.gameObject){
      if(!obj1.collidedWithWorldBounds){
        obj1.collidedWithWorldBounds = true;
        this.inputDisabled = false;
        allowCreateBlock = true;
        worldBoundCollision = true;
      }
    }

    if(worldBoundCollision && allowCreateBlock && !this.blockManager.getDroppingBlock()){
      this.blockManager.showMovingBlock();
      return;
    }

    // hasCollided undefined on ground objects
    if(!obj1 && obj1.gameObject.hasCollided !== undefined){
      // console.log("obj1",obj1.hasCollided);
      if(!obj1.hasCollided && obj1.position.y >= threshY){
        obj1.hasCollided = true;
        this.inputDisabled = false;
        allowCreateBlock = true;
      }
    }
    if(obj2.gameObject.hasCollided !== undefined){
      // console.log("obj2",obj2.hasCollided);
      if(!obj2.hasCollided && obj2.position.y >= threshY){
        obj2.hasCollided = true;
        this.inputDisabled = false;
        allowCreateBlock = true;
      }
    }
    if(allowCreateBlock && !this.blockManager.getDroppingBlock()){
      // console.log('create drop')
      this.blockManager.showMovingBlock();
    }
  }

  setGameOver(): void{
    this.blockManager.setGameOver();
    this.timeText.destroyTimeEvent();
    this.gameState = GAME_STATE.GAME_OVER;
  }
}

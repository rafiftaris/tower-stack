import * as Phaser from "phaser";
import FpsText from "../Object/FpsText";
import Ground from "../Object/Ground";
import BlockManager from "../Manager/BlockManager";

import {getResolution} from '../Util/Util';
import {GAME_STATE} from "../Enum/enum";

const MAX_HEIGHT = 3;

export default class LevelScene extends Phaser.Scene {
  private fpsText: FpsText;
  private ground: Ground;
  private blockManager: BlockManager;
  private inputZone: Phaser.GameObjects.Zone;
  private blockJustStacked: boolean;
  private gameOver: boolean;
  private gameState: GAME_STATE = GAME_STATE.GAME_ON;

  constructor() {
    super({ key: "LevelScene" });
  }

  preload(): void {}

  create(): void {
    this.fpsText = new FpsText(this);
    this.ground = new Ground(this);
    this.blockManager = new BlockManager(this);
    this.inputZone = new Phaser.GameObjects.Zone(this,0,100,getResolution().width,getResolution().height-100);
    this.inputZone.setOrigin(0,0);
    this.inputZone.setInteractive();
    this.add.existing(this.inputZone);
    this.blockJustStacked = false;
    this.gameOver = false;

    let me = this;
    this.inputZone.on('pointerdown', ()=>{
      me.blockManager.dropBlock();
    });
    this.physics.world.checkCollision.up = false;
  }

  update(): void {
    let droppingBlock = this.blockManager.getDroppingBlock();
    let me = this;
    this.physics.collide(this.ground.getGroundSurface(),droppingBlock,this.makeStack,null,this);
    this.physics.collide(droppingBlock,this.blockManager.getStackedBlocks(),this.makeStack,null,this);
    this.physics.world.on('worldbounds', ()=>{
      if(droppingBlock.y >= getResolution().height-32*4){
        me.setGameOver();
      }
    });

    if(this.blockManager.getStackedBlocks().length >= MAX_HEIGHT && this.blockJustStacked && this.gameState !== GAME_STATE.GAME_OVER){
      this.moveUp();
      this.blockJustStacked = false;
    }
    this.fpsText.update();

    this.input.activePointer;
  }

  makeStack(): void{
    let success = this.blockManager.stackBlock();
    if(!success){
      this.gameState = GAME_STATE.GAME_OVER;
    }
    this.blockJustStacked = true;
  }

  moveUp(): void{
    if(this.ground.getGroundSurface()[0].y <= getResolution().height){
      this.ground.pushDown();
    } else {
      this.ground.hide();
    }

    this.blockManager.pushDown();
    this.blockManager.checkBottomStack();
  }

  setGameOver(): void{
    this.blockManager.setGameOver();
    this.gameState = GAME_STATE.GAME_OVER;
  }
}

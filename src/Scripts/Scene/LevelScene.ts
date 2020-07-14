import * as Phaser from "phaser";
import FpsText from "../Object/FpsText";
import Ground from "../Object/Ground";
import BlockManager from "../Manager/BlockManager";

import {getResolution} from '../Util/Util';

export default class LevelScene extends Phaser.Scene {
  private fpsText: FpsText;
  private ground: Ground;
  private blockManager: BlockManager;
  private inputZone: Phaser.GameObjects.Zone;

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

    let me = this;
    this.inputZone.on('pointerdown', ()=>{
      me.blockManager.dropBlock();
    });
  }

  update(): void {
    this.physics.collide(this.ground.getGroundSurface(),this.blockManager.getDroppingBlock(),this.makeStack,null,this);
    this.physics.collide(this.blockManager.getDroppingBlock(),this.blockManager.getBlocksGroup(),this.makeStack,null,this);
    this.fpsText.update();

    this.input.activePointer;
  }

  makeStack(): void{
    this.blockManager.stackBlock();
  }
}

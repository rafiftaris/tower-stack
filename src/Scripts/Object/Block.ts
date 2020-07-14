import * as Phaser from "phaser";

const SCALE = 4;
import {getResolution} from '../Util/Util';

export default class BuildingBlock extends Phaser.Physics.Arcade.Sprite{
    private textureFrame: number;
    constructor(scene: Phaser.Scene){
        super(scene,0,0,"blocksheet",0);
        this.textureFrame = 0;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDefaultSettings();
    }
    
    setDefaultSettings(): void{
        this.setScale(SCALE);
        this.setBlockTexture();
    }

    setDroppingBlockSettings(): void{
        let random = Math.floor(Math.random()*2);
        if(random == 0){
            this.setPosition(100,128);
            this.setVelocityX(500);
        } else {
            this.setPosition(getResolution().width-100,128);
            this.setVelocityX(-500);
        }
        this.setBounceX(1);
        this.setCollideWorldBounds(true);
        let body = <Phaser.Physics.Arcade.Body>this.body;
        body.onWorldBounds = true;
        this.setBlockTexture();
        this.setGravityY(0);
    }
    
    setBlockTexture(frame?: number): void{
        if(!frame){
            frame = Math.floor(Math.random()*96);
        }
        this.setTexture("blocksheet",frame);
        this.textureFrame = frame;
    }
    
    drop(): void{
        this.setVelocityX(0);
        this.setVelocityY(1000);
        this.setGravityY(100);
    }

    getTextureFrame(): number{
        return this.textureFrame;
    }
    
}
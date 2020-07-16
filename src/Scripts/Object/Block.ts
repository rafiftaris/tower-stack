import * as Phaser from "phaser";

const SCALE = 4;
import {getResolution} from '../Util/Util';
import AlignTool from "../Util/AlignTool";
import AnimationHelper from "../Util/AnimationHelper";
import { Vector } from "matter";

const CONFIG = {
    label: "Block",
    mass: 10,
    frictionAir: 0,
    friction: 0.5,
    frictionStatic: 10,
    scale: new Phaser.Math.Vector2(SCALE,SCALE)
};

export default class BuildingBlock extends Phaser.Physics.Matter.Sprite{
    readonly SCALE = 5;

    private textureFrame: number;
    private tween: Phaser.Tweens.Tween;
    public hasCollided: boolean = false;
    public collidedWithWorldBounds: boolean = false;

    constructor(scene: Phaser.Scene){
        super(scene.matter.world,0,0,"blocksheet",0,CONFIG);
        this.textureFrame = 0;
        this.scene = scene;
        this.hasCollided = false;
        this.collidedWithWorldBounds = false;

        // this = scene.matter.add.sprite(0,0,"blocksheet",0,{
        //     label: "Block",
        //     mass: 10,
        //     frictionAir: 0,
        //     friction: 0.5,
        //     frictionStatic: 2,
        //     scale: new Phaser.Math.Vector2(SCALE,SCALE)
        // });
        this.setDefaultSettings();
    }
    
    setDefaultSettings(): void{
        this.setActive(true);
        this.setVisible(true);

        this.changeTexture();
    }

    setDroppingBlockSettings(): void{
        this.resetSettings();
        AlignTool.alignX(this.scene,this,0.1);
        AlignTool.alignY(this.scene,this,0.1);
        AlignTool.scaleToScreenHeight(this.scene,this,0.1);
        this.tween = this.scene.tweens.add({  
            targets: this,
            x: AlignTool.getXfromScreenWidth(this.scene,0.9),
            duration: 1000,
            yoyo: true,
            repeat: -1
        })
        this.setIgnoreGravity(true);
        this.setDefaultSettings();
    }

    resetSettings(): void{
        this.hasCollided = false;
        this.collidedWithWorldBounds = false;
        this.setVelocityX(0);
        this.setVelocityY(0);
        this.setAngle(0);
        this.setAngularVelocity(0);
    }
    
    changeTexture(frame?: number): void{
        if(!frame){
            frame = Math.floor(Math.random()*96);
        }
        this.setTexture("blocksheet",frame);
        this.textureFrame = frame;
    }
    
    drop(): void{
        this.tween.pause();
        this.setVelocityX(0);
        this.setVelocityY(20);
        this.setIgnoreGravity(false);
    }

    getTextureFrame(): number{
        return this.textureFrame;
    }

    getTween(): Phaser.Tweens.Tween{
        return this.tween;
    }
}
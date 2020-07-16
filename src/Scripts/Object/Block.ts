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
    friction: 0.8,
    frictionStatic: 100,
    scale: new Phaser.Math.Vector2(SCALE,SCALE)
};

export default class BuildingBlock extends Phaser.Physics.Matter.Sprite{
    readonly SCALE = 5;

    private textureFrame: number;
    private tween: Phaser.Tweens.Tween;

    constructor(scene: Phaser.Scene){
        super(scene.matter.world,0,0,"blocksheet",0,CONFIG);
        this.textureFrame = 0;
        this.scene = scene;

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
    
    setDefaultSettings(texture?: number): void{
        this.setActive(true);
        this.setVisible(true);
        this.setBounce(0);
        AlignTool.scaleToScreenHeight(this.scene,this,0.085);

        this.changeTexture(texture);
    }

    setMovingBlockSettings(): void{
        this.resetSettings();
        AlignTool.alignX(this.scene,this,0.1);
        AlignTool.alignY(this.scene,this,0.1);
        this.tween = this.scene.tweens.add({  
            targets: this,
            x: AlignTool.getXfromScreenWidth(this.scene,0.9),
            duration: 1000,
            yoyo: true,
            repeat: -1
        })
        this.setIgnoreGravity(true);
        this.setCollisionCategory(null);
        this.setDefaultSettings();
    }

    setDroppingBlockSettings(position: Phaser.Math.Vector2, texture: number): void{
        this.resetSettings();
        this.setPosition(position.x, position.y);
        this.setVelocityY(10);
        this.setIgnoreGravity(false);
        this.setDefaultSettings(texture);
    }

    private resetSettings(): void{
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
    
    hide(): Phaser.Math.Vector2{
        this.tween.pause();
        this.setVisible(false);
        let position = new Phaser.Math.Vector2(this.x, this.y);
        return position;
    }

    show(): void{
        this.tween.resume();
        this.setVisible(true);
    }

    getTextureFrame(): number{
        return this.textureFrame;
    }

    getTween(): Phaser.Tweens.Tween{
        return this.tween;
    }
}
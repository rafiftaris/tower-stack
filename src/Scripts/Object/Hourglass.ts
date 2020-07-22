import * as Phaser from 'phaser';
import AlignTool from "../Util/AlignTool";
import DepthConfig from "../Config/DepthConfig";

import {DIRECTION} from "../Enum/enum";

import {Item} from "../Interfaces/interface";

const CONFIG = {
    label: "Hourglass",
    frictionAir: 0
};

export default class Hourglass extends Phaser.Physics.Matter.Sprite implements Item{
    private direction: DIRECTION;
    private flyingTween: Phaser.Tweens.Tween;
    itemType: string;
    isHit: boolean;

    constructor(scene: Phaser.Scene){
        super(
            scene.matter.world,
            AlignTool.getXfromScreenWidth(scene,0.5),
            AlignTool.getYfromScreenHeight(scene,0.5),
            "hourglass",
            0,
            CONFIG
        );
    }

    setDefaultSettings(): void{
        this.itemType = "Hourglass";
        this.isHit = false;
        this.setSensor(true);
        this.setIgnoreGravity(true);
        this.setScale(0.04);
        this.setDepth(DepthConfig.collectibles);
        this.scene.add.existing(this);
    }

    /**
     * Fly to the desired direction
     * @param direction: left or right
     */
    fly(direction: DIRECTION): void{
        let height = Math.floor(Math.random()*50) + 300;

        if(direction == DIRECTION.right){
            this.setPosition(
                AlignTool.getXfromScreenWidth(this.scene,-0.1),
                height
            );
            this.flyingTween = this.scene.tweens.add({  
                targets: this,
                x: AlignTool.getXfromScreenWidth(this.scene,1.25),
                duration: 2500
            });
        } 
        
        else if (direction == DIRECTION.left) {
            this.setPosition(
                AlignTool.getXfromScreenWidth(this.scene,1.1),
                height
            );
            this.flyingTween = this.scene.tweens.add({  
                targets: this,
                x: AlignTool.getXfromScreenWidth(this.scene,-0.25),
                duration: 2500
            });
        }
    }

    hide(): void{
        this.setVisible(false);
        this.setActive(false);
    }

    hideAfterHit(): void{
        this.isHit = true;
        this.hide();
        this.resetSettings();
    }

    resetSettings(): void{
        this.setAngle(0);
        this.setAngularVelocity(0);
        this.setVelocity(0);
        this.isHit = false;
    }
}
import * as Phaser from 'phaser';
import { SceneKeys } from "../Config/SceneKeys";

import AlignTool from '../Util/AlignTool';

import {BUTTON_TYPE} from "../Enum/enum";

export default class PlayButton extends Phaser.GameObjects.Image{
    private buttonType: BUTTON_TYPE;
    private isEnabled: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, scalePercentage: number, depth: number, buttonType: BUTTON_TYPE){
        super(scene,x,y,"play");
        this.buttonType = buttonType;
        this.isEnabled = true;

        this.setSettings();
        this.setInteractive();
        this.setDepth(depth);
        AlignTool.scaleToScreenWidth(scene,this,scalePercentage)
        scene.add.existing(this);

        let me = this;
        this.on("pointerover",() => {
            me.setScale(me.scale+0.1);
        },this);

        this.on("pointerout",() => {
            me.setScale(me.scale-0.1);
        },this);
    }

    /**
     * Set settings for button
     */
    private setSettings(): void{
        switch (this.buttonType){
            case BUTTON_TYPE.Play:
                this.on("pointerdown", () => {
                    if(this.isEnabled){
                        this.scene.scene.stop(SceneKeys.Title);
                        this.scene.scene.start(SceneKeys.Level);
                    }
                },this);
                this.isEnabled = false;
                break;
            
            case BUTTON_TYPE.HowTo:
                this.on("pointerdown", () => {
                    if(this.isEnabled){
                        this.scene.scene.stop(SceneKeys.Title);
                        this.scene.scene.start(SceneKeys.HowTo);
                    }
                },this);
                this.isEnabled = false;
                break;
            
            case BUTTON_TYPE.BackFromGameOver:
                this.setFlipX(true);
                this.on("pointerdown", () => {
                    if(this.isEnabled){
                        this.scene.scene.stop(SceneKeys.Level);
                        this.scene.scene.start(SceneKeys.Title);
                    }
                },this);
                break;
            
            case BUTTON_TYPE.BackFromHowTo:
                this.setFlipX(true);
                this.on("pointerdown", () => {
                    if(this.isEnabled){
                        this.scene.scene.stop(SceneKeys.HowTo);
                        this.scene.scene.start(SceneKeys.Title);
                    }
                },this);
                break;

        }
    }

    /**
     * Enable/disable button for input
     * @param value: true to enable button, false otherwise
     */
    setEnabled(value: boolean){
        this.isEnabled = value;
    }
}
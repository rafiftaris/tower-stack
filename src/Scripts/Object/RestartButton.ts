import * as Phaser from 'phaser';
import AlignTool from '../Util/AlignTool';

export default class RestartButton extends Phaser.GameObjects.Image{
    constructor(scene: Phaser.Scene, x: number, y: number, scalePercentage: number, depth: number){
        super(scene,x,y,"restart");
        this.setInteractive();
        this.setDepth(depth);
        AlignTool.scaleToScreenWidth(scene,this,scalePercentage)
        scene.add.existing(this);

        let me = this;
        this.on("pointerdown", () => {
            scene.scene.start("LevelScene");
        },this);

        this.on("pointerover",() => {
            me.setScale(this.scale+0.1);
        },this);

        this.on("pointerout",() => {
            me.setScale(this.scale-0.1);
        },this);
    }
}
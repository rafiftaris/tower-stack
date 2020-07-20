import * as Phaser from 'phaser';

export default class BackButton extends Phaser.GameObjects.Image{
    constructor(scene: Phaser.Scene, x: number, y: number, scale: number, depth: number){
        super(scene,x,y,"play");
        this.setInteractive();
        this.setDepth(depth);
        this.setScale(scale);
        this.setFlipX(true);
        scene.add.existing(this);

        let me = this;
        this.on("pointerdown", () => {
            scene.scene.start("LevelScene");
        },this);
        this.on("pointerover",() => {
            me.setScale(me.scale+0.1);
        },this);

        this.on("pointerout",() => {
            me.setScale(me.scale-0.1);
        },this);
    }
}
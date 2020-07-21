import * as Phaser from 'phaser';

export default class RestartButton extends Phaser.GameObjects.Image{
    constructor(scene: Phaser.Scene, x: number, y: number, scale: number, depth: number){
        super(scene,x,y,"restart");
        this.setInteractive();
        this.setDepth(depth);
        this.setScale(scale);
        scene.add.existing(this);

        let me = this;
        this.on("pointerdown", () => {
            scene.scene.start("LevelScene");
        },this);

        this.on("pointerover",() => {
            me.setScale(0.6);
        },this);

        this.on("pointerout",() => {
            me.setScale(0.5);
        },this);
    }
}
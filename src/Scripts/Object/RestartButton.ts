import * as Phaser from 'phaser';

export default class RestartButton extends Phaser.GameObjects.Image{
    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene,x,y,"restart");

        this.on("pointerdown", () => {
            console.log('restart');
            this.emit("restartGame");
        },this);

        this.on("pointerover",() => {
            this.setScale(this.scale+0.5);
        },this);

        this.on("pointerout",() => {
            this.setScale(this.scale-0.5);
        },this);
    }
}
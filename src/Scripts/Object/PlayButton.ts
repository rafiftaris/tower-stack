import * as Phaser from 'phaser';

export default class PlayButton extends Phaser.GameObjects.Image{
    constructor(scene: Phaser.Scene, x: number, y: number, scale: number, depth: number){
        super(scene,x,y,"play");
        this.setInteractive();
        this.setDepth(depth);
        this.setScale(scale);
        scene.add.existing(this);

        let me = this;
        this.on("pointerover",() => {
            me.setScale(me.scale+0.1);
        },this);

        this.on("pointerout",() => {
            me.setScale(me.scale-0.1);
        },this);
    }

    setBackButton(scene: Phaser.Scene): void{
        this.setFlipX(true);
        this.on("pointerdown", () => {
            scene.scene.start("TitleScene");
        },this);
    }

    setPlayButton(scene: Phaser.Scene): void{
        this.on("pointerdown", () => {
            scene.scene.start("LevelScene");
        },this);
    }
}
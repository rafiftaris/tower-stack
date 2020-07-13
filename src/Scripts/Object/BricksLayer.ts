import * as Phaser from "phaser"; 

const PADDING_TOP = 20;
const SCALE = 5;
const STEP = 16*SCALE;
const LENGTH = 7;

export default class BricksLayer{
    private bricks: Phaser.Physics.Arcade.Sprite[];

    constructor(scene: Phaser.Scene){
        this.bricks = [];
        for(var i=0; i<LENGTH; i++){
            let frame = 18;
            if(i==0){
                frame = 17;
            } else if (i==LENGTH-1){
                frame = 19;
            }
            let brick = new Phaser.Physics.Arcade.Sprite(scene,STEP/2+STEP*i,STEP/2+PADDING_TOP,'spritesheet',frame);
            this.setDefaultSettings(brick);
            scene.add.existing(brick);
            scene.physics.add.existing(brick);
            this.bricks.push(brick);
        }
    }

    setDefaultSettings(brick: Phaser.Physics.Arcade.Sprite): void{
        brick.setScale(SCALE);
    }
}
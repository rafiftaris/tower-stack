import * as Phaser from "phaser"; 

const PADDING_LEFT = 125;
const SCALE = 5;
const STEP = 16*SCALE;
const LENGTH = 7;
const DEPTH = 3;

export default class Ground{
    private groundTiles: Phaser.Physics.Arcade.Sprite[][];

    constructor(scene: Phaser.Scene){
        this.groundTiles = [];

        for(var level=0; level<DEPTH; level++){
            this.groundTiles.push([]);
            for(var i=0; i<LENGTH; i++){
                let frame = 1;
                if(level==0){
                    if(i==0){
                        frame = 0;
                    } else if (i==LENGTH-1){
                        frame = 2;
                    }
                } else if (level==DEPTH-1){
                    if(i==0){
                        frame = 14;
                    } else if (i==6){
                        frame = 16;
                    } else {
                        frame = 15;
                    }
                } else {
                    if(i==0){
                        frame = 7;
                    } else if (i==6){
                        frame = 9;
                    } else {
                        frame = 8;
                    }
                }

                let groundTile = new Phaser.Physics.Arcade.Sprite(scene, PADDING_LEFT+STEP*i, 1200-STEP*(DEPTH-1)+(STEP*level), 'groundsheet',frame);
                this.setDefaultSettings(groundTile);
                scene.add.existing(groundTile);
                scene.physics.add.existing(groundTile);
                groundTile.setImmovable(true);
                this.groundTiles[level].push(groundTile);
            }
        }
    }

    setDefaultSettings(groundTile: Phaser.Physics.Arcade.Sprite): void{
        groundTile.setScale(SCALE);
    }

    getGroundSurface(): Phaser.Physics.Arcade.Sprite[]{
        return this.groundTiles[0];
    }

    pushDown(): void{
        this.groundTiles.forEach(layer => {
            layer.forEach(element => {
                element.setY(element.y+STEP*2);
            });
        });
    }

    hide(): void{
        this.groundTiles.forEach(layer => {
            layer.forEach(element => {
                element.setVisible(false);
                element.setActive(false);
            });
        });
    }
}
import * as Phaser from "phaser"; 
import AlignTool from "../Util/AlignTool";
import { getResolution } from "../Util/Util";

const PADDING_LEFT = 125;
const PADDING_TOP = 1100;
const SCALE = 5;
const SIZE = 16*SCALE;
const LENGTH = 7;
const DEPTH = 3;

export default class Ground{
    private scene: Phaser.Scene;
    //TODO: Jadiin container
    private groundContainer: Phaser.GameObjects.Container;
    private groundTiles: Phaser.Physics.Matter.Sprite[];

    constructor(scene: Phaser.Scene){
        this.groundTiles = [];
        this.scene = scene;

        for(var level=0; level<DEPTH; level++){
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
                    } else if (i==LENGTH-1){
                        frame = 16;
                    } else {
                        frame = 15;
                    }
                } else {
                    if(i==0){
                        frame = 7;
                    } else if (i==LENGTH-1){
                        frame = 9;
                    } else {
                        frame = 8;
                    }
                }

                let groundTile = scene.matter.add.sprite(PADDING_LEFT+SIZE*i, PADDING_TOP+(SIZE*level), 'groundsheet',frame);
                this.setDefaultSettings(groundTile);
                this.groundTiles.push(groundTile);
            }
        }
        this.groundContainer = new Phaser.GameObjects.Container(scene,0,0,this.groundTiles);
        scene.add.existing(this.groundContainer);
    }

    setDefaultSettings(groundTile: Phaser.Physics.Matter.Sprite): void{
        AlignTool.scaleToScreenHeight(this.scene,groundTile,SIZE/1200);
        groundTile.setStatic(true);
    }

    getGround(): Phaser.GameObjects.Container{
        return this.groundContainer;
    }

    pushDown(): void{
        this.groundContainer.setY(this.groundContainer.y+SIZE*2-32);
    }

    hide(): void{
        this.groundContainer.setVisible(false);
        this.groundContainer.setActive(false);
    }
}
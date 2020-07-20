import * as Phaser from "phaser"; 
import AlignTool from "../Util/AlignTool";
import { getResolution } from "../Util/Util";

export default class Ground{
    readonly PADDING_LEFT = 125;
    readonly PADDING_TOP = 1100;
    readonly SCALE = 5;
    readonly SIZE = 16*this.SCALE;
    readonly LENGTH = 7;
    readonly DEPTH = 3;
    
    private scene: Phaser.Scene;
    //TODO: Jadiin container
    private groundContainer: Phaser.GameObjects.Container;
    private groundTiles: Phaser.Physics.Matter.Sprite[];

    constructor(scene: Phaser.Scene){
        this.groundTiles = [];
        this.scene = scene;

        for(var level=0; level<this.DEPTH; level++){
            for(var i=0; i<this.LENGTH; i++){
                let frame = 1;
                if(level==0){
                    if(i==0){
                        frame = 0;
                    } else if (i==this.LENGTH-1){
                        frame = 2;
                    }
                } else if (level==this.DEPTH-1){
                    if(i==0){
                        frame = 14;
                    } else if (i==this.LENGTH-1){
                        frame = 16;
                    } else {
                        frame = 15;
                    }
                } else {
                    if(i==0){
                        frame = 7;
                    } else if (i==this.LENGTH-1){
                        frame = 9;
                    } else {
                        frame = 8;
                    }
                }

                let groundTile = scene.matter.add.sprite(this.PADDING_LEFT+this.SIZE*i, this.PADDING_TOP+(this.SIZE*level), 'groundsheet',frame);
                this.setDefaultSettings(groundTile);
                this.groundTiles.push(groundTile);
            }
        }
        this.groundContainer = new Phaser.GameObjects.Container(scene,0,0,this.groundTiles);
        scene.add.existing(this.groundContainer);
    }

    setDefaultSettings(groundTile: Phaser.Physics.Matter.Sprite): void{
        AlignTool.scaleToScreenHeight(this.scene,groundTile,this.SIZE/1200);
        groundTile.setStatic(true);
    }

    getGroundBlock(): Phaser.Physics.Matter.Sprite{
        return this.groundTiles[0];
    }

    pushDown(): void{
        this.groundContainer.setY(this.groundContainer.y+this.SIZE*2-32);
    }

    hide(): void{
        this.groundContainer.setVisible(false);
        this.groundContainer.setActive(false);
    }
}
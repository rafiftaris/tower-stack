import * as Phaser from "phaser"; 
import AlignTool from "../Util/AlignTool";
import { getResolution } from "../Util/Util";

const PADDING_LEFT = 200;
const SCALE = 5;
const SIZE = 16*SCALE;
const LENGTH = 5;
const DEPTH = 3;

export default class Ground{
    private scene: Phaser.Scene;
    //TODO: Jadiin container
    private groundContainer: Phaser.GameObjects.Container;
    private groundTiles: Phaser.Physics.Arcade.Sprite[];

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

                let groundTile = new Phaser.Physics.Arcade.Sprite(scene, SIZE*i, (SIZE*level), 'groundsheet',frame);
                this.setDefaultSettings(groundTile);
                this.groundTiles.push(groundTile);
            }
        }
        this.groundContainer = new Phaser.GameObjects.Container(scene,0,0,this.groundTiles);
        this.groundContainer.setSize(SIZE*LENGTH,SIZE*DEPTH);
        AlignTool.alignX(scene,this.groundContainer,0.3);
        AlignTool.alignY(scene,this.groundContainer,0.9);
        scene.add.existing(this.groundContainer);
        scene.physics.add.existing(this.groundContainer);
        let body = <Phaser.Physics.Arcade.Body>this.groundContainer.body;
        body.setImmovable(true);
        body.setOffset(SIZE*(LENGTH-1)/2,SIZE);
    }

    setDefaultSettings(groundTile: Phaser.Physics.Arcade.Sprite): void{
        AlignTool.scaleToScreenHeight(this.scene,groundTile,SIZE/1200);
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
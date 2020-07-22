import * as Phaser from "phaser"; 
import AlignTool from "../Util/AlignTool";

export default class Ground{
    readonly PADDING_LEFT = 125;
    readonly PADDING_TOP = 1100;
    readonly SCALE = 5;
    readonly SIZE = 16*this.SCALE;
    readonly LENGTH = 7;
    readonly DEPTH = 3;
    
    private scene: Phaser.Scene;
    private groundTiles: Phaser.Physics.Matter.Sprite[];

    constructor(scene: Phaser.Scene, bitfield: number){
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

                let groundTile = scene.matter.add.sprite(0, 0, 'groundsheet',frame);
                let x = AlignTool.getXfromScreenWidth(
                    scene,
                    (this.PADDING_LEFT+this.SIZE*i)/720
                );
                let y = AlignTool.getYfromScreenHeight(
                    scene, 
                    (this.PADDING_TOP+(this.SIZE*level))/1200
                );
                this.setDefaultSettings(x, y, groundTile, bitfield);
                this.groundTiles.push(groundTile);
            }
        }
    }

    /**
     * Set default settings of a ground tile.
     * @param groundTile: ground tile
     * @param bitfield: collision bitfield
     */
    private setDefaultSettings(x: number, y: number, groundTile: Phaser.Physics.Matter.Sprite, bitfield: number): void{
        AlignTool.scaleToScreenHeight(this.scene,groundTile,this.SIZE/1200);
        groundTile.setPosition(x,y);
        groundTile.setStatic(true);
        groundTile.setCollisionCategory(bitfield)
    }

    /**
     * Get one of the ground block.
     */
    getGroundBlock(): Phaser.Physics.Matter.Sprite{
        return this.groundTiles[0];
    }
}
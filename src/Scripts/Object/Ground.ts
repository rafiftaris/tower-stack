import * as Phaser from "phaser"; 
import AlignTool from "../Util/AlignTool";

export default class Ground{
    readonly PADDING_LEFT = 160;
    readonly PADDING_TOP = 1100;
    readonly SCALE = 5;
    readonly LENGTH = 3;
    readonly DEPTH = 3;
    
    private scene: Phaser.Scene;
    private groundTiles: Phaser.Physics.Matter.Image[];

    constructor(scene: Phaser.Scene, bitfield: number){
        this.groundTiles = [];
        this.scene = scene;

        for(var i=0; i<this.LENGTH; i++){
            let image: string;
            let margin: number;

            if(i==0){
                image = "grass-left"
                margin = 0;
            } else if (i == this.LENGTH-1){
                image = "grass-right";
                margin = this.groundTiles[i-1].displayWidth;
            } else {
                image = "grass-mid";
                margin = this.groundTiles[i-1].displayWidth;
            }

            let groundTile = scene.matter.add.image(0, 0, image);
            this.setDefaultSettings(i, groundTile, bitfield);
            this.groundTiles.push(groundTile);
        }
    }
    
    /**
     * Set default settings of a ground tile.
     * @param groundTile: ground tile
     * @param bitfield: collision bitfield
     */
    private setDefaultSettings(index: number, groundTile: Phaser.Physics.Matter.Image, bitfield: number): void{
        AlignTool.scaleToScreenWidth(this.scene,groundTile,0.25);

        const x = AlignTool.getXfromScreenWidth(this.scene,0.25) + groundTile.displayWidth*index;
        const y = AlignTool.getYfromScreenHeight(
            this.scene, 
            0.95
        );
        groundTile.setPosition(x,y);

        groundTile.setStatic(true);
        groundTile.setCollisionCategory(bitfield)
    }

    /**
     * Get one of the ground block.
     */
    getGroundBlock(): Phaser.Physics.Matter.Image{
        return this.groundTiles[0];
    }
}
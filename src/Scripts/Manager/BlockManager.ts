import * as Phaser from "phaser"; 
import BuildingBlock from "../Object/Block";
import AnimationHelper from "../Util/AnimationHelper";
import { getResolution } from "../Util/Util";

const STARTING_Y = 976;
const SCALE = 4;
const STEP = 32*SCALE;

export default class BlockManager{
    private scene: Phaser.Scene;
    private stackedBlocks: BuildingBlock[];
    private blocksGroup: Phaser.GameObjects.Group;
    private movingBlock: BuildingBlock;

    constructor(scene: Phaser.Scene){
        this.stackedBlocks = [];
        this.scene = scene;

        // Init blocks group
        this.blocksGroup = scene.add.group({
            classType: BuildingBlock,
            defaultKey: 'block',
            maxSize: 30,
        });
        this.movingBlock = this.getBlockFromGroup();
        this.movingBlock.setMovingBlockSettings();
    }
    
    /**
     * Get building block from block group
     * @returns: building block
     */
    private getBlockFromGroup(): BuildingBlock{
        let block: BuildingBlock = this.blocksGroup.get();
        
        if(block){
            block.setActive(true);
            block.setVisible(true);
            block.setDefaultSettings();
            
            return block;
        }
        return null;
    }
    
    public dropBlock(): void{
        let position: Phaser.Math.Vector2 = this.movingBlock.hide();

        // Reset dropping block
        const blockBody = this.getBlockFromGroup();
        blockBody.setDroppingBlockSettings(position, this.movingBlock.getTextureFrame());
        this.stackedBlocks.push(blockBody);
    }

    setGameOver(): void{
        this.movingBlock.hide();

        // Calculate Score
        this.stackedBlocks.forEach((block,index) => {
            
        });
    }

    checkFallingBlocks(): void{
        this.stackedBlocks.forEach((block,index) => {
            if(block.y>=getResolution().height ||
            block.x<=0 ||
            block.x>=getResolution().width){
                block.setVisible(false);
                block.setActive(false);
                this.stackedBlocks.splice(index,1);
            }
        });
    }

    showMovingBlock(): void{
        this.movingBlock.show();
        this.movingBlock.changeTexture();
    }

    getDroppingBlock(): BuildingBlock{
        return this.movingBlock;
    }
}
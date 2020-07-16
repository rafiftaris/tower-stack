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
    private droppingBlock: BuildingBlock;

    constructor(scene: Phaser.Scene){
        this.stackedBlocks = [];
        this.scene = scene;

        // Init blocks group
        this.blocksGroup = scene.add.group({
            classType: BuildingBlock,
            defaultKey: 'block',
            maxSize: 30,
        });
        this.droppingBlock = this.blocksGroup.get();
        this.droppingBlock.setDroppingBlockSettings();
    }

    public dropBlock(): void{
        this.droppingBlock.drop();

        // Reset dropping block
        const blockBody = this.droppingBlock;
        this.stackedBlocks.push(blockBody);

        this.droppingBlock = null;

        this.scene.time.addEvent({
            delay: 1000,
            callback: this.createDroppingBlock,
            callbackScope: this
        })
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

    setGameOver(): void{
        AnimationHelper.EaseOutAndFade(this.scene,this.droppingBlock,0.25);
        //TODO: game over popup
        console.log('game over');
    }

    checkFallingBlocks(): void{
        this.stackedBlocks.forEach((block,index) => {
            if(block.y>=getResolution().height ||
            block.x<=0 ||
            block.x>=getResolution().width){
                block.setVisible(false);
                block.resetSettings();
                block.setActive(false);
                this.stackedBlocks.splice(index,1);
            }
        });
    }

    createDroppingBlock(): void{
        if(this.droppingBlock){ return; }
        this.droppingBlock = this.getBlockFromGroup();
        this.droppingBlock.setDroppingBlockSettings();
    }

    getDroppingBlock(): BuildingBlock{
        return this.droppingBlock;
    }
}
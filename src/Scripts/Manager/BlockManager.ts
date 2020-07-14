import * as Phaser from "phaser"; 
import BuildingBlock from "../Object/Block";

const STARTING_Y = 920;
const SCALE = 5;
const STEP = 32*SCALE;

export default class BlockManager{
    private stackedBlocks: BuildingBlock[];
    private blocksGroup: Phaser.Physics.Arcade.Group;
    private droppingBlock: BuildingBlock;

    constructor(scene: Phaser.Scene){
        this.stackedBlocks = [];
        // Init blocks group
        this.blocksGroup = new Phaser.Physics.Arcade.Group(scene.physics.world,scene,{
            classType: BuildingBlock,
            defaultKey: 'block',
            maxSize: 10,
            active: false,
            visible: false,
        });
        this.blocksGroup.createMultiple({
            active: false,
            visible: false,
            quantity: 10,
            key: 'marble',
            repeat: this.blocksGroup.maxSize-1
        });
        this.droppingBlock = new BuildingBlock(scene);
        this.droppingBlock.setDroppingBlockSettings();
    }

    public dropBlock(): void{
        this.droppingBlock.drop();
    }

    public stackBlock(): void{
        let block: BuildingBlock = this.getBlockFromGroup();
        block.setPosition(this.droppingBlock.x,STARTING_Y-STEP*this.stackedBlocks.length);
        block.setImmovable(true);
        block.setBlockTexture(this.droppingBlock.getTextureFrame());
        this.stackedBlocks.push(block);

        // Reset dropping block
        this.droppingBlock.setDroppingBlockSettings();
    }

    /**
     * Get building block from block group
     * @returns: building block
     */
    public getBlockFromGroup(): BuildingBlock{
        let block: BuildingBlock = this.blocksGroup.get();
      
        if(block){
            block.setActive(true);
            block.setVisible(true);
            block.setDefaultSettings();

            return block;
        }
        return null;
    }

    public getDroppingBlock(): BuildingBlock{
        return this.droppingBlock;
    }

    public getBlocksGroup(): Phaser.Physics.Arcade.Group{
        return this.blocksGroup;
    }
}
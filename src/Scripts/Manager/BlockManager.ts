import * as Phaser from "phaser"; 
import BuildingBlock from "../Object/Block";

const STARTING_Y = 920;
const SCALE = 5;
const STEP = 32*SCALE;

export default class BlockManager{
    private stackedBlocks: BuildingBlock[];
    private blocksGroup: Phaser.Physics.Arcade.Group;
    private droppingBlock: BuildingBlock;
    private currentY: number;
    private minY: number;

    constructor(scene: Phaser.Scene){
        this.stackedBlocks = [];
        this.currentY = STARTING_Y;
        this.minY = STARTING_Y-STEP*2;
        console.log(this.minY);
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
        this.currentY = STARTING_Y-STEP*this.stackedBlocks.length;
        if(this.currentY < this.minY){
            this.currentY = this.minY;
        }

        console.log(this.droppingBlock.y,this.currentY)
        if(this.droppingBlock.y > this.currentY){
            console.log('game over');
            return;
        }

        let block: BuildingBlock = this.getBlockFromGroup();
        let latestBlock = this.stackedBlocks[this.stackedBlocks.length-1];
        let newPosition = STARTING_Y;
        if(latestBlock){
            newPosition = latestBlock.y-STEP
        }
        block.setPosition(this.droppingBlock.x,newPosition);
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

    public getStackedBlocks(): BuildingBlock[]{
        return this.stackedBlocks;
    }

    pushDown(): void{
        this.stackedBlocks.forEach(block => {
            block.setY(block.y+STEP);
        });
    }

    checkBottomStack(): void{
        if(this.stackedBlocks[0].y > 1500){
            let outBlock = this.stackedBlocks.shift();
            outBlock.setActive(false);
            outBlock.setVisible(false);
        }
    }
}
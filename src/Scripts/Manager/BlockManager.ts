import * as Phaser from "phaser"; 
import BuildingBlock from "../Object/Block";
import AnimationHelper from "../Util/AnimationHelper";
import { getResolution } from "../Util/Util";
import Ground from "../Object/Ground";
import { ANIMATION_TYPE, TextPopUp } from "../Util/TextPopUp";

const STARTING_Y = 976;
const SCALE = 4;
const STEP = 32*SCALE;

class BlockManagerHelper{
    private static instance: BlockManagerHelper;

    private scene!: Phaser.Scene;
    private stackedBlocks!: BuildingBlock[];
    private blocksGroup!: Phaser.GameObjects.Group;
    private movingBlock!: BuildingBlock;
    private currentDroppingBlock: BuildingBlock;

    private score: number = 0;

    public static get Instance() {
        const instance = this.instance || (this.instance = new this());
        return instance;
    }

    init(scene: Phaser.Scene) {
        this.scene = scene;
        this.stackedBlocks = [];
        this.scene = scene;
        this.score = 0;
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
    
    /**
     * Get current score
     * @returns: score
     */
    getScore(): number{
        return this.score;
    }

    /**
     * Get moving block
     * @returns: Building block
     */
    getMovingBlock(): BuildingBlock{
        return this.movingBlock;
    }

    /**
     * Get delay duration for game over panel popup
     * @returns: delay duration
     */
    getDelayDuration(): number{
        return (this.stackedBlocks.length+1) * 750;
    }

    /**
     * Prepare game over state by counting score on stacked blocks.
     * @param ground: In-game ground sprites
     */
    setGameOver(ground: Ground): void{
        this.movingBlock.hide();
        if(this.currentDroppingBlock){
            let me = this;
            this.scene.time.addEvent({
                delay: 1000,
                callback: () => {
                    if(me.currentDroppingBlock){
                        me.currentDroppingBlock.setIgnoreGravity(true);
                        me.currentDroppingBlock.setVisible(false);
                        me.currentDroppingBlock.setVelocityY(0);
                    }
                },
                callbackScope: this
            });
        }
        
        this.scene.time.addEvent({
            delay: 1000,
            callback: this.freezeStack,
            callbackScope: this,
        });

        // Calculate Score
        this.scene.time.addEvent({
            delay: 750,
            callback: this.countBlockScore,
            args: [ground],
            callbackScope: this,
            repeat: this.stackedBlocks.length
        });
    }

    /**
     * Drop block from moving block position
     */
    dropBlock(): void{
        let position: Phaser.Math.Vector2 = this.movingBlock.hide();

        // Reset dropping block
        const blockBody = this.getBlockFromGroup();
        blockBody.setDroppingBlockSettings(position, this.movingBlock.getTextureFrame());
        this.currentDroppingBlock = blockBody;
    }

    /**
     * Count score of each block and accumulate to final score
     * @param ground: In-game ground sprites
     */
    private countBlockScore(ground: Ground): void{
        if(this.stackedBlocks.length > 0){
            let block = this.stackedBlocks.shift();
            AnimationHelper.ChangeAlpha(this.scene, block, 0.5, 0);

            let blockY = ground.PADDING_TOP - (ground.getGroundBlock().displayHeight/2) - block.y;
            let maxHeight = Math.sqrt(2*((block.displayHeight/2)**2)); // When block is standing on one of its corner
            let currentBlockScore = Math.ceil((blockY-maxHeight)/block.displayHeight) + 1;
            let scoreText = TextPopUp.showText({
                x: block.x,
                y: block.y,
                text: currentBlockScore.toString(),
                duration: 1,
                style: {
                    fontSize: 96,
                    fontStyle: "Bold",
                    fontFamily: "Courier",
                    color: "black",
                    strokeThickness: 1
                },
                animType: ANIMATION_TYPE.EMBIGGEN,
                retain: true,
            })?.text as Phaser.GameObjects.Text;
            scoreText.setVisible(true);
            this.score += currentBlockScore;   
        }
    }

    /**
     * Check falling blocks every update. 
     * Remove block when its falling outside the ground.
     */
    checkFallingBlocks(): void{
        this.stackedBlocks.forEach((block,index) => {
            if(block.y>=getResolution().height ||
            block.x<=0 ||
            block.x>=getResolution().width){
                block.setVisible(false);
                block.setActive(false);

                this.stackedBlocks.splice(index,1);
                // console.log("fall",this.stackedBlocks.length);
            }
        });
    }

    /**
     * Show moving block after player drop a block.
     */
    showMovingBlock(): void{
        this.movingBlock.show();
        this.movingBlock.changeTexture();
    }

    /**
     * Add block to stacked blocks.
     * @param block: block that is going to be added
     */
    addBlockToStack(block: BuildingBlock): void{
        this.stackedBlocks.push(block);
        this.currentDroppingBlock = null;
    }

    /**
     * Freeze stack after game over.
     */
    freezeStack(): void{
        this.currentDroppingBlock?.setVisible(false);
        this.currentDroppingBlock?.setActive(false);
        this.stackedBlocks.forEach((block,index) => {
            // Freeze box when not falling, remove from stack otherwise
            let body = <MatterJS.BodyType>block.body
            if(body.velocity.y < 2){
                block.setStatic(true);
                block.setIgnoreGravity(true);
            } else {
                block.setVisible(false);
                block.setActive(false);
                this.stackedBlocks.splice(index,1);
            }
        });
    }
}

export const BlockManager = BlockManagerHelper.Instance;
import * as Phaser from "phaser"; 
import BuildingBlock from "../Object/Block";
import AnimationHelper from "../Util/AnimationHelper";
import { getResolution } from "../Util/Util";
import Ground from "../Object/Ground";
import { ANIMATION_TYPE, TextPopUp } from "../Util/TextPopUp";

const STARTING_Y = 976;
const SCALE = 4;
const STEP = 32*SCALE;

export default class BlockManager{
    private scene: Phaser.Scene;
    private stackedBlocks: BuildingBlock[];
    private blocksGroup: Phaser.GameObjects.Group;
    private movingBlock: BuildingBlock;
    private currentDroppingBlock: BuildingBlock;

    private score: number = 0;

    constructor(scene: Phaser.Scene){
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
    
    public dropBlock(): void{
        let position: Phaser.Math.Vector2 = this.movingBlock.hide();

        // Reset dropping block
        const blockBody = this.getBlockFromGroup();
        blockBody.setDroppingBlockSettings(position, this.movingBlock.getTextureFrame());
        this.currentDroppingBlock = blockBody;
        // this.stackedBlocks.push(blockBody);
    }

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
    
    getScore(): number{
        return this.score;
    }

    countBlockScore(ground: Ground): void{
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
                    fontSize: 24,
                    fontFamily: "Courier",
                    color: "white"
                  },
                animType: ANIMATION_TYPE.EASE_IN,
                retain: false,
            })?.text as Phaser.GameObjects.Text;
            scoreText.setVisible(true);
            this.score += currentBlockScore;   
        }
    }

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

    showMovingBlock(): void{
        this.movingBlock.show();
        this.movingBlock.changeTexture();
    }

    getMovingBlock(): BuildingBlock{
        return this.movingBlock;
    }

    getDelayDuration(): number{
        return (this.stackedBlocks.length+1) * 750;
    }

    addBlockToStack(block: BuildingBlock): void{
        this.stackedBlocks.push(block);
        this.currentDroppingBlock = null;
    }

    freezeStack(): void{
        this.stackedBlocks.forEach((block,index) => {
            // Freeze box when not falling, remove from stack otherwise
            if(block.body.velocity.y < 2){
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
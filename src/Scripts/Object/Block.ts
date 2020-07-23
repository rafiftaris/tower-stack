import * as Phaser from "phaser";
import AlignTool from "../Util/AlignTool";
import DepthConfig from "../Config/DepthConfig";

const CONFIG = {
    label: "Block",
    mass: 100,
    frictionAir: 0,
    friction: 0.99,
    frictionStatic: 10000,
};

export default class BuildingBlock extends Phaser.Physics.Matter.Sprite{
    private textureFrame: number;
    private tween: Phaser.Tweens.Tween;
    public hasCollided: boolean;

    constructor(scene: Phaser.Scene, bitfield: number){
        super(scene.matter.world,0,0,"blocksheet",0,CONFIG);
        this.textureFrame = 0;
        this.scene = scene;
        this.hasCollided = false;
        
        this.setDefaultSettings(bitfield);
    }
    
    /**
     * Set default settings of a block.
     * @param bitfield: collision bitfield
     * @param texture: texture index. If null, randomize index
     */
    setDefaultSettings(bitfield?: number, texture?: number): void{
        this.hasCollided = false;
        this.setActive(true);
        this.setVisible(true);
        this.setDepth(DepthConfig.block);
        this.setBounce(0);
        AlignTool.scaleToScreenHeight(this.scene,this,0.085);

        this.changeTexture(texture);

        if(bitfield){
            this.setCollisionCategory(bitfield);
        }
    }

    /**
     * Set moving block settings.
     * @param bitfield: collision bitfield
     */
    setMovingBlockSettings(bitfield: number): void{
        this.resetSettings();
        AlignTool.alignX(this.scene,this,0.1);
        AlignTool.alignY(this.scene,this,0.1);
        this.tween = this.scene.tweens.add({  
            targets: this,
            x: AlignTool.getXfromScreenWidth(this.scene,0.9),
            duration: 750,
            yoyo: true,
            repeat: -1
        });
        this.setIgnoreGravity(true);
        this.setCollisionCategory(null);
        this.setDefaultSettings();
    }

    /**
     * Set settings of dropping block based on moving block settings
     * @param position: current position of moving block
     * @param bitfield: collision bitfield
     * @param texture: current texture index of moving block
     */
    setDroppingBlockSettings(position: Phaser.Math.Vector2, bitfield: number, texture: number): void{
        this.resetSettings();
        this.setPosition(position.x, position.y);
        this.setVelocityY(AlignTool.getYfromScreenHeight(this.scene,0.01));
        this.setIgnoreGravity(false);
        this.setDefaultSettings(bitfield, texture);
    }

    /**
     * Reset settings of a block
     */
    private resetSettings(): void{
        this.setVelocityX(0);
        this.setVelocityY(0);
        this.setAngle(0);
        this.setAngularVelocity(0);
        this.hasCollided = false;
    }
    
    /**
     * Change texture of a block.
     * @param frame: frame index, randomize index if null
     */
    changeTexture(frame?: number): void{
        if(!frame){
            frame = Math.floor(Math.random()*96);
        }
        this.setTexture("blocksheet",frame);
        this.textureFrame = frame;
    }
    
    /**
     * Hide moving block
     */
    hide(): Phaser.Math.Vector2{
        this.tween.pause();
        this.setVisible(false);
        let position = new Phaser.Math.Vector2(this.x, this.y);
        return position;
    }

    /**
     * Show moving block
     */
    show(): void{
        this.tween.resume();
        this.setVisible(true);
    }

    /**
     * Get texture frame index of block.
     */
    getTextureFrame(): number{
        return this.textureFrame;
    }

    /**
     * Get tween of moving block.
     */
    getTween(): Phaser.Tweens.Tween{
        return this.tween;
    }
}
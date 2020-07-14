import * as Phaser from "phaser"; 

const SCALE = 5;

export default class BuildingBlock extends Phaser.Physics.Arcade.Sprite{
    private textureFrame: number;
    constructor(scene: Phaser.Scene){
        super(scene,0,0,"blocksheet",0);
        this.textureFrame = 0;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDefaultSettings();
        // this.drop();
    }
    
    setDefaultSettings(): void{
        this.setScale(SCALE);
        this.setBlockTexture();
    }

    setDroppingBlockSettings(): void{
        this.setBounceX(1);
        this.setPosition(100,128);
        this.setCollideWorldBounds(true);
        this.setVelocityX(800);
        this.setBlockTexture();
    }
    
    setBlockTexture(frame?: number): void{
        if(!frame){
            frame = Math.floor(Math.random()*96);
        }
        this.setTexture("blocksheet",frame);
        this.textureFrame = frame;
    }
    
    drop(): void{
        this.setVelocityX(0);
        this.setVelocityY(1000);
    }

    getTextureFrame(): number{
        return this.textureFrame;
    }
    
}
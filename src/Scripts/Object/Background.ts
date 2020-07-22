import * as Phaser from 'phaser';
import AlignTool from "../Util/AlignTool";
import DepthConfig from "../Config/DepthConfig";

export default class Background extends Phaser.GameObjects.TileSprite{
    constructor(scene: Phaser.Scene){
        super(
            scene,
            0,
            AlignTool.getYfromScreenHeight(scene,0.5),
            1920,
            860,
            "background"
        );

        let displayHeight = scene.cameras.main.height * 1;
        this.displayHeight = displayHeight;
        this.setScale(this.scaleY);
        this.setDepth(DepthConfig.background);
        scene.add.existing(this);
    }

    /**
     * Scroll background to give movement effects.
     */
    update(): void{
        this.tilePositionX += 0.5;
    }
}
import * as Phaser from 'phaser';
import AlignTool from "../Util/AlignTool";
import RestartButton from "../Object/RestartButton";
import { ANIMATION_TYPE, ImagePopUp } from '../Util/ImagePopUp';
import {
  ANIMATION_TYPE as TEXT_ANIMATION_TYPE,
  TextPopUp,
} from '../Util/TextPopUp';
import DepthConfig from '../Config/DepthConfig';

export default class GameOverPanel extends Phaser.GameObjects.Image{
    private text: Phaser.GameObjects.Text;
    private displayText: string;
    private restartButton: RestartButton;
    private backButton: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene){
        let centerX = AlignTool.getCenterHorizontal(scene);
        let centerY = AlignTool.getCenterVertical(scene);
        super(scene,centerX,centerY,"panel");
        
        this.displayText = "GAME OVER\n\nYour score: "
        this.text = new Phaser.GameObjects.Text(scene,centerX-this.width/3,centerY-this.height/2.2,this.displayText,{ color: 'white', fontSize: '42px', align: "center" });
        this.text.setDepth(11);
        scene.add.existing(this.text);

        this.restartButton = new RestartButton(scene,centerX+100,centerY+100);
        this.restartButton.setInteractive();
        this.restartButton.setDepth(11);
        this.restartButton.setScale(0.5);

        this.restartButton.on("pointerdown", () => {
            console.log('restart');
            this.scene.scene.start("LevelScene");
        },this);
        this.restartButton.on("pointerover",() => {
            this.restartButton.setScale(0.6);
        },this);

        this.restartButton.on("pointerout",() => {
            this.restartButton.setScale(0.5);
        },this);
        scene.add.existing(this.restartButton);

        this.backButton = new Phaser.GameObjects.Image(scene,centerX-100,centerY+100,"play");
        this.backButton.setInteractive();
        this.backButton.setDepth(11);
        this.backButton.setScale(0.5);
        this.backButton.setFlipX(true);
        scene.add.existing(this.backButton);

        this.backButton.on("pointerdown", () => {
            console.log('back');
            this.scene.scene.start("TitleScene");
        },this);

        this.backButton.on("pointerover",() => {
            this.backButton.setScale(0.6);
        },this);

        this.backButton.on("pointerout",() => {
            this.backButton.setScale(0.5);
        },this);

        this.setScale(1,1.2);
        this.setDepth(10);
        scene.add.existing(this);
        
        this.hide();
    }

    hide(): void{
        this.setVisible(false);
        this.restartButton.setVisible(false);
        this.backButton.setVisible(false);
        this.text.setVisible(false);
    }

    show(): void{
        this.setVisible(true);
        this.restartButton.setVisible(true);
        this.backButton.setVisible(true);
        this.text.setVisible(true);
    }
    
    showScore(score: number): void{
        console.log('showscore');
        this.show();
        this.displayText += score.toString();
        this.text.setText(this.displayText);
    }
}
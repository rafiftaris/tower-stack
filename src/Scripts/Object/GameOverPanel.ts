import * as Phaser from 'phaser';
import AlignTool from "../Util/AlignTool";
import RestartButton from "../Object/RestartButton";
import BackButton from "./PlayButton";
import DepthConfig from '../Config/DepthConfig';

export default class GameOverPanel extends Phaser.GameObjects.Image{
    private text: Phaser.GameObjects.Text;
    private displayText: string;
    private restartButton: RestartButton;
    private backButton: BackButton;

    constructor(scene: Phaser.Scene){
        let centerX = AlignTool.getCenterHorizontal(scene);
        let centerY = AlignTool.getCenterVertical(scene);
        super(scene,centerX,centerY,"panel");
        this.scene = scene;

        this.initDisplayText(centerX, centerY);
        this.restartButton = new RestartButton(this.scene,centerX+100,centerY+100,0.5,DepthConfig.gameOverContent);
        this.backButton = new BackButton(this.scene,centerX-100,centerY+100,0.5,DepthConfig.gameOverContent);
        this.backButton.setBackButton(scene);

        this.setScale(1,1.2);
        this.setDepth(DepthConfig.gameOverPanel);
        scene.add.existing(this);
        
        this.hide();
    }

    /**
     * Initialize display text of game over panel.
     * @param centerX: Horizontal center
     * @param centerY: Vertical center
     */
    private initDisplayText(centerX: number, centerY: number): void{
        this.displayText = "GAME OVER\n\nYour score: "
        this.text = new Phaser.GameObjects.Text(
            this.scene,
            centerX-this.width/3,
            centerY-this.height/2.2,
            this.displayText,
            { color: 'white', fontSize: '42px', align: "center" });
        this.text.setDepth(11);
        this.scene.add.existing(this.text);
    }

    /**
     * Hide game over panel.
     */
    private hide(): void{
        this.setVisible(false);
        this.restartButton.setVisible(false);
        this.backButton.setVisible(false);
        this.text.setVisible(false);
    }

    /**
     * Show game over panel
     */
    private show(): void{
        this.setVisible(true);
        this.restartButton.setVisible(true);
        this.backButton.setVisible(true);
        this.text.setVisible(true);
    }
    
    /**
     * Show final score
     * @param score: final score
     */
    showScore(score: number): void{
        this.show();
        this.displayText += score.toString();
        this.text.setText(this.displayText);
    }
}
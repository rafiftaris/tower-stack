import * as Phaser from 'phaser';
import AlignTool from '../Util/AlignTool';
import Button from './Button';
import DepthConfig from '../Config/DepthConfig';
import { ANIMATION_TYPE, TextPopUp } from '../Util/TextPopUp';
import SoundConfig from '../Config/SoundConfig';
import { BUTTON_TYPE } from '../Enum/enum';
import { IGameOverPanel } from '../Interfaces/interface';

export default class GameOverPanel
extends Phaser.GameObjects.Image 
implements IGameOverPanel{
    
  private text: Phaser.GameObjects.Text;
  private displayText: string;
  private restartButton: Button;
  private backButton: Button;

  constructor(scene: Phaser.Scene) {
    const centerX = AlignTool.getCenterHorizontal(scene);
    const centerY = AlignTool.getCenterVertical(scene);
    super(scene, centerX, centerY, 'panel');
    this.scene = scene;

    this.displayText = '\t\t\t\tGAME OVER\n\nYour score: ';
    this.restartButton = new Button(
      this.scene,
      AlignTool.getXfromScreenWidth(scene, 0.65),
      AlignTool.getYfromScreenHeight(scene, 0.6),
      0.2,
      DepthConfig.gameOverContent,
      BUTTON_TYPE.Restart
    );
    this.backButton = new Button(
      this.scene,
      AlignTool.getXfromScreenWidth(scene, 0.35),
      AlignTool.getYfromScreenHeight(scene, 0.6),
      0.2,
      DepthConfig.gameOverContent,
      BUTTON_TYPE.BackFromGameOver
    );

    AlignTool.scaleToScreenHeight(scene, this, 0.4);
    this.setDepth(DepthConfig.gameOverPanel);
    scene.add.existing(this);

    this.hide();
  }

  /**
   * Hide game over panel.
   */
  private hide(): void {
    this.setVisible(false);
    this.restartButton.setVisible(false);
    this.backButton.setVisible(false);
  }

  /**
   * Show game over panel
   */
  private show(): void {
    this.setVisible(true);
    this.restartButton.setVisible(true);
    this.backButton.setVisible(true);
  }

  /**
   * Show final score
   * @param score: final score
   */
  showScore(score: number): void {
    this.show();
    this.displayText += score.toString();
    this.text = TextPopUp.showText({
      x: AlignTool.getXfromScreenWidth(this.scene, 0.5),
      y: AlignTool.getYfromScreenHeight(this.scene, 0.42),
      text: this.displayText,
      duration: 0.5,
      style: {
        fontSize: 64,
        fontFamily: 'TrulyMadly',
        color: 'white',
        strokeThickness: 1
      },
      animType: ANIMATION_TYPE.EMBIGGEN,
      retain: true
    })?.text as Phaser.GameObjects.Text;
    this.scene.sound.play('gameover', { volume: SoundConfig.sfxVolume });
    this.text.setDepth(11);
  }
}

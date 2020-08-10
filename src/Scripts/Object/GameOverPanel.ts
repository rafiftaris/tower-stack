import * as Phaser from 'phaser';
import AlignTool from '../Util/AlignTool';
import Button from './Button';
import DepthConfig from '../Config/DepthConfig';
import { ANIMATION_TYPE, TextPopUp } from '../Util/TextPopUp';
import SoundConfig from '../Config/SoundConfig';
import { ButtonType, TextureKeys, FontKeys, AudioKeys } from '../Enum/enum';
import { IGameOverPanel } from '../Interfaces/interface';

export default class GameOverPanel extends Phaser.GameObjects.Image
  implements IGameOverPanel {
  private text: Phaser.GameObjects.Text;
  private displayText: string;
  private restartButton: Button;
  private backButton: Button;

  constructor(scene: Phaser.Scene) {
    const centerX = AlignTool.getCenterHorizontal(scene);
    const centerY = AlignTool.getCenterVertical(scene);
    super(scene, centerX, centerY, TextureKeys.Panel);
    this.scene = scene;

    this.displayText = '\t\t\tGAME OVER\nYour score: ';
    this.restartButton = new Button(
      this.scene,
      AlignTool.getXfromScreenWidth(scene, 0.65),
      AlignTool.getYfromScreenHeight(scene, 0.6),
      0.2,
      DepthConfig.gameOverContent,
      ButtonType.Restart
    );
    this.backButton = new Button(
      this.scene,
      AlignTool.getXfromScreenWidth(scene, 0.35),
      AlignTool.getYfromScreenHeight(scene, 0.6),
      0.2,
      DepthConfig.gameOverContent,
      ButtonType.BackFromGameOver
    );

    AlignTool.scaleToScreenWidth(scene, this, 0.9);
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
  showScore(score: number, newHighScore: boolean): void {
    this.show();
    this.displayText += score.toString();

    this.text = TextPopUp.showText({
      x: AlignTool.getXfromScreenWidth(this.scene, 0.5),
      y: AlignTool.getYfromScreenHeight(this.scene, 0.42),
      text: this.displayText,
      duration: 0.5,
      style: {
        fontSize: 64,
        fontFamily: FontKeys.TrulyMadly,
        color: 'white',
        strokeThickness: 1
      },
      animType: ANIMATION_TYPE.EMBIGGEN,
      retain: true
    })?.text as Phaser.GameObjects.Text;

    const highScoreText = TextPopUp.showText({
      x: AlignTool.getXfromScreenWidth(this.scene, 0.5),
      y: AlignTool.getYfromScreenHeight(this.scene, 0.5),
      text: 'New High Score!',
      duration: 0.01,
      style: {
        fontSize: 32,
        fontFamily: FontKeys.TrulyMadly,
        color: 'white',
        strokeThickness: 1
      },
      animType: ANIMATION_TYPE.EMBIGGEN,
      retain: true
    })?.text as Phaser.GameObjects.Text;
    highScoreText.setVisible(false);

    if (newHighScore) {
      this.scene.time.addEvent({
        delay: 500,
        callback: () => {
          highScoreText.setVisible(!highScoreText.visible);
        },
        callbackScope: this,
        repeat: -1
      });
    }

    this.scene.sound.play(AudioKeys.GameOver, {
      volume: SoundConfig.sfxVolume
    });
    this.text.setDepth(DepthConfig.gameOverContent);
    highScoreText.setDepth(DepthConfig.gameOverContent);
  }
}

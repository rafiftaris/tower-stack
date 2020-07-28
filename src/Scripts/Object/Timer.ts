import * as Phaser from 'phaser';
import AlignTool from '../Util/AlignTool';
import { TIME_LIMIT } from '../Config/GameConfig';
import { ANIMATION_TYPE, TextPopUp } from '../Util/TextPopUp';

export default class Timer {
  private displayText: Phaser.GameObjects.Text;
  private countdown: number;
  private timerEvent: Phaser.Time.TimerEvent;
  private scene: Phaser.Scene;
  private cooldown: Phaser.Time.TimerEvent;
  private onCooldown: boolean;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.displayText = TextPopUp.showText({
      x: AlignTool.getXfromScreenWidth(this.scene, 0.9),
      y: AlignTool.getYfromScreenHeight(this.scene, 0.01),
      text: '',
      duration: 0.01,
      style: {
        fontSize: 48,
        fontFamily: 'Courier',
        color: 'black',
        strokeThickness: 1
      },
      animType: ANIMATION_TYPE.EMBIGGEN,
      retain: true
    })?.text as Phaser.GameObjects.Text;
    this.displayText.setOrigin(0);
    this.displayText.setDepth(10);
    this.countdown = TIME_LIMIT;
    this.onCooldown = false;

    this.displayText.setText(this.countdown.toString());
  }

  /**
   * Create timer event
   */
  createTimerEvent(): void {
    if (!this.timerEvent) {
      this.timerEvent = this.scene.time.addEvent({
        delay: 1000,
        callback: this.tick,
        callbackScope: this,
        loop: true
      });
    }
  }

  /**
   * Call this function every second to decrease countdown
   */
  tick(): void {
    this.countdown--;
    this.displayText.setText(this.countdown.toString());
  }

  /**
   * Check times up status
   * @returns: true if countdown ends, false otherwise
   */
  timesUp(): boolean {
    return this.countdown == 0;
  }

  /**
   * Pause the countdown
   */
  destroyTimeEvent(): void {
    this.timerEvent.paused = true;
  }

  /**
   * Add time after block hit hourglass item and create text pop-up
   * @param x: Item position on x axis
   * @param y: Item position on y axis
   */
  increase(x: number, y: number): void {
    if (this.onCooldown) {
      return;
    }
    this.countdown += 3;
    this.displayText.setText(this.countdown.toString());

    TextPopUp.showText({
      x: x,
      y: y,
      text: '+3',
      duration: 1,
      style: {
        fontSize: 48,
        fontStyle: 'Bold',
        fontFamily: 'Courier',
        color: 'green',
        strokeThickness: 1
      },
      animType: ANIMATION_TYPE.EASE_IN,
      retain: false
    })?.text as Phaser.GameObjects.Text;

    this.scene.sound.play('bling');

    this.addCooldown();
  }

  /**
   * Decrease time after block hit bird item and create text pop-up
   * @param x: Item position on x axis
   * @param y: Item position on y axis
   */
  decrease(x: number, y: number): void {
    if (this.onCooldown) {
      return;
    }

    this.countdown -= 3;
    if (this.countdown < 0) {
      this.countdown = 0;
    }

    this.displayText.setText(this.countdown.toString());

    TextPopUp.showText({
      x: x,
      y: y,
      text: '-3',
      duration: 1,
      style: {
        fontSize: 48,
        fontStyle: 'Bold',
        fontFamily: 'Courier',
        color: 'red',
        strokeThickness: 1
      },
      animType: ANIMATION_TYPE.EASE_IN,
      retain: false
    })?.text as Phaser.GameObjects.Text;

    this.scene.sound.play('bam');

    this.addCooldown();
  }

  /**
   * Add cooldown after block hit item so the time
   * wont increase/decrease more than once in a split second.
   */
  private addCooldown(): void {
    this.onCooldown = true;
    if (!this.cooldown) {
      this.cooldown = this.scene.time.addEvent({
        delay: 2000,
        callback: () => {
          this.onCooldown = false;
          this.cooldown = null;
        },
        callbackScope: this
      });
    }
  }
}

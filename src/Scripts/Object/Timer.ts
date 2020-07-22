import * as Phaser from 'phaser';
import AlignTool from '../Util/AlignTool';
import { ANIMATION_TYPE, TextPopUp } from "../Util/TextPopUp";

const TIME_LIMIT = 30;

export default class Timer{
    private displayText: Phaser.GameObjects.Text;
    private countdown: number;
    private timerEvent: Phaser.Time.TimerEvent;
    private scene: Phaser.Scene;
    private cooldown: Phaser.Time.TimerEvent;
    private onCooldown: boolean;

  constructor(scene:Phaser.Scene) {
    this.scene = scene;
    this.displayText = new Phaser.GameObjects.Text(
      scene, 
      AlignTool.getXfromScreenWidth(scene,0.92), 
      10, 
      '', 
      { color: 'black', fontSize: '42px' });
    scene.add.existing(this.displayText);
    this.displayText.setOrigin(0)
    this.displayText.setDepth(10);
    this.countdown = TIME_LIMIT;
    this.onCooldown = false;

    this.displayText.setText(this.countdown.toString());
  }

  /**
   * Create timer event
   */
  createTimerEvent(): void{
    if(!this.timerEvent){
      this.timerEvent = this.scene.time.addEvent({
        delay: 1000,
        callback: this.tick,
        callbackScope: this,
        loop: true
      })
    }
  }

  /**
   * Call this function every second to decrease countdown
   */
  tick(): void{
    this.countdown--;
    this.displayText.setText(this.countdown.toString());
  }

  /**
   * Check times up status
   * @returns: true if countdown ends, false otherwise
   */
  timesUp(): boolean{
    return this.countdown == 0;
  }

  /**
   * Pause the countdown
   */
  destroyTimeEvent(): void{
    this.timerEvent.paused = true;
  }

  increase(x: number, y: number): void{
    if(this.onCooldown) { return; }
    this.countdown += 3;
    this.displayText.setText(this.countdown.toString());
    
    TextPopUp.showText({
      x: x,
      y: y,
      text: "+3",
      duration: 1,
      style: {
          fontSize: 48,
          fontStyle: "Bold",
          fontFamily: "Courier",
          color: "green",
          strokeThickness: 1
      },
      animType: ANIMATION_TYPE.EASE_IN,
      retain: false,
    })?.text as Phaser.GameObjects.Text;

    this.scene.sound.play('bling');

    this.addCooldown();
  }

  decrease(x: number, y: number): void{
    if(this.onCooldown) { return; }
    
    this.countdown -= 3;
    if(this.countdown < 0) { this.countdown = 0; }
    
    this.displayText.setText(this.countdown.toString());
    
    TextPopUp.showText({
      x: x,
      y: y,
      text: "-3",
      duration: 1,
      style: {
          fontSize: 48,
          fontStyle: "Bold",
          fontFamily: "Courier",
          color: "red",
          strokeThickness: 1
      },
      animType: ANIMATION_TYPE.EASE_IN,
      retain: false,
    })?.text as Phaser.GameObjects.Text;

    this.scene.sound.play('bam');

    this.addCooldown();
  }

  private addCooldown(): void{
    this.onCooldown = true;
    if(!this.cooldown){
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

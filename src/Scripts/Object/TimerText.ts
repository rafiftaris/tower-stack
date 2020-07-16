import * as Phaser from 'phaser';
import {getResolution} from "../Util/Util";

const TIME_LIMIT = 30;

export default class TimerText extends Phaser.GameObjects.Text {
    private countdown: number;
    private timerEvent: Phaser.Time.TimerEvent;

  constructor(scene:Phaser.Scene) {
    super(scene, getResolution().width-60, 10, '', { color: 'white', fontSize: '42px' })
    scene.add.existing(this);
    this.setOrigin(0)
    this.setDepth(10);
    this.countdown = TIME_LIMIT;

    this.setText(this.countdown.toString());
  }

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

  tick(): void{
    this.countdown--;
    this.setText(this.countdown.toString());
  }

  timesUp(): boolean{
    return this.countdown == 0;
  }

  destroyTimeEvent(): void{
    this.timerEvent = null;
  }
}

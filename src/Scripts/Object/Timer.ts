import * as Phaser from 'phaser';
import AlignTool from '../Util/AlignTool';

const TIME_LIMIT = 30;

export default class Timer{
    private displayText: Phaser.GameObjects.Text;
    private countdown: number;
    private timerEvent: Phaser.Time.TimerEvent;
    private scene: Phaser.Scene;

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
}

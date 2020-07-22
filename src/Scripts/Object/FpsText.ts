import * as Phaser from 'phaser';
import { ANIMATION_TYPE, TextPopUp } from "../Util/TextPopUp";
import AlignTool from "../Util/AlignTool";

export default class FpsText{
  private text: Phaser.GameObjects.Text;
  private scene: Phaser.Scene;
  
  constructor(scene:Phaser.Scene) {
    this.scene = scene;
    this.text = TextPopUp.showText({
      x: AlignTool.getXfromScreenWidth(scene,0.01),
      y: AlignTool.getYfromScreenHeight(scene,0.01),
      text: "",
      duration: 0.01,
      style: {
          fontSize: 36,
          fontFamily: "Courier",
          color: "white",
          strokeThickness: 1
      },
      animType: ANIMATION_TYPE.EMBIGGEN,
      retain: true,
    })?.text as Phaser.GameObjects.Text;
    this.text.setOrigin(0)
    this.text.setDepth(10);
  }

  update() {
    this.text.setText(`fps: ${Math.floor(this.scene.game.loop.actualFps)}`)
  }
}

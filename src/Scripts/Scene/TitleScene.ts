import * as Phaser from "phaser";
import FpsText from "../Object/FpsText";

export default class TitleScene extends Phaser.Scene {
  private fpsText: FpsText;

  constructor() {
    super({ key: "TitleScene" });
  }

  preload(): void {}

  create(): void {
    this.fpsText = new FpsText(this);
    // this.sound.play("bgm");
    this.scene.start("LevelScene");
  }
  
  update(): void {
    this.fpsText.update();
  }
}

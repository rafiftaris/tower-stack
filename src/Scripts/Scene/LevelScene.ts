import * as Phaser from "phaser";
import FpsText from "../Object/FpsText";
import Ground from "../Object/Ground";

export default class LevelScene extends Phaser.Scene {
  private fpsText: FpsText;
  private ground: Ground;

  constructor() {
    super({ key: "LevelScene" });
  }

  preload(): void {}

  create(): void {
    this.fpsText = new FpsText(this);
    this.ground = new Ground(this);
  }

  update(): void {
    this.fpsText.update();
  }
}

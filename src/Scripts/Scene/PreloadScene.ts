import * as Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload(): void {
    this.load.path = "src/Assets/";
    this.load.spritesheet("spritesheet","nature-paltformer-tileset-16x16.png", {
        frameWidth: 16,
        frameHeight: 16
    });
  }

  create(): void {
    // this.scene.start("TitleScene");
    this.scene.start("LevelScene");
  }
}

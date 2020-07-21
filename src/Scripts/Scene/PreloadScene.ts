import * as Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload(): void {
    this.load.path = "src/Assets/";
    this.load.spritesheet("groundsheet","spritesheet/nature-paltformer-tileset-16x16.png", {
        frameWidth: 16,
        frameHeight: 16
    });
    this.load.spritesheet("blocksheet","spritesheet/blocks-sheet.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.image("title","Title.png");
    this.load.image("panel", "Panel.png");
    this.load.image("restart", "buttons/restart-button.png");
    this.load.image("play", "buttons/play-button.png");
    this.load.image("stopwatch","stopwatch.png")
    this.load.image("background","sky.png");

    this.load.audio("thud",["sound/thud.mp3","sound/thud.ogg"]);
    this.load.audio("bgm",["sound/bgm.mp3","sound/bgm.ogg"]);
  }

  create(): void {
    this.scene.start("TitleScene");
    // this.scene.start("LevelScene");
  }
}

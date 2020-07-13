import * as Phaser from "phaser";
import FpsText from "../Object/FpsText";
import Ground from "../Object/Ground";
import BricksLayer from "../Object/BricksLayer";

export default class LevelScene extends Phaser.Scene {
  private fpsText: FpsText;
  private ground: Ground;
  private bricksLayer: BricksLayer;

  constructor() {
    super({ key: "LevelScene" });
  }

  preload(): void {}

  create(): void {
    this.fpsText = new FpsText(this);
    this.ground = new Ground(this);
    this.bricksLayer = new BricksLayer(this);
  }

  update(): void {
    this.physics.collide(this.ground.getGroundSurface(),this.bricksLayer.getDroppingBricks())
    this.fpsText.update();
  }
}

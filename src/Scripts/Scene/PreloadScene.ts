import * as Phaser from 'phaser';
import { SceneKeys } from '../Config/SceneKeys';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.Preload });
  }

  preload(): void {
    this.load.path = 'src/Assets/';
    this.load.spritesheet('blocksheet', 'spritesheet/blocks-sheet.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('birdsheet', 'spritesheet/bird.png', {
      frameWidth: 1029 / 3,
      frameHeight: 902 / 3
    });
    this.load.spritesheet('firework', 'spritesheet/firework.png', {
      frameWidth: 1536 / 6,
      frameHeight: 1280 / 5
    });

    this.load.image('title', 'stack-it-up.png');
    this.load.image('panel', 'Panel.png');
    this.load.image('restart', 'buttons/restart-button.png');
    this.load.image('play', 'buttons/play-button.png');
    this.load.image('stopwatch', 'stopwatch.png');
    this.load.image('background', 'sky.jpg');
    this.load.image('hourglass', 'hourglass.png');
    this.load.image('grass-left', 'spritesheet/GrassLeft.png');
    this.load.image('grass-mid', 'spritesheet/GrassMid.png');
    this.load.image('grass-right', 'spritesheet/GrassRight.png');

    this.load.audio('thud', ['sound/thud.mp3', 'sound/thud.ogg']);
    this.load.audio('bgm', ['sound/bgm.mp3', 'sound/bgm.ogg']);
    this.load.audio('bling', ['sound/bling.mp3', 'sound/bling.ogg']);
    this.load.audio('bam', ['sound/bam.mp3', 'sound/bam.ogg']);
    this.load.audio('gameover', ['sound/game-over.mp3', 'sound/game-over.ogg']);
    this.load.audio('score', ['sound/score.mp3', 'sound/score.ogg']);
    this.load.audio('firework', ['sound/firework.mp3', 'sound/firework.ogg']);
  }

  create(): void {
    this.scene.run(SceneKeys.GameUI);
    this.scene.sendToBack(SceneKeys.GameUI);
    
    this.scene.stop(SceneKeys.Preload);
    
    this.scene.start(SceneKeys.Title);
  }
}

import * as Phaser from 'phaser';
import { SceneKeys } from '../Config/SceneKeys';

import { AudioKeys, TextureKeys } from '../Enum/enum';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.Preload });
  }

  preload(): void {
    this.load.path = 'src/Assets/';
    this.load.spritesheet(
      TextureKeys.Blocksheet,
      'spritesheet/blocks-sheet.png',
      {
        frameWidth: 32,
        frameHeight: 32
      }
    );
    this.load.spritesheet(TextureKeys.Birdsheet, 'spritesheet/bird.png', {
      frameWidth: 1029 / 3,
      frameHeight: 902 / 3
    });
    this.load.spritesheet(TextureKeys.Firework, 'spritesheet/firework.png', {
      frameWidth: 1536 / 6,
      frameHeight: 1280 / 5
    });
    this.load.spritesheet(TextureKeys.Claw, 'spritesheet/claw.png', {
      frameWidth: 300,
      frameHeight: 300
    });

    this.load.image(TextureKeys.Title, 'stack-it-up.png');
    this.load.image(TextureKeys.Panel, 'Panel.png');
    this.load.image(TextureKeys.Restart, 'buttons/restart-button.png');
    this.load.image(TextureKeys.Play, 'buttons/play-button.png');
    this.load.image(TextureKeys.Stopwatch, 'stopwatch.png');
    this.load.image(TextureKeys.Background, 'sky.jpg');
    this.load.image(TextureKeys.Hourglass, 'hourglass.png');
    this.load.image(TextureKeys.GrassLeft, 'spritesheet/GrassLeft.png');
    this.load.image(TextureKeys.GrassMid, 'spritesheet/GrassMid.png');
    this.load.image(TextureKeys.GrassRight, 'spritesheet/GrassRight.png');
    this.load.image(TextureKeys.ClawPole, 'claw-pole.png');

    this.load.audio(AudioKeys.Thud, ['sound/thud.mp3', 'sound/thud.ogg']);
    this.load.audio(AudioKeys.Bgm, ['sound/bgm.mp3', 'sound/bgm.ogg']);
    this.load.audio(AudioKeys.Bling, ['sound/bling.mp3', 'sound/bling.ogg']);
    this.load.audio(AudioKeys.Bam, ['sound/bam.mp3', 'sound/bam.ogg']);
    this.load.audio(AudioKeys.GameOver, [
      'sound/game-over.mp3',
      'sound/game-over.ogg'
    ]);
    this.load.audio(AudioKeys.Score, ['sound/score.mp3', 'sound/score.ogg']);
    this.load.audio(AudioKeys.Firework, [
      'sound/firework.mp3',
      'sound/firework.ogg'
    ]);
  }

  create(): void {
    this.scene.run(SceneKeys.GameUI);
    this.scene.sendToBack(SceneKeys.GameUI);

    this.scene.stop(SceneKeys.Preload);

    this.scene.start(SceneKeys.Title);
  }
}

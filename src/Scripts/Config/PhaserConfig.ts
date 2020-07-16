export type PhaserConfig = Phaser.Types.Core.GameConfig;

import LevelScene from "../Scene/LevelScene";
import PreloadScene from "../Scene/PreloadScene";
import TitleScene from "../Scene/TitleScene";

import {getResolution} from '../Util/Util'

export const config: PhaserConfig = {
  title: "TowerStack",
  type: Phaser.AUTO,
  scale: {
    parent: "phaser-app",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: getResolution().width,
    height: getResolution().height,
  },
  physics: {
    default: "matter",
    arcade: {
      debug: false
    },
    matter:{
      debug: true
    }
  },
  backgroundColor: "#87ceeb",
  // scene: [PreloadScene, TitleScene, LevelScene]
  scene: [PreloadScene, LevelScene]
 
};

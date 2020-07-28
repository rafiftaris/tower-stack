import { SceneKeys } from "./Config/SceneKeys";

import TitleScene from "./Scene/TitleScene";
import HowToScene from "./Scene/HowToScene";
import PreloadScene from "./Scene/PreloadScene";
import GameUI from "./Scene/GameUI";
import LevelScene from "./Scene/LevelScene";
import GameOverScene from "./Scene/GameOverScene";

const registerScenes = (game: Phaser.Game): void => {
  const scene = game.scene;
  scene.add(SceneKeys.Preload, PreloadScene);
  scene.add(SceneKeys.Title, TitleScene);
  scene.add(SceneKeys.HowTo, HowToScene);
  scene.add(SceneKeys.GameUI, GameUI);
  scene.add(SceneKeys.Level, LevelScene);
  scene.add(SceneKeys.GameOver, GameOverScene);
};

export default registerScenes;

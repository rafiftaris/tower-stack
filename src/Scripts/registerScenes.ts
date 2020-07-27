import {SceneKeys} from './Config/SceneKeys';

import TitleScene from './Scene/TitleScene';
import PreloadScene from './Scene/PreloadScene';
import GameUI from './Scene/GameUI';
import LevelScene from './Scene/LevelScene';

const registerScenes = (game: Phaser.Game): void => {
  const scene = game.scene;
  scene.add(SceneKeys.Preload, PreloadScene);
  scene.add(SceneKeys.Title, TitleScene);
  scene.add(SceneKeys.GameUI, GameUI);
  scene.add(SceneKeys.Level, LevelScene);
};

export default registerScenes;

import { Direction, ItemTypes } from '../Enum/enum';
import BuildingBlock from '../Object/Block';

interface IItem {
  itemType: ItemTypes;
  isHit: boolean;

  fly(direction: Direction, height: number): void;

  setDefaultSettings(itemType: ItemTypes): void;

  animate(): void;

  hideAfterHit(): void;

  hide(): void;

  resetSettings(): void;
}

interface IButton {
  setEnabled(value: boolean): void;
}

interface IBUildingBlock {
  setDefaultSettings(bitfield?: number, texture?: number): void;

  setAimBlockSettings(pivot: BuildingBlock): void;

  setFallingBlockSettings(
    position: Phaser.Math.Vector2,
    bitfield: number,
    texture: number
  ): void;

  changeTexture(frame?: number): void;

  hide(): Phaser.Math.Vector2;

  show(): void;

  getTextureFrame(): number;

  getSwingTween(): Phaser.Tweens.Tween;
}

interface IFirework {
  setDefaultSettings(scalePercentage: number): void;

  show(playSound: boolean): void;

  hide(): void;
}

interface IGameOverPanel {
  showScore(score: number, newHighScore: boolean): void;
}

interface IGround {
  // getGroundArray(): Phaser.Physics.Matter.Sprite[];
}

interface ITimer {
  createTimerEvent(): void;

  tick(): void;

  timesUp(): boolean;

  destroyTimeEvent(): void;

  itemHit(itemType: ItemTypes, x: number, y: number): void;
}

interface IBackground {
  update(): void;

  scrollDown(): void;

  reset(): void;
}

export {
  IItem,
  IBUildingBlock,
  IButton,
  IFirework,
  IGameOverPanel,
  IGround,
  ITimer,
  IBackground
};

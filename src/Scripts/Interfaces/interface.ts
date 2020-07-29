import { DIRECTION } from '../Enum/enum';

interface IItem {
  itemType: string;
  isHit: boolean;

  fly(direction: DIRECTION, height: number): void;

  setDefaultSettings(): void;

  hideAfterHit(): void;

  hide(): void;

  resetSettings(): void;
}

interface IButton {
  setEnabled(value: boolean): void
}

interface IBUildingBlock {
  setDefaultSettings(bitfield?: number, texture?: number): void

  setMovingBlockSettings(bitfield: number): void 

  setDroppingBlockSettings(
    position: Phaser.Math.Vector2,
    bitfield: number,
    texture: number
  ): void

  changeTexture(frame?: number): void

  hide(): Phaser.Math.Vector2 

  show(): void 

  getTextureFrame(): number

  getTween(): Phaser.Tweens.Tween
}

interface IFirework{
  setDefaultSettings(scalePercentage: number): void

  show(playSound: boolean): void 

  hide(): void
}

interface IGameOverPanel{
  showScore(score: number, newHighScore: boolean): void
}

interface IGround{
  getGroundArray(): Phaser.Physics.Matter.Image[]
}

interface ITimer{
  createTimerEvent(): void

  tick(): void

  timesUp(): boolean

  destroyTimeEvent(): void

  increase(x: number, y: number): void

  decrease(x: number, y: number): void
}

interface IBackground{
  update(): void
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
}
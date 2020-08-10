export enum GameState {
  GameOn,
  GameOver,
  GameOverSetup
}

export enum Direction {
  Right = "right",
  Left = 'left'
}

export enum ButtonType {
  Play,
  HowTo,
  Restart,
  BackFromGameOver,
  BackFromHowTo
}

export enum FontKeys {
  TrulyMadly = 'TrulyMadly',
  SlopeOpera = 'SlopeOpera'
}

export enum AudioKeys {
  Thud = 'thud',
  Bgm = 'bgm',
  Bling = 'bling',
  Bam = 'bam',
  GameOver = 'gameover',
  Score = 'score',
  Firework = 'firework'
}

export enum TextureKeys {
  Title = 'title',
  Panel = 'panel',
  Restart = 'restart',
  Play = 'play',
  Stopwatch = 'stopwatch',
  Background = 'background',
  Hourglass = 'hourglass',
  GrassLeft = 'grass-left',
  GrassMid = 'grass-mid',
  GrassRight = 'grass-right',
  Blocksheet = 'blocksheet',
  Birdsheet = 'birdsheet',
  Firework = 'firework'
}

export enum ItemTypes {
  Hourglass = 'hourglass',
  Bird = 'bird'
}

export enum Color {
  Green = 'green',
  Red = 'red'
}

export enum EventKeys {
  ItemGenerated = 'ItemGenerated',
  BlockDrop = 'BlockDrop',
  ResetBackground = 'ResetBackground'
}

export enum LocalStorageKeys {
  HighScore = 'HighScore'
}

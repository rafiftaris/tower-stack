export type PhaserConfig = Phaser.Types.Core.GameConfig;

import { getResolution } from '../Util/Util';

export const config: PhaserConfig = {
  title: 'Tower Stack',
  type: Phaser.AUTO,
  scale: {
    parent: 'phaser-app',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: getResolution().width,
    height: getResolution().height
  },
  physics: {
    default: 'matter',
    matter: {
      // debug: true
    }
  },
  backgroundColor: '#493a52',
  transparent: true
};

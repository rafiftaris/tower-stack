import { DIRECTION } from '../Enum/enum';

export interface Item {
  itemType: string;
  isHit: boolean;

  fly(direction: DIRECTION): void;

  setDefaultSettings(): void;

  hideAfterHit(): void;

  hide(): void;

  resetSettings(): void;
}

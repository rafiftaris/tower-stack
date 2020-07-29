import * as Phaser from 'phaser';
import AlignTool from '../Util/AlignTool';

import { GAME_STATE } from '../Enum/enum';

import { BlockManager } from '../Manager/BlockManager';
import { ItemManager } from '../Manager/ItemManager';

import { Timer } from '../Object/Timer';

class InputZoneHelper{
    private static instance: InputZoneHelper;

    private inputZone: Phaser.GameObjects.Zone;
    private inputDisabled: boolean;
    private gameState: GAME_STATE;

    public static get Instance() {
        const instance = this.instance || (this.instance = new this());
        return instance;
    }

    init(scene: Phaser.Scene){
        this.inputZone = new Phaser.GameObjects.Zone(
            scene,
            0,
            100,
            AlignTool.getXfromScreenWidth(scene, 1),
            AlignTool.getYfromScreenHeight(scene, 0.95)
        );
        this.inputZone.setOrigin(0, 0);
        this.inputZone.setInteractive();
        scene.add.existing(this.inputZone);
        this.inputDisabled = false;
        this.gameState = null;
    
        this.inputZone.on(
        'pointerdown',
        () => {
            if (this.inputDisabled || this.gameState !== GAME_STATE.GAME_ON) {
            return;
            }
            this.inputDisabled = true;
            ItemManager.addGenerateItemEvent();
            BlockManager.dropBlock();
            Timer.createTimerEvent();
    
            scene.time.addEvent({
            delay: 1000,
            callback: this.showMovingBlock,
            callbackScope: this
            });
        },
        this
        );
    }

    showMovingBlock(): void {
        if (this.gameState === GAME_STATE.GAME_OVER) {
          return;
        }
        BlockManager.showMovingBlock();
        this.inputDisabled = false;
    }

    setState(gameState: GAME_STATE){
        this.gameState = gameState;
    }
}

export const InputZone = InputZoneHelper.Instance;
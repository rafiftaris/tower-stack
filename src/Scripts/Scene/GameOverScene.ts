import * as Phaser from 'phaser';
import { SceneKeys } from '../Config/SceneKeys';
import DepthConfig from '../Config/DepthConfig';

import GameOverPanel from '../Object/GameOverPanel';
import Firework from '../Object/Firework';

import { BlockManager } from '../Manager/BlockManager';

import AlignTool from '../Util/AlignTool';
import { TextPopUp } from '../Util/TextPopUp';

import { IFirework, IGameOverPanel } from "../Interfaces/interface";

export default class GameUI extends Phaser.Scene {
    private gameOverPanel: IGameOverPanel;
    private fireworkA: IFirework;
    private fireworkB: IFirework;

    constructor() {
      super({ key: SceneKeys.GameOver });
    }
  
    preload(): void {}
  
    create(): void {
        this.initializeStaticElements();
        // Game over components
        this.gameOverPanel = new GameOverPanel(this);
        this.fireworkA = new Firework(
            this,
            AlignTool.getXfromScreenWidth(this, 0.3),
            AlignTool.getYfromScreenHeight(this, 0.2),
            0.4
        );
        this.fireworkB = new Firework(
            this,
            AlignTool.getXfromScreenWidth(this, 0.7),
            AlignTool.getYfromScreenHeight(this, 0.2),
            0.4
        );
        
        this.showPanel();
    }
  
    update(): void {}
  
    initializeStaticElements(): void {
        TextPopUp.init(this, DepthConfig.score);
    }

    showPanel(): void {
        this.fireworkA.show(true);
        this.fireworkB.show(true);
        let score = BlockManager.getScore();
        console.log(score);
        
        let currentHighScore = 0;
        if(localStorage.getItem("highScore") !== null){
          currentHighScore = parseInt(localStorage.getItem("highScore"));
        }
        
        if(score > currentHighScore){
          localStorage.setItem("highScore",score.toString());
          this.gameOverPanel.showScore(score, true);
        } else {
          this.gameOverPanel.showScore(score, false);
        }
      }
}
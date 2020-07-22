import * as Phaser from "phaser"; 
import {DIRECTION} from "../Enum/enum";
import Bird from "../Object/Bird";
import Hourglass from "../Object/Hourglass";
import AlignTool from "../Util/AlignTool";

class ItemManagerHelper{
    private static instance: ItemManagerHelper;

    private scene!: Phaser.Scene;
    private birdGroup: Phaser.GameObjects.Group;
    private hourglassGroup: Phaser.GameObjects.Group;
    private currentItem: Bird | Hourglass;
    private delay: number;
    private generator: Phaser.Time.TimerEvent;

    public static get Instance() {
        const instance = this.instance || (this.instance = new this());
        return instance;
    }

    init(scene: Phaser.Scene) {
        this.scene = scene;

        // Init blocks group
        this.birdGroup = scene.add.group({
            classType: Bird,
            defaultKey: 'bird',
            maxSize: 2,
        });
        this.hourglassGroup = scene.add.group({
            classType: Hourglass,
            defaultKey: 'hourglass',
            maxSize: 2,
        });
    }

    private generateItem(): void{
        let delayRandomizer = Math.random()*2;
        this.scene.time.addEvent({
            delay: delayRandomizer*1000,
            callback: () => {
                let itemRandomizer = Math.random()*2;
                
                if(this.currentItem) { return; }

                if(itemRandomizer <= 1.25){
                    this.currentItem = this.birdGroup.get();
                } else {
                    this.currentItem = this.hourglassGroup.get();
                }
        
                if(this.currentItem){
                    this.currentItem.setActive(true);
                    this.currentItem.setVisible(true);
                    this.currentItem.setDefaultSettings();
                    
                    let directionRandomizer = Math.floor(Math.random()*2);
                    if(directionRandomizer == 0){
                        this.currentItem.fly(DIRECTION.left);
                    } else {
                        this.currentItem.fly(DIRECTION.right);
                    }
                }
            },
            callbackScope: this
        })
    }

    addGenerateItemEvent(): void{
        if(this.generator) { return; }
        this.generator = this.scene.time.addEvent({
            delay: 4000,
            callback: this.generateItem,
            callbackScope: this,
            repeat: -1
        });
    }

    getBirdGroup(): Phaser.GameObjects.Group{
        return this.birdGroup;
    }

    getHourglassGroup(): Phaser.GameObjects.Group{
        return this.hourglassGroup;
    }

    checkItem(): void{
        if(this.currentItem) { 
            if(this.currentItem.x >= AlignTool.getXfromScreenWidth(this.scene, 1.2) ||
            this.currentItem.x <= AlignTool.getXfromScreenWidth(this.scene, -0.2)){
                this.currentItem.hide();
                this.currentItem = null;
            }
        }
    }

    setGameOver(): void{
        this.generator.destroy();
        this.generator = null;
    }
}

export const ItemManager = ItemManagerHelper.Instance;
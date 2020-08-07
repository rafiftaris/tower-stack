import * as Phaser from 'phaser';
import { Direction, ItemTypes, EventKeys } from '../Enum/enum';
import Item from '../Object/Item';
import { Timer } from '../Object/Timer';
import AlignTool from '../Util/AlignTool';
import { BlockManager } from './BlockManager';

class ItemManagerHelper {
  private static instance: ItemManagerHelper;

  private scene!: Phaser.Scene;
  private itemGroup: Phaser.GameObjects.Group;
  private currentItem: Item;
  private delay: number;
  private generator: Phaser.Time.TimerEvent;

  private heightRange: number;
  private startingHeight: number;

  public static get Instance() {
    const instance = this.instance || (this.instance = new this());
    return instance;
  }

  init(scene: Phaser.Scene) {
    this.scene = scene;

    this.startingHeight = AlignTool.getYfromScreenHeight(this.scene, 0.3);
    this.heightRange = AlignTool.getYfromScreenHeight(this.scene, 0.25);

    // Init blocks group
    this.itemGroup = scene.add.group({
      classType: Item,
      defaultKey: 'item',
      maxSize: 3
    });

    this.itemGroup.createMultiple({
      classType: Item,
      key: 'item',
      active: false,
      visible: false,
      quantity: 2,
      setScale: {
        x: 0.1,
        y: 0.1
      },
      setXY: {
        x: AlignTool.getXfromScreenWidth(scene, -0.5),
        y: this.startingHeight
      }
    });

    this.currentItem = null;
  }

  private generateItem(): void {
    const delayRandomizer = Math.random() + 1;
    this.scene.time.addEvent({
      delay: delayRandomizer * 1000,
      callback: () => {
        const itemRandomizer = Math.random() * 2;

        if (this.currentItem) {
          return;
        }

        let itemType: ItemTypes;
        if (itemRandomizer <= 1) {
          itemType = ItemTypes.Bird;
        } else {
          itemType = ItemTypes.Hourglass;
        }

        this.currentItem = this.itemGroup.get();

        if (this.currentItem) {
          this.currentItem.setActive(true);
          this.currentItem.setVisible(true);
          this.currentItem.setDefaultSettings(itemType);

          const directionRandomizer = Math.floor(Math.random() * 2);
          const heightRandomizer =
            Math.random() * this.heightRange + this.startingHeight;

          if (directionRandomizer == 0) {
            this.currentItem.fly(Direction.Left, heightRandomizer);
          } else {
            this.currentItem.fly(Direction.Right, heightRandomizer);
          }

          const blocks = BlockManager.getBlockGroup().getChildren();

          this.itemGroup.getChildren().forEach((elem) => {
            const item = <Item>elem;
            const itemBody = <MatterJS.BodyType>(item.body);
            
            item.setOnCollideWith(blocks, () => {
              Timer.itemHit(
                item.itemType,
                itemBody.position.x,
                itemBody.position.y
              );
              item.hideAfterHit();
            });
          });
        }
      },
      callbackScope: this
    });
  }

  addGenerateItemEvent(): void {
    if (this.generator) {
      return;
    }
    this.generator = this.scene.time.addEvent({
      delay: 3000,
      callback: this.generateItem,
      callbackScope: this,
      repeat: -1
    });
  }

  getItemGroup(): Phaser.GameObjects.Group {
    return this.itemGroup;
  }

  getCurrentItem(): Item {
    return this.currentItem;
  }

  checkItem(): void {
    if (this.currentItem) {
      if (
        this.currentItem.x > AlignTool.getXfromScreenWidth(this.scene, 2) ||
        this.currentItem.x < AlignTool.getXfromScreenWidth(this.scene, -1)
      ) {
        this.currentItem.hide();
        this.currentItem = null;
      }
    }
  }

  updateHeightRange(newHeight: number): void {
    this.startingHeight =
      AlignTool.getYfromScreenHeight(this.scene, 0.3) +
      (AlignTool.getYfromScreenHeight(this.scene, 1) - newHeight) / 2;
  }

  setGameOver(): void {
    this.generator.destroy();
    this.generator = null;
  }
}

export const ItemManager = ItemManagerHelper.Instance;

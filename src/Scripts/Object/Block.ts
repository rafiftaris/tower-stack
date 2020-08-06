import * as Phaser from 'phaser';
import { TextureKeys } from '../Enum/enum';
import AlignTool from '../Util/AlignTool';
import MathHelper from '../Util/MathHelper';
import DepthConfig from '../Config/DepthConfig';
import { IBUildingBlock } from '../Interfaces/interface';

const CONFIG = {
  label: 'Block',
  mass: 0,
  frictionAir: 0.05,
  friction: 0.8,
  frictionStatic: 0.8
};

export default class BuildingBlock extends Phaser.Physics.Matter.Sprite
  implements IBUildingBlock {
  public readonly movingBlockStartingHeight = AlignTool.getYfromScreenHeight(
    this.scene,
    0.2
  );
  public readonly jointLength = AlignTool.getYfromScreenHeight(this.scene, 0.3);
  public readonly scalePercentage = 0.22;

  private degree: number;
  private textureFrame: number;
  private tween: Phaser.Tweens.Tween;
  public hasStacked: boolean;

  constructor(scene: Phaser.Scene, bitfield: number) {
    super(scene.matter.world, 0, 0, TextureKeys.Blocksheet, 0, CONFIG);
    this.textureFrame = 0;
    this.scene = scene;
    this.hasStacked = false;
    this.degree = 30;

    this.setDefaultSettings(bitfield);
  }

  /**
   * Set default settings of a block.
   * @param bitfield: collision bitfield
   * @param texture: texture index. If null, randomize index
   */
  setDefaultSettings(bitfield?: number, texture?: number): void {
    this.hasStacked = false;
    this.setActive(true);
    this.setVisible(true);
    this.setDepth(DepthConfig.block);
    this.setBounce(0);
    AlignTool.scaleToScreenWidth(this.scene, this, this.scalePercentage);

    // const body = <MatterJS.BodyType>this.body
    // this.setOrigin(0.5,1);

    this.changeTexture(texture);

    if (bitfield) {
      this.setCollisionCategory(bitfield);
    }
  }

  /**
   * Set moving block settings.
   * @param pivot: collision bitfield
   */
  setAimBlockSettings(pivot: BuildingBlock): MatterJS.ConstraintType {
    this.resetSettings();
    this.setDefaultSettings();

    this.setAimBlockPosition(this.degree, pivot);
    this.setCollisionCategory(null);

    const forceVector = new Phaser.Math.Vector2(
      0,
      AlignTool.getYfromScreenHeight(this.scene,0.0005)
    );
    this.applyForce(forceVector);
    this.setFriction(
      0,
      0,
      0
    );

    const pivotBody = <MatterJS.BodyType>(pivot.body);
    const aimBlockBody = <MatterJS.BodyType>(this.body);

    // Give spring-like physics that swings forever
    return this.scene.matter.add.joint(
      pivotBody,
      aimBlockBody,
      this.jointLength,
      0.5
    );
  }

  /**
   * Set aim block position based on degree difference relative to pivot
   * @param degree degree between aim block and pivot block
   * @param pivot pivot block
   */
  private setAimBlockPosition(degree: number, pivot: BuildingBlock): void{
    const radian = MathHelper.degreeToRadian(degree + 90);
    const deltaX = Math.cos(radian) * this.jointLength;
    const deltaY = Math.sin(radian) * this.jointLength;
    
    const sign = Math.sign(pivot.x - this.x);

    this.setPosition(
      pivot.x + (deltaX * sign), 
      pivot.y + deltaY
    );
  }

  /**
   * Update degree difference between pivot and aim block
   * @param newDegree new degree update
   * @param pivot pivot block
   */
  updateDegree(newDegree: number, pivot: BuildingBlock): void{
    this.degree = newDegree;
    this.setAimBlockPosition(this.degree, pivot);
  }

  /**
   * Get degree difference of aim block and pivot
   * @returns degree difference
   */
  getDegree(): number{
    return this.degree;
  }

  /**
   * Set pivot block settings.
   */
  setPivotBlockSettings(): void{
    this.setDefaultSettings();
    this.setStatic(true);
    this.setVisible(false);
    this.setPosition(
      AlignTool.getXfromScreenWidth(this.scene, 0.5),
      this.movingBlockStartingHeight - AlignTool.getYfromScreenHeight(this.scene, 0.2)
    );
    this.setIgnoreGravity(true);
  }

  /**
   * Set settings of dropping block based on moving block settings
   * @param position: current position of moving block
   * @param bitfield: collision bitfield
   * @param texture: current texture index of moving block
   */
  setFallingBlockSettings(
    position: Phaser.Math.Vector2,
    bitfield: number,
    texture: number
  ): void {
    console.log('block fall');
    this.resetSettings();
    this.setPosition(position.x, position.y);
    this.setVelocityY(AlignTool.getYfromScreenHeight(this.scene, 0.04));
    this.setDefaultSettings(bitfield, texture);
  }

  /**
   * Reset settings of a block
   */
  private resetSettings(): void {
    this.setVelocityX(0);
    this.setVelocityY(0);
    this.setAngle(0);
    this.setAngularVelocity(0);
    this.setStatic(false);
    this.setVisible(true);
    this.setActive(true);
    this.hasStacked = false;
  }

  /**
   * Change texture of a block.
   * @param frame: frame index, randomize index if null
   */
  changeTexture(frame?: number): void {
    if (!frame) {
      frame = Math.floor(Math.random() * 96);
    }
    this.setTexture('blocksheet', frame);
    this.textureFrame = frame;
  }

  /**
   * Hide moving block
   * @returns: position of moving block
   */
  hide(): Phaser.Math.Vector2 {
    // this.tween.pause();
    this.setVisible(false);
    const position = new Phaser.Math.Vector2(this.x, this.y);
    return position;
  }

  /**
   * Show moving block
   */
  show(): void {
    // this.tween.resume();
    this.setVisible(true);
    this.setActive(true);
  }

  /**
   * Get texture frame index of block.
   */
  getTextureFrame(): number {
    return this.textureFrame;
  }

  /**
   * Get tween of moving block.
   */
  getTween(): Phaser.Tweens.Tween {
    return this.tween;
  }

  /**
   * Deactivate block
   */
  deactivate(): void{
    this.setVisible(false);
    this.setActive(false);
  }
}

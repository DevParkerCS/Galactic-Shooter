export class EnemyClass {
  private speed: number;
  private imgLink: string;
  private speedIndex: number;
  private enemyIndex: number;

  constructor(imgLink: string, speedIndex: number, enemyIndex: number) {
    this.imgLink = imgLink;
    this.speedIndex = speedIndex;
    this.enemyIndex = enemyIndex;
    this.speed = 0;
  }

  set setSpeed(speed: number) {
    this.speed = speed;
  }
  get getSpeed() {
    return this.speed;
  }
  get getSpeedIndex() {
    return this.speedIndex;
  }
  get getEnemyIndex() {
    return this.enemyIndex;
  }
  get getImgLink() {
    return this.imgLink;
  }
}

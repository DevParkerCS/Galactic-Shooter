export class EnemyClass {
  private speed: number;
  private imgLink: string;
  private enemyIndex: number;
  private health: number;
  private imgIndex: number;
  private isBoss: boolean;
  private maxHealth: number;

  constructor(
    imgLink: string,
    enemyIndex: number,
    health: number,
    imgIndex: number,
    speed: number,
    isBoss: boolean
  ) {
    this.imgLink = imgLink;
    this.enemyIndex = enemyIndex;
    this.speed = speed;
    this.health = health;
    this.maxHealth = health;
    this.imgIndex = imgIndex;
    this.isBoss = isBoss;
  }

  get getSpeed() {
    return this.speed;
  }
  get getEnemyIndex() {
    return this.enemyIndex;
  }
  get getImgLink() {
    return this.imgLink;
  }
  get getHealth() {
    return this.health;
  }
  get getImgIndex() {
    return this.imgIndex;
  }
  get getIsBoss() {
    return this.isBoss;
  }
  get getMaxHealth() {
    return this.maxHealth;
  }

  set removeHealth(damage: number) {
    this.health -= damage;
  }
}

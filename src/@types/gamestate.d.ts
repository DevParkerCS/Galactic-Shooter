export type GameStateType = {
  round: number;
  lives: number;
  score: number;
  gameOver: boolean;
  enemiesLeft: number;
  timeStamp: number;
  wonGame: boolean;
  enemyTimers: Timeout[];
};

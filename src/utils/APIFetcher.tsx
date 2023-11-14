import axios from "axios";
import { HighScoreForm } from "../Pages/maingame/components/HighScoreForm";
import { SetStateAction } from "react";
import { GameStateType } from "../@types/gamestate";

type CheckHighScoreArgs = {
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
  gameState: GameStateType;
  setShowForm: React.Dispatch<SetStateAction<JSX.Element | null>>;
  showForm: JSX.Element | null;
};

export const checkHighScore = async ({
  setIsLoading,
  gameState,
  setShowForm,
  showForm,
}: CheckHighScoreArgs) => {
  try {
    setIsLoading(true);
    // Gets scores from database
    const scores = (
      await axios.get(
        process.env.REACT_APP_LEADERBOARDAPI || "http://localhost:3000"
      )
    ).data;
    for (let i = 0; i < scores.length; i++) {
      // Check if the players score is greater than the score at nth place
      if (gameState.score > scores[i].score) {
        setShowForm(
          <HighScoreForm index={i} scores={scores} score={gameState.score} />
        );
      }
    }
    // If the length of the scores isn't 10 then place the score at the end.
    if (!showForm && scores.length !== 10) {
      setShowForm(
        <HighScoreForm
          index={scores.legnth - 1}
          scores={scores}
          score={gameState.score}
        />
      );
    }
    setIsLoading(false);
  } catch (e) {}
};

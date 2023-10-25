import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../../components/Spinner";
type HighScoreFormProps = {
  score: number;
  index: number;
  scores: ScoresType[];
};

type ScoresType = {
  name: string;
  score: number;
};

export const HighScoreForm = ({ score, index, scores }: HighScoreFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const updateScores = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      if (e.target instanceof HTMLFormElement) {
        const userInput = e.target.elements.namedItem(
          "initials"
        ) as HTMLInputElement;
        const userName = userInput.value;
        scores.splice(index, 0, { name: userName, score: score });
        if (scores.length === 11) {
          scores.pop();
        }
        await axios.put("http://localhost:3000/add-score", { scores: scores });
        navigate("/leaderboard");
      }
    } catch (e) {
      console.log(e);
    }
  };
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div>
      <h1>New HighScore!</h1>
      <form onSubmit={(e) => updateScores(e)}>
        <input
          required
          name="initials"
          placeholder="Initials"
          maxLength={3}
        ></input>
        <h1>{score}</h1>
      </form>
    </div>
  );
};

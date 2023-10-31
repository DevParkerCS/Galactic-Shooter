import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../../components/Spinner";
import styles from "./HighScoreForm.module.scss";

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
  const [inputVal, setInputVal] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setInputVal(e.target.value.toUpperCase());
  };

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
        await axios.put(
          process.env.REACT_APP_ADDSCOREAPI ||
            "http://localhost:3000/add-score",
          { scores: scores }
        );
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
    <div className={styles.highscoreWrapper}>
      <h1 className={styles.title}>New HighScore!</h1>
      <form className={styles.highscoreForm} onSubmit={(e) => updateScores(e)}>
        <input
          className={styles.formInput}
          required
          name="initials"
          value={inputVal}
          onChange={handleChange}
          maxLength={3}
          placeholder="___"
        ></input>
        <button className={styles.formBtn}>Submit</button>
      </form>
    </div>
  );
};

import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import styles from "./Leaderboard.module.scss";

type ResponseType = {
  data: [LeaderboardType];
};

type LeaderboardType = {
  name: string;
  score: number;
};

export const Leaderboard = () => {
  let [leaderboard, setLeaderboard] = useState<LeaderboardType[]>();

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_ADDSCOREAPI || "http://localhost:3000")
      .then((res: ResponseType) => setLeaderboard(res.data));
  }, []);

  return (
    <div>
      {leaderboard?.map((p, i) => {
        return (
          <div key={i} className={styles.leaderboardEntry}>
            <h1>
              {i + 1}){p.name}:{" "}
            </h1>
            <h1>{p.score}</h1>
          </div>
        );
      })}
    </div>
  );
};

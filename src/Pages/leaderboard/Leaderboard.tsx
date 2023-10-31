import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import styles from "./Leaderboard.module.scss";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../components/Spinner";

type ResponseType = {
  data: [LeaderboardType];
};

type LeaderboardType = {
  name: string;
  score: number;
};

export const Leaderboard = () => {
  let [leaderboard, setLeaderboard] = useState<LeaderboardType[]>();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_LEADERBOARDAPI || "http://localhost:3000")
      .then((res: ResponseType) => setLeaderboard(res.data));
  }, []);

  if (!leaderboard) {
    return <Spinner />;
  }

  return (
    <div className={styles.leaderboardWrapper}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>LEADERBOARD</h1>
        <div className={styles.entriesWrapper}>
          {leaderboard?.map((p, i) => {
            return (
              <div key={i} className={styles.leaderboardEntry}>
                <h1>
                  {i + 1}){p.name.toUpperCase()}:{" "}
                </h1>
                <h1>{p.score}</h1>
              </div>
            );
          })}
        </div>
        <button onClick={() => navigate("/")} className={styles.homeBtn}>
          Home
        </button>
      </div>
    </div>
  );
};

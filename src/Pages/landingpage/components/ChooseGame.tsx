import { useState, useEffect, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../../socket";

type ChooseGameProps = {
  setClickedPlay: React.Dispatch<SetStateAction<boolean>>;
};

export const ChooseGame = ({ setClickedPlay }: ChooseGameProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    sessionStorage.setItem("isMultiplayer", "true");
    socket.emit("findRoom");
    navigate("/play");
  };

  return (
    <div>
      <button onClick={() => navigate("/play")}>Single Player</button>
      <button onClick={handleClick}>Multiplayer</button>
      <button
        onClick={() => {
          setClickedPlay(false);
        }}
      >
        Home
      </button>
    </div>
  );
};

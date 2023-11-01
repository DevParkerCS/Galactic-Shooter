import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainGame from "./Pages/maingame/MainGame";
import { LandingPage } from "./Pages/landingpage/LandingPage";
import { Leaderboard } from "./Pages/leaderboard/Leaderboard";
import { ObjectivePage } from "./Pages/ObjectivePage/ObjectivePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path={"/"} element={<LandingPage />} />
        <Route path={"/play"} element={<MainGame />} />
        <Route path={"/leaderboard"} element={<Leaderboard />} />
        <Route path={"/objective"} element={<ObjectivePage />} />
        <Route path={"/*"} element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;

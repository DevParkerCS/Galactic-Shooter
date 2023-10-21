import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainGame from "./Pages/maingame/MainGame";
import { LandingPage } from "./Pages/landingpage/LandingPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path={"/"} element={<LandingPage />} />
        <Route path={"/play"} element={<MainGame />} />
        <Route path={"/*"} element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainGame from "./Pages/MainGame";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path={"/"} element={<MainGame />} />
      </Routes>
    </Router>
  );
};

export default App;

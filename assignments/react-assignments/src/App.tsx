import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthApp from "./pages/AuthApp";
import YouTubeVideos from "./pages/YouTubeVideos";
import ProductListing from "./pages/ProductListing";
import QuotesListing from "./pages/QuotesListing";
import JokesViewer from "./pages/JokesViewer";
import CatViewer from "./pages/CatViewer";
import MealsListing from "./pages/MealsListing";
import RandomUsers from "./pages/RandomUsers";
import StopwatchTimer from "./pages/StopwatchTimer";
import TicTacToe from "./pages/TicTacToe";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/project/1" element={<AuthApp />} />
      <Route path="/project/2" element={<YouTubeVideos />} />
      <Route path="/project/3" element={<ProductListing />} />
      <Route path="/project/4" element={<QuotesListing />} />
      <Route path="/project/5" element={<JokesViewer />} />
      <Route path="/project/6" element={<CatViewer />} />
      <Route path="/project/7" element={<MealsListing />} />
      <Route path="/project/8" element={<RandomUsers />} />
      <Route path="/project/9" element={<StopwatchTimer />} />
      <Route path="/project/10" element={<TicTacToe />} />
    </Routes>
  );
};

export default App;

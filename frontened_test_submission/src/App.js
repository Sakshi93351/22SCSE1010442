import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UrlShortenerForm from "./components/urlShortenerForm";
import UrlStats from "./components/urlStats";
import RedirectHandler from "./components/RedirectHandler";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UrlShortenerForm/>} />
        <Route path="/stats" element={<UrlStats/>} />
        <Route path="/shortcode" element={<RedirectHandler/>} />
      </Routes>
    </Router>
  );
}

export default App;

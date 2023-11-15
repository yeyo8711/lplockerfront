import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import useStore from "./store";
import "./input.css";
import axios from "axios";
import Header from "./components/Header";
import Homepage from "./components/HomePage";
import Footer from "./components/Footer";

function App() {
  const { baseURL, updateFrontURL } = useStore();

  useEffect(() => {
    const refresh = async () => {
      await axios
        .get(`${baseURL}/refresh`)
        .then((response) => updateFrontURL(response.data.url));
    };
    refresh();
  }, []);

  return (
    <Router>
      <Header />
      <Switch>
        <Route path='/viewOneLock/:address' component={Homepage} />
        <Route path='/' component={Homepage} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;

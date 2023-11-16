import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import useStore from "./store";
import "./input.css";
import axios from "axios";
import Header from "./components/Header";
import Homepage from "./components/HomePage";
import Footer from "./components/Footer";
import Welcome from "./components/Welcome";

function App() {
  const { baseURL, updateFrontURL } = useStore();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const refresh = async () => {
      await axios
        .get(`${baseURL}/refresh`)
        .then((response) => updateFrontURL(response.data.url));
    };
    refresh();
  }, []);

  return (
    <div className='flex flex-col justify-center w-screen min-h-fit items-center'>
      {showWelcome ? (
        <Welcome setShowWelcome={setShowWelcome} />
      ) : (
        <Router>
          <Header />
          <Switch>
            <Route path='/viewOneLock/:address' component={Homepage} />
            <Route path='/' component={Homepage} />
          </Switch>
          <Footer />
        </Router>
      )}
    </div>
  );
}

export default App;

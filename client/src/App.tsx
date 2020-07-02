import React from "react";
import "./App.css";
import Home from "./screens/Home";
import { Router, Route, Switch } from "react-router-dom";
import { myHistory } from "./util/routing";
import TopNavbar from "./components/TopNavbar";
import Documentation from "./components/Documentation";

function App() {
  return (
    <div className="App">
      <Router history={myHistory}>
        <TopNavbar />
        <div className="App-MainContainer">
          <Switch>
            <Route exact path="/documentation" component={Documentation} />
            <Route exact path="/space/:workspaceId" component={Home} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;

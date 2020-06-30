import React from "react";
import "./App.css";
import Home from "./screens/Home";
import { Router, Route, Switch } from "react-router-dom";
import { myHistory } from "./util/routing";

function App() {
  return (
    <div className="App">
      <Router history={myHistory}>
        <Switch>
          <Route exact path="/space/:workspaceId" component={Home} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

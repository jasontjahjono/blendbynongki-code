import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import AmbientRoom from "./routes/AmbientRoom";
import Login from "./routes/Login";
import CotterProvider from "./contexts/userProvider";
import { COTTER_API_KEY_ID } from "./apiKeys";

require("dotenv").config();

function App() {
  return (
    <CotterProvider apiKeyID={COTTER_API_KEY_ID}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={CreateRoom} />
          <Route path="/room/:roomID" component={AmbientRoom} />
          <Route path="/login" exact component={Login} />
        </Switch>
      </BrowserRouter>
    </CotterProvider>
  );
}

export default App;

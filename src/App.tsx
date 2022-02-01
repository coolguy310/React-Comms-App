import React from "react";
import "./firebase";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "components/AuthLayout/AuthLayout";
import Login from "modules/Login/Login";
import Inbox from "modules/Inbox/Inbox";
import Channels from "modules/Channels/Channels";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Inbox />} />
          <Route path=":id" element={<Channels />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

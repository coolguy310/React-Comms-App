import React from "react";
import "./firebase";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "components/layouts/AuthLayout/AuthLayout";
import Login from "modules/Login/Login";
import Inbox from "modules/Inbox/Inbox";
import ViewChannel from "modules/Channels/ViewChannel/ViewChannel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Inbox />} />
          <Route path=":id" element={<ViewChannel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

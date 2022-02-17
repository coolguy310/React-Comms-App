import React, { useEffect, useState } from "react";
import "./firebase";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "components/layouts/AuthLayout/AuthLayout";
import Login from "modules/Login/Login";
import Inbox from "modules/Inbox/Inbox";
import ChannelView from "modules/Channels/ChannelView/ChannelView";
import { AppProvider } from "utils/Context/Context";
import { IChannel, IPost, IUser } from "utils/types";
import PostView from "modules/Posts/PostView/PostView";
import PostNew from "modules/Posts/PostNew/PostNew";

function App() {
  const [channels, setChannels] = useState<IChannel[]>([]);
  const [inbox, setInbox] = useState<IPost[] | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [activeSection, setActiveSection] = useState<string>("/"); // this is the pathname to the section where the arrow key navigation is being focused on, defaults to "/"

  // Disable default action of tab key across the app
  useEffect(() => {
    function disableTabKey(event: any) {
      if (event.which === 9) {
        event.preventDefault();
      }
    }
    window.addEventListener("keydown", disableTabKey, true);
    return () => window.removeEventListener("keydown", disableTabKey, true);
  }, []);

  return (
    // Declare context provider values
    <AppProvider
      value={{
        channels,
        setChannels,
        inbox,
        setInbox,
        users,
        setUsers,
        activeSection,
        setActiveSection,
      }}
    >
      {/* Declare routes */}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Inbox />} />
            <Route path="/new" element={<PostNew />} />
            <Route path=":id">
              <Route index element={<ChannelView />} />
              <Route path=":postId" element={<PostView />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { getAuth } from "firebase/auth";
import Badge from "components/ui/Badge/Badge";
import logo from "logo.svg";
import ChannelsList from "modules/Channels/ChannelsList/ChannelsList";

export default function AuthLayout() {
  const auth = getAuth();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(() => auth.currentUser);

  let location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      if (initializing) {
        setInitializing(false);
      }
    });
    // Cleanup subscription
    return unsubscribe;
  }, [initializing, auth]);

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  if (initializing) return <p style={{ textAlign: "center" }}>Loading...</p>;

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="">
      <div className="py-8 min-h-screen h-full flex items-stretch">
        <div className="w-64 h-full fixed z-30 top-0 py-8 shrink-0">
          <div className=" h-full border-r-2 pl-8 pr-5 py-2 border-gray-500 flex flex-col justify-between">
            <div>
              <img src={logo} alt="logo" />
              <Link to="/">
                <div className="flex mt-12 cursor-pointer space-x-6 items-center justify-between">
                  <p className="text-lg">Inbox</p>
                  <Badge>4</Badge>
                </div>
              </Link>

              <ChannelsList />
            </div>

            <button
              onClick={signOut}
              className="flex items-center py-3 justify-center rounded-md "
            >
              <BiLogOut className="mr-2" /> Logout
            </button>
          </div>
        </div>
        <div className="w-full pl-64">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { getAuth } from "firebase/auth";
import Badge from "components/ui/Badge/Badge";
import logo from "logo.svg";
import ChannelsList from "modules/Channels/ChannelsList/ChannelsList";
import {
  LinkItem,
  LogoutButton,
  MainContent,
  PageContainer,
  SidebarContent,
  SidebarWrapper,
} from "./AuthLayout.styled";
import Text from "components/ui/Text/Text";

export default function AuthLayout() {
  const auth = getAuth();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(() => auth.currentUser);

  let location = useLocation();

  useEffect(() => {
    // Listen for auth state changes
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
    <PageContainer>
      <SidebarWrapper>
        <SidebarContent>
          <div>
            <img src={logo} alt="logo" />
            <Link to="/">
              <LinkItem>
                <Text fontSize="lg">Inbox</Text>
                <Badge>4</Badge>
              </LinkItem>
            </Link>

            <ChannelsList />
          </div>

          <LogoutButton onClick={signOut}>
            <BiLogOut /> Logout
          </LogoutButton>
        </SidebarContent>
      </SidebarWrapper>
      <MainContent>
        <Outlet />
      </MainContent>
    </PageContainer>
  );
}

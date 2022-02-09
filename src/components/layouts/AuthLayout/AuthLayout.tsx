import React from "react";
import Badge from "components/ui/Badge/Badge";
import Box from "components/ui/Box/Box";
import Flex from "components/ui/Flex/Flex";
import { Spotlight } from "components/ui/Spotlight/Spotlight";
import Text from "components/ui/Text/Text";
import { KBarProvider } from "kbar";
import ChannelsList from "modules/Channels/ChannelsList/ChannelsList";
import { BiLogOut } from "react-icons/bi";
import { Link, Navigate, Outlet } from "react-router-dom";
import { defaultHotkeys } from "utils/Hotkeys/defaultHotkeys";
import {
  LinkItem,
  LogoutButton,
  MainContent,
  PageContainer,
  SidebarContent,
  SidebarWrapper,
} from "./AuthLayout.styled";
import useAuthLayoutHook from "./useAuthLayoutHook";

export default function AuthLayout() {
  const { initializing, user, location, onClickLink, inbox, signOut } =
    useAuthLayoutHook();

  if (initializing)
    return (
      <Flex alignCenter justifyCenter css={{ minHeight: "100vh" }}>
        Loading...
      </Flex>
    );

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <KBarProvider actions={defaultHotkeys({ onClickLink })}>
      <Spotlight onClickLink={onClickLink} />

      <PageContainer>
        <SidebarWrapper>
          <SidebarContent>
            <div>
              <Flex alignCenter>
                <Box
                  as="img"
                  css={{ width: 40, marginRight: 16 }}
                  src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f6f0-fe0f.svg"
                  alt="logo"
                />
                <Text as="h1" fontWeight="bold" fontSize="xl">
                  Comms
                </Text>
              </Flex>
              <Link to="/">
                <LinkItem>
                  <Text fontSize="lg">Inbox</Text>
                  {inbox && inbox.length > 0 && <Badge>{inbox?.length}</Badge>}
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
    </KBarProvider>
  );
}

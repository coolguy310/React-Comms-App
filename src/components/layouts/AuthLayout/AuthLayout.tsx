import React from "react";
import Badge from "components/ui/Badge/Badge";
import Box from "components/ui/Box/Box";
import Flex from "components/ui/Flex/Flex";
import { Spotlight } from "components/ui/Spotlight/Spotlight";
import Text from "components/ui/Text/Text";
import { KBarProvider } from "kbar";
import ChannelList from "modules/Channels/ChannelList/ChannelList";
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
import Avatar from "../../ui/Avatar/Avatar";
import { useAppContext } from "utils/Context/Context";

export default function AuthLayout() {
  const { initializing, user, location, onClickLink, inbox, signOut } =
    useAuthLayoutHook();

  const { activeSection, setActiveSection } = useAppContext();

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
    <KBarProvider
      options={{
        callbacks: {
          // Hide arrow key navigation when kbar is opened
          onOpen: () => setActiveSection(null),
          onClose: () => setActiveSection(location.pathname),
        },
        disableScrollbarManagement: true,
      }}
      actions={defaultHotkeys({ onClickLink })}
    >
      <Spotlight />

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
                <LinkItem
                  css={{
                    padding: "0.25rem 0.5rem",
                    borderRadius: 6,
                    backgroundColor:
                      activeSection === "inbox" ? "$gray5" : "transparent",
                  }}
                >
                  <Text fontSize="lg">Inbox</Text>
                  {inbox && inbox.length > 0 && <Badge>{inbox?.length}</Badge>}
                </LinkItem>
              </Link>

              <ChannelList />
            </div>

            <Flex column justifyCenter>
              <Flex alignCenter css={{ width: "100%", marginBottom: 16 }}>
                <Avatar css={{ marginRight: "1rem" }} src={user.photoURL!} />

                <Box>
                  <Text fontSize="md" fontWeight="bold">
                    {user.displayName}
                  </Text>
                  <Text fontSize="xs">{user.email}</Text>
                </Box>
              </Flex>
              <LogoutButton onClick={signOut}>
                <BiLogOut /> Logout
              </LogoutButton>
            </Flex>
          </SidebarContent>
        </SidebarWrapper>
        <MainContent>
          <Outlet />
        </MainContent>
      </PageContainer>
    </KBarProvider>
  );
}

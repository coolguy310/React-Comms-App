import React from "react";
import Avatar from "components/ui/Avatar/Avatar";
import Box from "components/ui/Box/Box";
import Flex from "components/ui/Flex/Flex";
import Text from "components/ui/Text/Text";
import { IChannel } from "utils/types";
import NotificationsSettings from "./components/NotificationsSettings";
import useChannelViewHook from "./useChannelViewHook";
import Button from "components/ui/Button/Button";
import { useNavigate } from "react-router-dom";

export default function ChannelView() {
  const navigate = useNavigate();
  const { channel, channelPosts } = useChannelViewHook();

  if (!channel) {
    return null;
  }

  return (
    <Box css={{ paddingTop: 8 }}>
      <Flex justifyBetween alignCenter css={{ paddingRight: "6rem" }}>
        <Text
          as="h1"
          fontWeight="bold"
          css={{ padding: "0 3rem", fontSize: 36 }}
        >
          {channel.name}
        </Text>

        <Flex alignCenter>
          <Button
            onClick={() => navigate(`/new?channelId=${channel.id}`)}
            variant="bordered"
            css={{ padding: "0.25rem 1.5rem", marginRight: 20 }}
          >
            +&nbsp; New Post
          </Button>
          <NotificationsSettings channel={channel as IChannel} />
        </Flex>
      </Flex>
      <Box as="hr" css={{ marginTop: "2rem", marginBottom: "1rem" }} />
    </Box>
  );
}

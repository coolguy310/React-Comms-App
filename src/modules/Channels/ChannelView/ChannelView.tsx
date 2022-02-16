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
import { PostItem, PostText } from "./ChannelView.styled";

export default function ChannelView() {
  const navigate = useNavigate();
  const {
    channel,
    channelPosts,
    cursor,
    isActive,
    setHovered,
    setSelected,
    openChannelPost,
  } = useChannelViewHook();

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
      <Box as="hr" css={{ marginTop: "2rem" }} />
      {channelPosts.map((post, i) => {
        const { id, authorImage, authorName, text, createdAt } = post;
        return (
          <PostItem
            className={`item ${isActive && i === cursor ? "active" : ""}`}
            onClick={() => {
              setSelected(post);
              openChannelPost(post);
            }}
            onMouseEnter={() => setHovered(post)}
            onMouseLeave={() => setHovered(undefined)}
            key={id}
          >
            <Flex css={{ width: "100%", maxWidth: "14rem" }}>
              <Avatar css={{ marginRight: "1rem" }} src={authorImage} />
              <Box>
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  css={{ marginRight: 8, marginBottom: 4 }}
                >
                  {authorName}
                </Text>
                <Text fontSize="xs">
                  at {new Date(createdAt).toLocaleString()}
                </Text>
              </Box>
            </Flex>
            <Box css={{ width: "100%" }}>
              <Text
                fontSize="xs"
                fontWeight="bold"
                css={{
                  color: "$gray9",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                # {channel.name}
              </Text>
              <PostText
                dangerouslySetInnerHTML={{
                  __html: `<div>${text}</div>`,
                }}
              />
            </Box>
          </PostItem>
        );
      })}
    </Box>
  );
}

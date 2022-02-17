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
import { HiPencilAlt } from "react-icons/hi";

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

  if (!channel || !channelPosts) {
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
      {/* If there are no posts, Show view to create a new post */}
      {!channelPosts.length && (
        <Flex
          justifyCenter
          css={{
            marginTop: 40,
          }}
        >
          <Flex
            alignCenter
            onClick={() => navigate(`/new?channelId=${channel.id}`)}
            css={{
              cursor: "pointer",
              width: "20rem",
              padding: "1rem 2rem",
              border: "1px solid lightgray",
              backgroundColor: isActive ? "$gray2" : "white",
              boxShadow:
                "rgb(55 71 80 / 12%) 0px 0px 0px 0.5px, rgb(55 71 80 / 6%) 0px 4px 8px",
              borderRadius: 8,
            }}
          >
            <Flex
              alignCenter
              justifyCenter
              css={{
                width: 30,
                height: 30,
                backgroundColor: "$gray3",
                borderRadius: 8,
                marginRight: 20,
              }}
            >
              <HiPencilAlt />
            </Flex>
            <Text>Start the first post</Text>
          </Flex>
        </Flex>
      )}

      {channelPosts.map((post, i) => {
        const { id, authorImage, authorName, subject, text, createdAt } = post;
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
            <Box css={{ width: "calc(100% - 14rem)" }}>
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
              <Flex alignCenter>
                {subject && (
                  <Text css={{ flexShrink: 0 }} fontWeight="bold">
                    {subject} - &nbsp;
                  </Text>
                )}
                <PostText
                  dangerouslySetInnerHTML={{
                    __html: `<div>${text}</div>`,
                  }}
                />
              </Flex>
            </Box>
          </PostItem>
        );
      })}
    </Box>
  );
}

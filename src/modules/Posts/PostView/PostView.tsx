import React from "react";
import Avatar from "components/ui/Avatar/Avatar";
import Box from "components/ui/Box/Box";
import Flex from "components/ui/Flex/Flex";
import Text from "components/ui/Text/Text";
import PostReply from "../PostReply/PostReply";
import usePostViewHook from "./usePostViewHook";
import { FiCopy } from "react-icons/fi";
// import NotificationsSettings from "./components/NotificationsSettings";

export default function PostView() {
  const { channel, firstPost, replies } = usePostViewHook();

  if (!channel || !firstPost) {
    return null;
  }

  return (
    <Box css={{ paddingTop: 8 }}>
      <Flex css={{ padding: "0 3rem" }} alignCenter>
        <FiCopy color="gray" />
        <Text
          css={{ textTransform: "uppercase", marginLeft: 9, color: "$gray10" }}
          fontWeight="bold"
          fontSize="sm"
        >
          {channel.name}
        </Text>
      </Flex>
      <Flex justifyBetween alignCenter css={{ paddingRight: "6rem" }}>
        <Text
          as="h1"
          fontWeight="bold"
          css={{ padding: "0 3rem 1rem", fontSize: 36 }}
        >
          {firstPost.subject}
        </Text>

        {/* <NotificationsSettings channel={channel as IChannel} /> */}
      </Flex>
      <Box css={{ display: "flex", padding: "0.75rem 3rem" }}>
        <Avatar css={{ marginRight: "1rem" }} src={firstPost.authorImage} />

        <div>
          <Box css={{ display: "flex", alignItems: "baseline" }}>
            <Text fontSize="lg" fontWeight="bold" css={{ marginRight: 8 }}>
              {firstPost?.authorName}
            </Text>
            <Text fontSize="xs">
              at {new Date(firstPost.createdAt).toLocaleString()}
            </Text>
          </Box>
          <Text
            css={{ marginTop: 8 }}
            dangerouslySetInnerHTML={{
              __html: `<div>${firstPost.text}</div>`,
            }}
          />
        </div>
      </Box>

      <Box css={{ padding: "2rem 2rem 0" }}>
        {!!replies.length && (
          <Text fontWeight="bold" css={{ marginBottom: 4 }}>
            Replies
          </Text>
        )}
        {replies.map(({ id, text, authorImage, authorName, createdAt }) => (
          <div id={id} key={id}>
            <Box as="hr" />
            <Box css={{ padding: "0.75rem 0.5rem", display: "flex" }}>
              <Avatar src={authorImage} />
              <Box css={{ marginLeft: "1rem" }}>
                <Box css={{ display: "flex", alignItems: "baseline" }}>
                  <Text
                    fontWeight="bold"
                    css={{ marginRight: "0.5rem" }}
                    fontSize="sm"
                  >
                    {authorName}
                  </Text>
                  <Text fontSize="xs">
                    at {new Date(createdAt).toLocaleString()}
                  </Text>
                </Box>
                <Text
                  css={{ marginTop: 3 }}
                  fontSize="sm"
                  dangerouslySetInnerHTML={{ __html: `<div>${text}</div>` }}
                />
              </Box>
            </Box>
          </div>
        ))}

        <PostReply replyTo={firstPost.id} channelName={channel.name} />
      </Box>
    </Box>
  );
}

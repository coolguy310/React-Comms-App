import React, { useEffect, useState } from "react";
import Avatar from "components/ui/Avatar/Avatar";
import Box from "components/ui/Box/Box";
import Text from "components/ui/Text/Text";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { sortByDate } from "utils/helpers";
import { IChannel, IPost } from "utils/types";
import db from "../../../firebase";
import NewPost from "./components/NewPost/NewPost";

export default function ViewChannel() {
  const [channel, setChannel] = useState<Partial<IChannel> | null>(null);
  const [channelPosts, setChannelPosts] = useState<IPost[]>([]);

  const params = useParams();

  useEffect(() => {
    // Clear channel states when switching between channel routes
    setChannel(null);
  }, [params.id]);

  useEffect(() => {
    // Get channel by id
    (async () => {
      const snap = await getDoc(doc(db, "channels", params.id!));

      if (snap.exists()) {
        setChannel(snap.data());
      } else {
        setChannel(null);
      }
    })();
  }, [params.id]);

  useEffect(() => {
    // Fetch all posts of the channel
    const unsub = onSnapshot(
      query(collection(db, "channels", params.id!, "posts")),
      (snapshot) => {
        setChannelPosts(snapshot.docs.map((doc) => doc.data() as IPost));
      }
    );

    return unsub;
  }, [params.id]);

  const firstPost = channelPosts.find(({ isFirstPost }) => isFirstPost);
  const postReplies = channelPosts.filter(({ isFirstPost }) => !isFirstPost);

  const sortedReplies = sortByDate(postReplies);

  if (!channel) {
    return null;
  }

  return (
    <Box css={{ paddingTop: 8 }}>
      <Text as="h1" fontWeight="bold" css={{ padding: "0 3rem", fontSize: 36 }}>
        {channel.name}
      </Text>
      <Box as="hr" css={{ marginTop: "2rem", marginBottom: "1rem" }} />
      {firstPost && (
        <Box css={{ display: "flex", padding: "0.75rem 3rem" }}>
          <Avatar css={{ marginRight: "1rem" }} src={firstPost.authorImage} />

          <div>
            <Box css={{ display: "flex", alignItems: "baseline" }}>
              <Text fontSize="lg" fontWeight="bold" css={{ marginRight: 8 }}>
                {firstPost?.authorName}
              </Text>
              <Text fontSize="xs">
                at {new Date(firstPost.createdAt.toDate()).toLocaleString()}
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
      )}

      <Box css={{ padding: "2rem 6rem 0" }}>
        {!!sortedReplies.length && (
          <Text fontWeight="bold" css={{ marginBottom: 4 }}>
            Replies
          </Text>
        )}
        {sortedReplies.map(
          ({ id, text, authorImage, authorName, createdAt }) => (
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
                      at {new Date(createdAt.toDate()).toLocaleString()}
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
          )
        )}

        <NewPost isFirstPost={!firstPost} channelName={channel.name!} />
      </Box>
    </Box>
  );
}

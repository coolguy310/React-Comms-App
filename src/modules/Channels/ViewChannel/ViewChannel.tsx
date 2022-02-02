import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import Textarea from "components/forms/Textarea/Textarea";
import db from "../../../firebase";
import { IChannel, IPost } from "utils/types";
import { getAuth } from "firebase/auth";
import Text from "components/ui/Text/Text";
import Box from "components/ui/Box/Box";
import Avatar from "components/ui/Avatar/Avatar";

export default function ViewChannel() {
  const [channel, setChannel] = useState<Partial<IChannel> | null>(null);
  const [channelPosts, setChannelPosts] = useState<IPost[]>([]);
  const [newPostText, setNewPostText] = useState<string>("");

  const params = useParams();
  const auth = getAuth();

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
    // Fetch channel posts
    const unsub = onSnapshot(
      query(collection(db, "posts"), where("channelId", "==", params.id!)),
      (snapshot) => {
        setChannelPosts(
          snapshot.docs.map((doc) => ({
            ...(doc.data() as Omit<IPost, "id">),
            id: doc.id,
          }))
        );
      }
    );

    return unsub;
  }, [params.id]);

  const submitReply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newPostText.trim()) return; // Text can not be empty

    // Add to firebase posts collection
    await addDoc(collection(db as Firestore, "posts"), {
      text: newPostText,
      authorEmail: auth.currentUser!.email,
      authorImage: auth.currentUser!.photoURL,
      authorName: auth.currentUser!.displayName,
      isFirstPost: !channelPosts.length,
      channelId: params.id,
      createdAt: new Date(),
    });

    setNewPostText(""); // Reset text
  };

  const firstPost = channelPosts.find(({ isFirstPost }) => isFirstPost);
  const postReplies = channelPosts.filter(({ isFirstPost }) => !isFirstPost);

  let placeholderText = "Write a comment and hit enter to send";

  if (!firstPost)
    placeholderText = "Write the first post and hit enter to send";

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
            <Text>{firstPost.text}</Text>
          </div>
        </Box>
      )}

      <Box css={{ padding: "2rem 6rem 0" }}>
        {!!postReplies.length && (
          <Text fontWeight="bold" css={{ marginBottom: 4 }}>
            Replies
          </Text>
        )}
        {postReplies.map(({ id, text, authorImage, authorName, createdAt }) => (
          <div key={id}>
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
                <Text fontSize="sm">{text}</Text>
              </Box>
            </Box>
          </div>
        ))}

        <Box
          as="form"
          css={{ padding: "0.75rem 0.5rem", display: "flex" }}
          onSubmit={submitReply}
        >
          <Avatar
            src={auth.currentUser!.photoURL as string}
            css={{
              marginRight: "1rem",
            }}
          />

          <Textarea
            required
            value={newPostText}
            onChange={(event) => setNewPostText(event.target.value)}
            placeholder={placeholderText}
          />
        </Box>
      </Box>
    </Box>
  );
}

import React, { useEffect, useState } from "react";
import Avatar from "components/ui/Avatar/Avatar";
import Box from "components/ui/Box/Box";
import Button from "components/ui/Button/Button";
import { getAuth } from "firebase/auth";
import { MentionsInput, Mention, SuggestionDataItem } from "react-mentions";
import { addDoc, collection, Firestore, onSnapshot } from "firebase/firestore";
import db from "../../../../../firebase";
import { nanoid } from "nanoid";
import { useParams } from "react-router-dom";

interface NewPostProps {
  isFirstPost: boolean;
  channelName: string;
}

export default function NewPost({ isFirstPost, channelName }: NewPostProps) {
  const [newPostText, setNewPostText] = useState<string>("");
  const [mentions, setMentions] = useState<SuggestionDataItem[]>([]);
  const [userSuggestions, setUserSuggestions] = useState<SuggestionDataItem[]>(
    []
  );

  const auth = getAuth();
  const params = useParams();

  useEffect(() => {
    // Fetch users and map to userSuggestions state
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      setUserSuggestions(
        snapshot.docs.map((doc) => ({
          display: doc.data().name,
          id: doc.id,
        }))
      );
    });

    return unsub;
  }, []);

  const submitReply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newPostText.trim()) return; // Text should not be empty

    setNewPostText(""); // Reset text

    // Add to firebase posts collection
    await addDoc(collection(db as Firestore, "posts"), {
      text: newPostText,
      authorId: auth.currentUser!.uid,
      authorEmail: auth.currentUser!.email,
      authorImage: auth.currentUser!.photoURL,
      authorName: auth.currentUser!.displayName,
      isFirstPost,
      channelId: params.id,
      triageId: nanoid(),
      mentions: mentions.map(({ id }) => id), // Map mentions into an array of mentioned user ids
      channelName,
      createdAt: new Date(),
    });
  };

  let placeholderText = "Write a comment and hit enter to send";

  if (isFirstPost)
    placeholderText = "Write the first post and hit enter to send";

  return (
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

      <Box css={{ width: "100%" }}>
        <MentionsInput
          value={newPostText}
          onChange={(event, value, newPlainTextValue, mentions) => {
            setNewPostText(value);
            setMentions(mentions);
          }}
          allowSpaceInQuery
          placeholder={placeholderText}
          className="mentions"
          allowSuggestionsAboveCursor
        >
          <Mention
            trigger="@"
            markup="<span id='__id__' class='post-mention'>@__display__</span>"
            data={userSuggestions}
            className="mentions__mention"
          />
        </MentionsInput>

        <Box
          css={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}
        >
          <Button
            type="submit"
            variant="bordered"
            css={{
              width: "12rem",
              padding: "0.5rem 1rem",
              backgroundColor: "$gray6",
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

import React, { useState } from "react";
import Avatar from "components/ui/Avatar/Avatar";
import Box from "components/ui/Box/Box";
import Button from "components/ui/Button/Button";
import { getAuth } from "firebase/auth";
import { MentionsInput, Mention, SuggestionDataItem } from "react-mentions";
import { doc, Firestore, setDoc } from "firebase/firestore";
import db from "../../../firebase";
import { nanoid } from "nanoid";
import { useParams } from "react-router-dom";
import { useRegisterActions } from "kbar";
import { useAppContext } from "utils/Context/Context";

interface PostReplyProps {
  replyTo: string;
  channelName: string;
}

export default function PostReply({ channelName, replyTo }: PostReplyProps) {
  const [newReplyText, setReplyText] = useState<string>("");
  const [mentions, setMentions] = useState<SuggestionDataItem[]>([]);

  const { users } = useAppContext();

  const auth = getAuth();
  const params = useParams();

  const submitReply = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!newReplyText.trim()) return; // Text should not be empty

    setReplyText(""); // Reset text

    const postPayload = {
      text: newReplyText,
      authorId: auth.currentUser!.uid,
      authorEmail: auth.currentUser!.email,
      authorImage: auth.currentUser!.photoURL,
      authorName: auth.currentUser!.displayName,
      channelId: params.id,
      id: nanoid(),
      mentions: mentions.map(({ id }) => id), // Map mentions into an array of mentioned user ids
      channelName,
      createdAt: new Date().toISOString(),
      done: false,
      replyTo,
      triagedUntil: null,
    };

    // Add post to channel
    await setDoc(
      doc(db as Firestore, "channels", params.id!, "posts", postPayload.id),
      postPayload
    );
  };

  // Register hotkey for submitting post
  useRegisterActions(
    [
      {
        id: "reply",
        name: "Submit Reply",
        keywords: `submit post reply`,
        shortcut: ["r"],
        perform: () => submitReply(),
      },
    ],
    [newReplyText]
  );

  let placeholderText = "Write a reply here";

  const userSuggestions: SuggestionDataItem[] = users.map(({ uid, name }) => ({
    id: uid,
    display: name,
  }));

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
          value={newReplyText}
          onChange={(event, value, newPlainTextValue, mentions) => {
            setReplyText(value);
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
          <Mention
            trigger="@@"
            markup="<span id='__id__' class='post-request-response'>@@__display__</span>"
            data={userSuggestions}
            className="mentions__request-response"
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

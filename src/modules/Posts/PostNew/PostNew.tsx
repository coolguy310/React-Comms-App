import React from "react";
import Box from "components/ui/Box/Box";
import { MentionsInput, Mention } from "react-mentions";
import Flex from "components/ui/Flex/Flex";
import Text from "components/ui/Text/Text";
import Input from "components/forms/Input/Input";
import usePostNewHook from "./usePostNewHook";
import ReactTags from "react-tag-autocomplete";

export default function PostNew() {
  const {
    recipients,
    channels,
    newPostSubject,
    setNewPostSubject,
    newPostText,
    setNewPostText,
    userSuggestions,
    setMentions,
    onTagAddition,
    onTagDelete,
  } = usePostNewHook();

  return (
    <Box as="form" css={{ padding: "0.75rem 2.5rem" }}>
      <Flex justifyBetween alignCenter css={{ paddingRight: "6rem" }}>
        <Text as="h1" fontWeight="bold" css={{ fontSize: 36 }}>
          Write a new post
        </Text>
      </Flex>
      <Box as="hr" css={{ marginTop: "1rem", marginBottom: "1rem" }} />

      <Flex alignCenter>
        <Text css={{ width: "4rem" }}>To:</Text>
        <ReactTags
          placeholderText="Add recipients"
          tags={recipients}
          suggestions={channels}
          onDelete={onTagDelete}
          onAddition={onTagAddition}
          // tagComponent={({ tag, removeButtonText, onDelete }) => {
          //   return (
          //     <button
          //       type="button"
          //       // title={`${removeButtonText}: ${tag.name}`}
          //       // onClick={onDelete}
          //     >
          //       {tag.name}
          //     </button>
          //   );
          // }}
        />
      </Flex>
      <Box as="hr" css={{ margin: "0.5rem 0" }} />
      <Input
        value={newPostSubject}
        onChange={(event) => setNewPostSubject(event.target.value)}
        css={{
          border: 0,
          padding: 0,
          background: "transparent",
          borderBottom: "1px solid lightgray",
          fontWeight: "bold",
          marginBottom: 8,
          "&::placeholder": {
            color: "$gray9",
          },
        }}
        placeholder="Subject"
      />

      <Box className="newPost" css={{ width: "100%" }}>
        <MentionsInput
          value={newPostText}
          onChange={(event, value, newPlainTextValue, mentions) => {
            setNewPostText(value);
            setMentions(mentions);
          }}
          allowSpaceInQuery
          placeholder="Body"
          className="mentions"
          allowSuggestionsAboveCursor
        >
          <Mention
            trigger="@"
            markup="<span id='__id__' class='post-mention'>@__display__</span>"
            data={userSuggestions}
            className="mentions__mention"
            onAdd={(id, name) => onTagAddition({ id, name })}
          />
          <Mention
            trigger="@@"
            markup="<span id='__id__' class='post-request-response'>@@__display__</span>"
            data={userSuggestions}
            className="mentions__request-response"
            onAdd={(id, name) => onTagAddition({ id, name })}
          />
        </MentionsInput>

        <Flex justifyEnd alignCenter css={{ marginTop: 16 }}>
          <Box css={{ padding: "0.5rem 1rem" }} as="kbd">
            CTRL
          </Box>
          <Box as="kbd" css={{ margin: "0 0.75rem", padding: "0.5rem 1rem" }}>
            ENTER
          </Box>
          <Text>to send</Text>
        </Flex>
      </Box>
    </Box>
  );
}

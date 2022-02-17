import React from "react";
import Box from "components/ui/Box/Box";
import { MentionsInput, Mention } from "react-mentions";
import Flex from "components/ui/Flex/Flex";
import Text from "components/ui/Text/Text";
import Input from "components/forms/Input/Input";
import usePostNewHook from "./usePostNewHook";
import ReactTags from "react-tag-autocomplete";
import { IoMdClose } from "react-icons/io";
import Avatar from "components/ui/Avatar/Avatar";

const tagPrefix = (photoURL?: string) =>
  photoURL ? (
    <Avatar
      src={photoURL}
      css={{
        width: "1rem",
        height: "1rem",
      }}
    />
  ) : (
    "#"
  );

export default function PostNew() {
  const {
    tagRef,
    recipients,
    channels,
    users,
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
          ref={tagRef}
          placeholderText="Add recipients"
          tags={recipients}
          suggestions={[...channels, ...users]}
          onDelete={onTagDelete}
          onAddition={onTagAddition}
          tagComponent={({ tag, onDelete }: any) => {
            return (
              <Box
                css={{
                  display: "inline-flex",
                  background: "$gray3",
                  border: "1px solid lightgray",
                  padding: "0.25rem 0.5rem 0.25rem 0.75rem",
                  marginRight: 8,
                  borderRadius: 6,
                  alignItems: "center",
                }}
              >
                {tagPrefix(tag.photoURL)}
                <Text css={{ marginRight: 4 }}>&nbsp; {tag.name}</Text>
                <Flex as="button" onClick={onDelete}>
                  <IoMdClose />
                </Flex>
              </Box>
            );
          }}
          minQueryLength={1}
          suggestionComponent={({ item }: any) => {
            return (
              <Flex alignCenter>
                {tagPrefix(item.photoURL)}
                <Text>&nbsp;{item.name}</Text>
              </Flex>
            );
          }}
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
          <Box css={{ padding: "0.5rem 1rem", margin: "0 0.75rem" }} as="kbd">
            ⌘
          </Box>
          +
          <Box as="kbd" css={{ margin: "0 0.75rem", padding: "0.5rem 1rem" }}>
            RETURN
          </Box>
          <Text>to send</Text>
        </Flex>
      </Box>
    </Box>
  );
}

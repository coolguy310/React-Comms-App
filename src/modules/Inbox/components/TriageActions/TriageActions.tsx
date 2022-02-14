import React, { useState } from "react";
import Box from "components/ui/Box/Box";
import Button from "components/ui/Button/Button";
import Flex from "components/ui/Flex/Flex";
import Text from "components/ui/Text/Text";
import { Popover } from "react-tiny-popover";
import { triageOptions } from "utils/Hotkeys/inboxHotkeys";
import { IPost } from "utils/types";

interface TriageActionsProps {
  post: IPost;
  markAsDone: (post: IPost, event?: any) => void;
  triagePost: (post: IPost, time: number, event?: any) => void;
}

export default function TriageActions({
  post,
  markAsDone,
  triagePost,
}: TriageActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const content = (
    <Box
      css={{
        padding: "0.5rem",
        backgroundColor: "white",
        borderRadius: 8,
        cursor: "pointer",
        boxShadow: "0px 2px 14px -3px rgba(0,0,0,0.2)",
        minWidth: "18rem",
      }}
    >
      <Flex
        css={{
          padding: 6,
          borderRadius: 6,
          "&:hover": { backgroundColor: "$gray3" },
        }}
        justifyBetween
        alignCenter
        onClick={(event) => markAsDone(post, event)}
      >
        <Text fontSize="sm">Mark as done</Text>
      </Flex>
      {triageOptions.map(({ name, value }) => (
        <Flex
          key={name}
          css={{
            padding: 6,
            borderRadius: 6,
            "&:hover": { backgroundColor: "$gray3" },
          }}
          justifyBetween
          alignCenter
          onClick={(event) => triagePost(post, value, event)}
        >
          <Text fontSize="sm">Remind me {name}</Text>
        </Flex>
      ))}
    </Box>
  );

  return (
    <Popover
      isOpen={isOpen}
      positions={["bottom", "bottom"]}
      align="center"
      onClickOutside={() => setIsOpen(false)}
      padding={5}
      content={content}
    >
      <Button
        variant="bordered"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen(!isOpen);
        }}
        css={{
          padding: "0.25rem 0.5rem",
          backgroundColor: "$gray5",
          fontSize: "small",
        }}
      >
        Actions
      </Button>
    </Popover>
  );
}

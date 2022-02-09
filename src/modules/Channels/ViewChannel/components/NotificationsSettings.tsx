/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Button from "components/ui/Button/Button";
import { GoCheck } from "react-icons/go";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { Popover } from "react-tiny-popover";
import Box from "components/ui/Box/Box";
import Flex from "components/ui/Flex/Flex";
import Text from "components/ui/Text/Text";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import db from "../../../../firebase";
import { getAuth } from "firebase/auth";
import { IChannel, IUser } from "utils/types";
import { useRegisterActions } from "kbar";

interface NotificationsSettingsProps {
  channel: IChannel;
}

const notificationOptions = [
  {
    name: "All posts and replies",
    value: "all",
  },
  {
    name: "Only when i'm mentioned",
    value: undefined, // This is the default preference choice
  },
];

export default function NotificationsSettings({
  channel,
}: NotificationsSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifyPreferences, setNotifyPreferences] = useState<any>({});
  const auth = getAuth();

  useEffect(() => {
    // Fetch all `notifyPreferences` of user by id
    const unsub = onSnapshot(
      doc(db, "users", auth.currentUser!.uid),
      (snap) => {
        const user = snap.data() as IUser;
        if (user.notifyPreferences) {
          setNotifyPreferences(user!.notifyPreferences);
        }
      }
    );

    return unsub;
  }, [auth.currentUser]);

  // Change the channel notification preference for the current user
  const changeNotificationPreference = async (option?: string) => {
    await updateDoc(doc(db, "users", auth.currentUser!.uid), {
      notifyPreferences: { [channel.id]: option || null },
    });

    setIsOpen(false); // Close popover menu
  };

  // Register hotkeys for notification change triggers
  useRegisterActions(
    [
      {
        id: "all-posts",
        name: "Notify all posts and replies",
        keywords: `notify all post reply`,
        shortcut: ["a", "n"],
        section: "Notifications",
        perform: () => changeNotificationPreference("all"),
      },
      {
        id: "only-mentioned-posts",
        name: "Notify only posts i'm mentioned in",
        keywords: `notify only post mentioned`,
        shortcut: ["m", "n"],
        section: "Notifications",
        perform: () => changeNotificationPreference(),
      },
    ],
    []
  );

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
      {notificationOptions.map(({ name, value }) => {
        // Check if the current notification preference of that channel is equal to the value
        const isSelected = notifyPreferences[channel.id] == value;

        return (
          <Flex
            key={name}
            css={{
              padding: 6,
              borderRadius: 6,
              "&:hover": { backgroundColor: "$gray3" },
            }}
            justifyBetween
            alignCenter
            onClick={() => changeNotificationPreference(value)}
          >
            <Text>{name}</Text>
            {isSelected && <GoCheck />}
          </Flex>
        );
      })}
    </Box>
  );

  return (
    <Popover
      isOpen={isOpen}
      positions={["bottom", "right"]}
      align="end"
      onClickOutside={() => setIsOpen(false)}
      padding={5}
      content={content}
    >
      <Button
        onClick={() => setIsOpen(!isOpen)}
        css={{
          padding: 6,
          fontSize: 24,
          color: "$gray10",
          height: 36,
          boxShadow: "0px 2px 14px -3px rgba(0,0,0,0.2)",
          svg: {
            marginRight: 0,
          },
        }}
      >
        <MdOutlineNotificationsActive />
      </Button>
    </Popover>
  );
}

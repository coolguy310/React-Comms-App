/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import Avatar from "components/ui/Avatar/Avatar";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  Firestore,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useRegisterActions } from "kbar";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import "react-tippy/dist/tippy.css";
import { useAppContext } from "utils/Context/Context";
import { IUser } from "utils/types";
import db from "../../../firebase";
import Text from "components/ui/Text/Text";

const initialChannelDetails = {
  name: "",
  description: "",
  classification: "public",
};

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
    <Text css={{ flexShrink: 0 }}>Everyone in: </Text>
  );

export default function useChannelCreateHook() {
  const [channelDetails, setChannelDetails] = useState(initialChannelDetails);
  const [isOpen, setIsOpen] = useState(false);
  const [invitees, setInvitees] = useState<any[]>([]);

  const { users, setUsers, channels } = useAppContext();
  const auth = getAuth();
  let navigate = useNavigate();

  const { name, description, classification } = channelDetails;

  // Listen for CTRL + Enter then, trigger handleSubmit()
  useEffect(() => {
    function handleCtrlEnter(event: any) {
      if (
        event.ctrlKey &&
        event.key === "Enter" &&
        event.defaultPrevented === false
      ) {
        handleSubmit();
      }
    }
    window.addEventListener("keydown", handleCtrlEnter, true);
    return () => window.removeEventListener("keydown", handleCtrlEnter, true);
  }, [channelDetails, invitees]);

  useEffect(() => {
    // Fetch users and map to users state
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map((doc) => doc.data() as IUser));
    });

    return unsub;
  }, [auth.currentUser]);

  const handleChange = (name: string, value: any) => {
    setChannelDetails({
      ...channelDetails,
      [name]: value,
    });
  };

  const onClose = () => {
    setIsOpen(false);
    setChannelDetails(initialChannelDetails);
    setInvitees([]);
  };

  // Gets all user and channel invitees, then merges and returns all individual invitees of both the channel and single tags
  const expandAllInvitees = () => {
    // Invitee is a single user if it contains a photoURL
    const singleInvites = invitees.filter(({ photoURL }) => photoURL);

    // Expand all members of all specified channels
    const expandedChannelInvites = invitees
      .filter(({ photoURL }) => !photoURL)
      .flatMap(
        ({ id }) => channels.find((channel) => channel.id === id)?.invitees
      );

    // Then remove duplicate invitees and return array
    return [...expandedChannelInvites, ...singleInvites].filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );
  };

  const handleSubmit = async () => {
    if (!name) return;

    const payload = {
      id: nanoid(),
      creatorId: auth!.currentUser?.uid,
      name,
      description,
      invitees: expandAllInvitees(),
      classification,
      createdAt: new Date().toISOString(),
    };

    // Add to channel collection
    await setDoc(doc(db as Firestore, "channels", payload.id), payload);

    // Then route to the newly created channel
    navigate(`/${payload.id}`);

    // Close modal and reset channel name
    onClose();
  };

  // Remove channel/user from invitees
  const onTagDelete = useCallback(
    (tagIndex) => {
      setInvitees(invitees.filter((_, i) => i !== tagIndex));
    },
    [invitees]
  );

  // Add channel/user to list of invitees
  const onTagAddition = useCallback(
    (newTag) => {
      // Avoid repitition of invitees
      if (!invitees.find(({ id }) => id === newTag.id)) {
        // If tag belongs to a user, append the user's photoURL
        const photoURL = users.find(({ uid }) => uid === newTag.id)?.photoURL;
        setInvitees([...invitees, { ...newTag, photoURL }]);
      }
    },
    [invitees]
  );

  // Register hotkey for opening create channel modal
  useRegisterActions([
    {
      id: "open-channel-modal",
      name: "Create a new channel",
      section: "Channels",
      shortcut: ["n", "c"],
      keywords: "channel new",
      perform: () => setIsOpen(true),
    },
  ]);

  return {
    name,
    description,
    classification,
    invitees,
    users: users.map((user) => ({ ...user, id: user.uid })),
    channels,
    onTagAddition,
    onTagDelete,
    handleChange,
    isOpen,
    setIsOpen,
    onClose,
    tagPrefix,
  };
}

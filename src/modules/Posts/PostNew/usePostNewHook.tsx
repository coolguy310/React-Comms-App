/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { SuggestionDataItem } from "react-mentions";
import {
  collection,
  doc,
  Firestore,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import db from "../../../firebase";
import { nanoid } from "nanoid";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IUser } from "utils/types";
import { useAppContext } from "utils/Context/Context";

export default function usePostNewHook() {
  const [newPostText, setNewPostText] = useState<string>("");
  const [newPostSubject, setNewPostSubject] = useState<string>("");
  const [mentions, setMentions] = useState<SuggestionDataItem[]>([]);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  const auth = getAuth();
  const { channels } = useAppContext();
  let [searchParams] = useSearchParams();
  let navigate = useNavigate();

  // Get the channelId from searchParams
  const channelId = searchParams.get("channelId");

  useEffect(() => {
    // If there's a channelId in the URL searchParams, then update the recipients array with the channel of that id
    if (channelId) {
      const selectedChannel = channels.find(({ id }) => id === channelId);

      if (selectedChannel) setRecipients((prev) => [...prev, selectedChannel]);
    }
  }, [channels, channelId]);

  useEffect(() => {
    // Fetch users and map to users state
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map((doc) => doc.data() as IUser));
    });

    return unsub;
  }, [auth.currentUser]);

  const submitNewPost = async () => {
    if (!newPostText.trim() || !newPostSubject.trim() || !recipients.length)
      return; // Text should not be empty

    setNewPostText(""); // Reset text
    setNewPostSubject(""); // Reset subject

    const postPayload = {
      text: newPostText,
      subject: newPostSubject,
      authorId: auth.currentUser!.uid,
      authorEmail: auth.currentUser!.email,
      authorImage: auth.currentUser!.photoURL,
      authorName: auth.currentUser!.displayName,

      id: nanoid(),
      mentions: mentions.map(({ id }) => id), // Map mentions into an array of mentioned user ids
      createdAt: new Date().toISOString(),
      replyTo: null,
      done: false,
      triagedUntil: null,
    };

    // Add post to each of the recipient channels
    recipients.forEach(async (channel) => {
      await setDoc(
        doc(db as Firestore, "channels", channel.id!, "posts", postPayload.id),
        { ...postPayload, channelId: channel.id }
      );
    });

    navigate(`/${recipients[0].id}`);
  };

  // Remove channel from recipients
  const onTagDelete = useCallback(
    (tagIndex) => {
      setRecipients(recipients.filter((_, i) => i !== tagIndex));
    },
    [recipients]
  );

  // Add channel to list of recipients
  const onTagAddition = useCallback(
    (newTag) => {
      setRecipients([...recipients, newTag]);
    },
    [recipients]
  );

  // Perform onSubmit function once ctrl + enter is clicked
  useEffect(() => {
    function handleCtrlEnter(event: any) {
      if (
        event.ctrlKey &&
        event.key === "Enter" &&
        event.defaultPrevented === false
      ) {
        submitNewPost();
      }
    }
    window.addEventListener("keydown", handleCtrlEnter, true);
    return () => window.removeEventListener("keydown", handleCtrlEnter, true);
  }, [newPostText, newPostSubject, recipients, mentions]);

  const userSuggestions: SuggestionDataItem[] = users.map(({ uid, name }) => ({
    id: uid,
    display: name,
  }));

  return {
    newPostText,
    newPostSubject,
    mentions,
    channels,
    recipients,
    setNewPostText,
    setNewPostSubject,
    setMentions,
    onTagAddition,
    onTagDelete,
    userSuggestions,
  };
}

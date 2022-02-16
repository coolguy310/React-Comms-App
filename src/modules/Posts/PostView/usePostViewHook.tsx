import { useEffect, useState } from "react";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { sortByDate } from "utils/helpers";
import { IChannel, IPost } from "utils/types";
import db from "../../../firebase";

export default function usePostViewHook() {
  const [channel, setChannel] = useState<IChannel | null>(null);
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
        setChannel(snap.data() as IChannel);
      } else {
        setChannel(null);
      }
    })();
  }, [params.id]);

  useEffect(() => {
    // Fetch all posts of the channel
    const unsub = onSnapshot(
      collection(db, "channels", params.id!, "posts"),
      (snapshot) => {
        setChannelPosts(snapshot.docs.map((doc) => doc.data() as IPost));
      }
    );

    return unsub;
  }, [params.id]);

  // Get the first post in the channel
  const firstPost = channelPosts.find(({ id }) => id === params.postId);

  // Get replies to the first post
  const postReplies = channelPosts.filter(
    ({ replyTo }) => replyTo === params.postId
  );

  return { channel, firstPost, replies: sortByDate(postReplies) };
}

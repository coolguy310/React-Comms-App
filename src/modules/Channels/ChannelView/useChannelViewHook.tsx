import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { sortByDate } from "utils/helpers";
import { IChannel, IPost } from "utils/types";
import db from "../../../firebase";
import { useAppContext } from "utils/Context/Context";
import useArrowNavigation from "utils/Hooks/useArrowNavigation";
import usePathMatch from "utils/Hooks/usePathMatch";

export default function useChannelViewHook() {
  const [channel, setChannel] = useState<IChannel | null>(null);
  const [channelPosts, setChannelPosts] = useState<IPost[]>([]);

  const params = useParams();
  const navigate = useNavigate();
  const { activeSection } = useAppContext();

  // Register isActive on channelPosts if the activeSection matches the "/:id" pattern
  const isActive = !!usePathMatch(activeSection, "/:id");

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
    // Fetch all main posts of the channel (posts that do not have a `replyTo` value)
    const unsub = onSnapshot(
      query(
        collection(db, "channels", params.id!, "posts"),
        where("replyTo", "==", null)
      ),
      (snapshot) => {
        setChannelPosts(snapshot.docs.map((doc) => doc.data() as IPost));
      }
    );

    return unsub;
  }, [params.id]);

  const openChannelPost = (post: IPost) => {
    // Route to channel's post
    navigate(`/${params.id}/${post.id}`);
  };

  const { cursor, setHovered, setSelected } = useArrowNavigation(
    isActive,
    channelPosts,
    openChannelPost
  );

  return {
    channel,
    channelPosts: sortByDate(channelPosts),
    cursor,
    isActive,
    setHovered,
    setSelected,
    openChannelPost,
  };
}

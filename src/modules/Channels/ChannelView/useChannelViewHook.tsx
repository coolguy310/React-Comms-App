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
  const [channelPosts, setChannelPosts] = useState<IPost[] | null>(null);

  const params = useParams();
  const navigate = useNavigate();
  const { activeSection } = useAppContext();

  // Register isActive on channelPosts if the activeSection matches the "/:id" pattern
  const isActive = !!usePathMatch(activeSection, "/:id");

  useEffect(() => {
    // Clear channel and channelPost states when switching between channel routes
    setChannel(null);
    setChannelPosts(null);
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
    // If there are no channel posts, route to the `new post` page
    if (channelPosts?.length) {
      navigate(`/${params.id}/${post.id}`);
    } else {
      // else, Route to channel's post
      navigate(`/new?channelId=${channel!.id}`);
    }
  };

  // When there are no channelPosts, pass a non-empty array as list into the `useArrowNavigation`. This is so that the onSelect callback can be triggered
  const navigationList = channelPosts?.length ? channelPosts : ["create"];

  const { cursor, setHovered, setSelected } = useArrowNavigation(
    isActive,
    navigationList,
    openChannelPost
  );

  return {
    channel,
    channelPosts: channelPosts && sortByDate(channelPosts),
    cursor,
    isActive,
    setHovered,
    setSelected,
    openChannelPost,
  };
}

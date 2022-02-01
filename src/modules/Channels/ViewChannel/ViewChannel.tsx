import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import Input from "components/forms/Input/Input";
import db from "../../../firebase";
import { IChannel, IPost } from "utils/types";
import { getAuth } from "firebase/auth";

export default function ViewChannel() {
  const [channel, setChannel] = useState<Partial<IChannel> | null>(null);
  const [channelPosts, setChannelPosts] = useState<IPost[]>([]);
  const [newPostText, setNewPostText] = useState<string>("");

  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    setChannel(null);
  }, [params.id]);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "channels", params.id!));

      if (snap.exists()) {
        setChannel(snap.data());
      } else {
        setChannel(null);
      }
    })();
  }, [params.id]);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "posts"), where("channelId", "==", params.id!)),
      (snapshot) => {
        setChannelPosts(
          snapshot.docs.map((doc) => ({
            ...(doc.data() as Omit<IPost, "id">),
            id: doc.id,
          }))
        );
      }
    );

    return unsub;
  }, [params.id]);

  const submitReply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newPostText.trim()) return;

    await addDoc(collection(db as Firestore, "posts"), {
      text: newPostText,
      authorEmail: auth.currentUser!.email,
      authorImage: auth.currentUser!.photoURL,
      authorName: auth.currentUser!.displayName,
      isFirstPost: !channelPosts.length,
      channelId: params.id,
      createdAt: new Date(),
    });

    setNewPostText("");
  };

  const firstPost = channelPosts.find(({ isFirstPost }) => isFirstPost);
  const postReplies = channelPosts.filter(({ isFirstPost }) => !isFirstPost);

  let placeholderText = "Write a comment and hit enter to send";

  if (!firstPost)
    placeholderText = "Write the first post and hit enter to send";

  if (!channel) {
    return null;
  }

  return (
    <div className="pt-2">
      <h1 className="text-4xl font-bold px-12">{channel?.name}</h1>
      <hr className="mt-8 mb-4" />
      {firstPost && (
        <div className="py-3 px-12 flex space-x-4">
          <img
            src={firstPost?.authorImage}
            alt="user"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="flex items-baseline space-x-2">
              <p className="font-bold text-lg">{firstPost?.authorName}</p>
              <p className="text-xs">
                at {new Date(firstPost?.createdAt.toDate()).toLocaleString()}
              </p>
            </div>
            <p>{firstPost?.text}</p>
          </div>
        </div>
      )}

      <div className="px-24 pt-8">
        {!!postReplies.length && (
          <p className="font-semibold text-md mb-1">Replies</p>
        )}
        {postReplies.map(({ id, text, authorImage, authorName, createdAt }) => (
          <div key={id}>
            <hr />
            <div className="py-3 px-2 flex space-x-4">
              <img
                src={authorImage}
                alt="user"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="flex items-baseline space-x-2">
                  <p className="font-bold text-sm">{authorName}</p>
                  <p className="text-xs">
                    at {new Date(createdAt.toDate()).toLocaleString()}
                  </p>
                </div>
                <p className="text-sm">{text}</p>
              </div>
            </div>
          </div>
        ))}

        <form onSubmit={submitReply} className="py-3 px-2 flex space-x-4">
          <img
            src={auth.currentUser!.photoURL as string}
            alt="user"
            className="w-8 h-8 rounded-full"
          />
          <Input
            required
            value={newPostText}
            onChange={(event) => setNewPostText(event.target.value)}
            placeholder={placeholderText}
          />
        </form>
      </div>
    </div>
  );
}

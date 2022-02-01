import db from "../../../firebase";
import { onSnapshot, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IChannel } from "utils/types";
import CreateChannelModal from "../CreateChannel/CreateChannelModal";

export default function ChannelsList() {
  const [channelList, setChannelList] = useState<IChannel[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "channels"), (snapshot) => {
      setChannelList(
        snapshot.docs.map((doc) => ({
          ...(doc.data() as Omit<IChannel, "id">),
          id: doc.id,
        }))
      );
    });

    return unsub;
  }, []);

  return (
    <div className="mt-20">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold">CHANNELS</p>

        <CreateChannelModal />
      </div>
      <div className="mt-2 text-lg">
        {channelList.map(({ id, name }) => (
          <Link key={id} to={`/${id}`}>
            <p className="cursor-pointer hover:font-semibold mb-2"># {name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

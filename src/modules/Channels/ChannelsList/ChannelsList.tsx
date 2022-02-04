import db from "../../../firebase";
import { onSnapshot, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IChannel } from "utils/types";
import CreateChannelModal from "../CreateChannel/CreateChannelModal";
import Box from "components/ui/Box/Box";
import Text from "components/ui/Text/Text";
import { sortByDate } from "utils/helpers";

export default function ChannelsList() {
  const [channelList, setChannelList] = useState<IChannel[]>([]);

  useEffect(() => {
    // Fetch channels
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

  const sortedChannels = sortByDate(channelList);

  return (
    <Box css={{ marginTop: "5rem" }}>
      <Box
        css={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text fontSize="sm" fontWeight="bold">
          CHANNELS
        </Text>

        <CreateChannelModal />
      </Box>
      <Box css={{ marginTop: 12, fontSize: "large" }}>
        {sortedChannels.map(({ id, name }) => (
          <Link key={id} to={`/${id}`}>
            <Text
              css={{
                cursor: "pointer",
                marginBottom: 8,
                "&:hover": { fontWeight: "bold" },
              }}
            >
              # {name}
            </Text>
          </Link>
        ))}
      </Box>
    </Box>
  );
}

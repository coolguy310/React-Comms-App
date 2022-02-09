/* eslint-disable react-hooks/exhaustive-deps */
import db from "../../../firebase";
import { onSnapshot, collection } from "firebase/firestore";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { IChannel } from "utils/types";
import CreateChannelModal from "../CreateChannel/CreateChannelModal";
import Box from "components/ui/Box/Box";
import Text from "components/ui/Text/Text";
import { sortByDate } from "utils/helpers";
import { useAppContext } from "utils/Context/Context";
import { useChannelsHotkeys } from "utils/Hotkeys/channelsHotkeys";

export default function ChannelsList() {
  const { channels, setChannels } = useAppContext();

  useChannelsHotkeys({ channels });

  useEffect(() => {
    // Fetch channels
    const unsub = onSnapshot(collection(db, "channels"), (snapshot) => {
      setChannels(snapshot.docs.map((doc) => doc.data() as IChannel));
    });

    return unsub;
  }, []);

  const sortedChannels = sortByDate(channels);

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
                marginBottom: 12,
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

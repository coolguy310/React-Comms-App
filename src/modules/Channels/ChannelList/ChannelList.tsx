/* eslint-disable react-hooks/exhaustive-deps */
import db from "../../../firebase";
import { onSnapshot, collection } from "firebase/firestore";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IChannel } from "utils/types";
import ChannelCreate from "../ChannelCreate/ChannelCreate";
import Box from "components/ui/Box/Box";
import Text from "components/ui/Text/Text";
import { sortByDate } from "utils/helpers";
import { useAppContext } from "utils/Context/Context";
import { useChannelsHotkeys } from "utils/Hotkeys/channelsHotkeys";
import useArrowNavigation from "utils/Hooks/useArrowNavigation";

export default function ChannelList() {
  const { activeSection, channels, setChannels } = useAppContext();
  const navigate = useNavigate();

  useChannelsHotkeys({ channels });

  const isActive = activeSection === "channels";

  useEffect(() => {
    // Fetch channels
    const unsub = onSnapshot(collection(db, "channels"), (snapshot) => {
      setChannels(snapshot.docs.map((doc) => doc.data() as IChannel));
    });

    return unsub;
  }, []);

  // Route to a channel
  const goToChannel = async (channel: IChannel) => {
    navigate(`/${channel.id}`);
  };

  const { cursor, setHovered, setSelected } = useArrowNavigation(
    isActive,
    channels,
    goToChannel
  );

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

        <ChannelCreate />
      </Box>
      <Box css={{ marginTop: 12 }}>
        {sortedChannels.map((channel, i) => (
          <Link key={channel.id} to={`/${channel.id}`}>
            <Text
              className={`item ${isActive && i === cursor ? "active" : ""}`}
              onMouseEnter={() => setHovered(channel)}
              onMouseLeave={() => setHovered(undefined)}
              onClick={() => {
                setSelected(channel);
                goToChannel(channel);
              }}
              css={{
                cursor: "pointer",
                padding: "6px 0",
                "&:hover": { background: "#a3a2a23a", fontWeight: "bold" },
                "&.active": {
                  background: "#a3a2a23a",
                },
              }}
            >
              # {channel.name}
            </Text>
          </Link>
        ))}
      </Box>
    </Box>
  );
}

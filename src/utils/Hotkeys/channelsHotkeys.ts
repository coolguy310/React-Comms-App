/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { useRegisterActions } from "kbar";

// need to get data
import { IChannel } from "../types";
import { useNavigate } from "react-router-dom";

const searchId = "channels1";

interface ChannelsHotkeysProps {
  channels: IChannel[];
}

export function useChannelsHotkeys({ channels }: ChannelsHotkeysProps) {
  const navigate = useNavigate();

  // map channels into search options for hotkeys
  const searchActions = useMemo(() => {
    return channels.map(({ name, id }, index) => ({
      id: name,
      parent: searchId,
      name,
      keywords: `# ${id}`,
      shortcut: ["c", `${index + 1}`],
      section: "Channels",
      perform: () => navigate(`/${id}`),
    }));
  }, [channels]);

  const rootSearchAction = useMemo(
    () =>
      searchActions.length
        ? {
            id: searchId,
            name: "View Channels",
            shortcut: ["/"],
            keywords: "channel #",
            section: "Channels",
          }
        : null,
    [searchActions]
  );

  // Register channel hotkeys
  useRegisterActions([rootSearchAction!, ...searchActions].filter(Boolean), [
    searchActions,
  ]);
}

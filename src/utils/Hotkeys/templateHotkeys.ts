/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { useRegisterActions } from "kbar";

// need to get data
import { HotkeyActionProps } from "../types";

const searchId = "channels1";

const entityTypes = {
  M: "ma",
  C: "co",
  I: "in",
};

export function useChannelsHotkeys({ onClickLink }: HotkeyActionProps) {
  const searchActions = useMemo(() => {
    const actions = [];
    actions.push({
      id: "m1",
      parent: searchId,
      name: "M1",
      keywords: "maa AB-1 Horses",
      section: entityTypes.M,
      perform: () => onClickLink("/m/m1"),
    });
    actions.push({
      id: "m2",
      parent: searchId,
      name: "M2",
      keywords: "maa CD-2 Houses",
      section: entityTypes.M,
      perform: () => onClickLink("/m/m2"),
    });
    actions.push({
      id: "c1",
      parent: searchId,
      name: "C1",
      keywords: "coo XY-1 Joe",
      section: entityTypes.C,
      perform: () => onClickLink("/c/c1"),
    });
    actions.push({
      id: "c2",
      parent: searchId,
      name: "C2",
      keywords: "coo QR-2 Ava",
      section: entityTypes.C,
      perform: () => onClickLink("/c/c2"),
    });
    return actions;
  }, []);

  const rootSearchAction = useMemo(
    () =>
      searchActions.length
        ? {
            id: searchId,
            name: "Search...",
            shortcut: ["?"],
            keywords: "find",
            section: "Search",
          }
        : null,
    [searchActions]
  );

  useRegisterActions([rootSearchAction!, ...searchActions].filter(Boolean));
}

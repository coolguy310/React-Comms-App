import { HotkeyActionProps } from "../types";

export const defaultHotkeys = ({ onClickLink }: HotkeyActionProps) => {
  return [
    {
      id: "inbox",
      name: "Go to Inbox",
      shortcut: ["g", "i"],
      keywords: "inbox",
      perform: () => onClickLink("/"),
    },
    {
      id: "compose",
      name: "Compose a new post",
      shortcut: ["c"],
      keywords: "compose new",
      perform: () => onClickLink("/new"),
    },
    {
      id: "open-menu",
      name: "Open Comms commands",
      shortcut: ["⌘", "k"],
      keywords: "commands list",
    },
  ];
};

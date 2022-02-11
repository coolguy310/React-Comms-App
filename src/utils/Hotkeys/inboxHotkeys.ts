import { useRegisterActions } from "kbar";

// need to get data
import { IPost } from "../types";

const searchId = "inbox1";

interface InboxHotkeysProps {
  post?: IPost | null;
  markAsDone: (post: IPost) => void;
}

export function useInboxHotkeys({ post, markAsDone }: InboxHotkeysProps) {
  const rootSearchAction = [
    {
      id: searchId,
      name: "Inbox Actions",
      keywords: "inbox #",
      shortcut: ["a", "i"],
      section: "Inbox",
    },
    {
      id: "done",
      parent: searchId,
      name: "Mark as Done",
      keywords: `mark done triage`,
      shortcut: ["e"],
      section: "Inbox",
      perform: () => post && markAsDone(post),
    },
  ];

  // Register hotkeys for inbox actions
  useRegisterActions(rootSearchAction, [post]);
}

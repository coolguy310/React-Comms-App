import { useRegisterActions } from "kbar";

// need to get data
import { IPost } from "../types";
// import { useNavigate } from "react-router-dom";

const searchId = "inbox1";

interface InboxHotkeysProps {
  post?: IPost | null;
}

export function useInboxHotkeys({ post }: InboxHotkeysProps) {
  // const navigate = useNavigate();

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
      // section: "Inbox",
      // perform: () => onClickLink(`/${id}`),
    },
  ];

  // Register hotkeys for inbox actions
  useRegisterActions(rootSearchAction, [post]);
}

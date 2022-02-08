interface DefaultActionProps {
  onClickLink: (path: string) => void;
}

export const defaultHotkeys = ({ onClickLink }: DefaultActionProps) => {
  return [
    {
      id: "inbox",
      name: "Inbox",
      shortcut: ["i"],
      keywords: "inbox",
      perform: () => onClickLink("/"),
    },
    // {
    //   id: "contacts",
    //   name: "Contacts",
    //   shortcut: ["c"],
    //   keywords: "contact",
    //   perform: () => onClickLink("/contacts"),
    // },
    // {
    //   id: "search",
    //   name: "Search",
    //   shortcut: ["s"],
    //   keywords: "search",
    //   perform: () => onClickLink("/search")
    // }
  ];
};

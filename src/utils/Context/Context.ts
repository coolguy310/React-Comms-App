import { createContext, useContext } from "react";
import { IChannel, IPost, IUser } from "utils/types";

interface AppContextProps {
  channels: IChannel[];
  setChannels: (channels: IChannel[]) => void;
  users: IUser[];
  setUsers: (channels: IUser[]) => void;
  inbox: IPost[] | null;
  setInbox: (inbox: IPost[]) => void;
  activeSection: "channels" | string;
  setActiveSection: (section?: any) => void;
}

const AppContext = createContext<AppContextProps>({
  channels: [],
  setChannels: () => {},
  inbox: [],
  setInbox: () => {},
  users: [],
  setUsers: () => {},
  activeSection: "/",
  setActiveSection: () => {},
}); // Here, we are initializing our context states

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;

export const useAppContext = () => useContext(AppContext);

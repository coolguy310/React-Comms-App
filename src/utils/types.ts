export interface IUser {
  uid: string;
  name: string;
  authProvider: string;
  email: string;
  photoURL: string;
  phoneNumber: string;
  notifyPreferences?: { [channelId: string]: boolean };
}

export interface IChannel {
  id: string;
  name: string;
  description?: string;
  classification: "public" | "private";
  creatorId: string;
  createdAt: Date;
}

export interface IPost {
  text: string;
  authorId: string;
  authorEmail: string;
  authorImage: string;
  authorName: string;
  channelId: string;
  channelName: string;
  isFirstPost?: boolean;
  id: string;
  mentions: string[];
  createdAt: Date;
}

export interface HotkeyActionProps {
  onClickLink: (path: string) => void;
}

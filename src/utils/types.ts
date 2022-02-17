export interface IUser {
  id?: string;
  uid: string;
  name: string;
  authProvider: string;
  email: string;
  photoURL: string;
  phoneNumber: string;
  notifyPreferences?: { [channelId: string]: string | null };
}

export interface IChannel {
  id: string;
  name: string;
  description?: string;
  invitees: Partial<IUser>[];
  classification: "public" | "private";
  creatorId: string;
  createdAt: Date;
}

export interface IPost {
  subject?: string;
  text: string;
  authorId: string;
  authorEmail: string;
  authorImage: string;
  authorName: string;
  channelId: string;
  channelName: string;
  replyTo: string | null;
  id: string;
  mentions: string[];
  createdAt: Date;
}

export interface HotkeyActionProps {
  onClickLink: (path: string) => void;
}

import { Timestamp } from "firebase/firestore";

export interface IUser {
  uid: string;
  name: string;
  authProvider: string;
  email: string;
  photoURL: string;
  phoneNumber: string;
}

export interface IChannel {
  id: string;
  name: string;
  creatorId: string;
  createdAt: Timestamp;
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
  createdAt: Timestamp;
}

import { Timestamp } from "firebase/firestore";

export interface IChannel {
  id: string;
  name: string;
  createdAt: Timestamp;
}

export interface IPost {
  text: string;
  authorEmail: string;
  authorImage: string;
  authorName: string;
  channelId: string;
  isFirstPost?: boolean;
  id: string;
  createdAt: Timestamp;
}

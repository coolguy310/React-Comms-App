import { Timestamp } from "firebase/firestore";

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
  triageId: string;
  mentions: string[];
  createdAt: Timestamp;
}

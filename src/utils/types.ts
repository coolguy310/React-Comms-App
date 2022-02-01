export interface IChannel {
  id: string;
  name: string;
  createdAt: Date;
}

export interface IReplies {
  text: string;
  authorEmail: string;
  authorImage: string;
  authorName: string;
  channelId: string;
  id: string;
  createdAt: Date;
}

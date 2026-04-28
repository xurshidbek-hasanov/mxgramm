export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface User {
  id: string;
  phoneNumber: string;
  name: string;
}

export type View = 'login' | 'chat';

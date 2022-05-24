export interface Message {
  id: string;
  photoURL?: string;
  name: string;
  date: Date | string | number;
  content: string;
}

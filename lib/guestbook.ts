export type GuestbookEntry = {
  id: number;
  created_at: string;
  name: string;
  message: string;
};

export const GUESTBOOK_COLUMNS = "id, created_at, name, message";

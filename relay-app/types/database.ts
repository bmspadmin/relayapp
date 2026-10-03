export type TransferStatus = "on_track" | "received" | "baton_dropped";
export type ReceiverType = "user" | "workspace" | "group";

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  total_sent: number;
  total_received: number;
  onesignal_id?: string | null;
  created_at: string;
};

export type Transfer = {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string | null;
  file_url: string | null;
  r2_key: string;
  sender_id: string;
  sender_username: string;
  receiver_id: string;
  receiver_username: string;
  receiver_type: ReceiverType;
  status: TransferStatus;
  message: string | null;
  created_at: string;
  expires_at: string;
};

export type SearchResult = {
  type: "user" | "workspace" | "group";
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
  description?: string | null;
};
export interface InviteInterface {
  id?: number;
  email: string;
  status?: string;
  invite_code?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

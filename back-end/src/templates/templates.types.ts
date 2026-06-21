export interface Template {
  id: string;
  user_id: string;
  preset_id: string | null;
  name: string;
  html_content: string;
  created_at: Date;
  updated_at: Date;
}

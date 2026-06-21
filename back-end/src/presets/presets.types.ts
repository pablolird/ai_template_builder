export type OptionalString = string | undefined;

export interface Preset {
  id: string;
  user_id: string;
  name: string;
  business_name: string | null;
  ruc: string | null;
  timbrado: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  created_at: Date;
  updated_at: Date;
}

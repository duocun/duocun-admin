export interface IRegion {
  _id?: string;
  name?: string;
  code?: string;
  lat?: number;
  lng?: number;
  coefficient?: number;
  radius?: number;
  status?: string; // 'active', 'inactive'
  color?: string;
  order?: number;
}

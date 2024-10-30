export type APIResponse = {
  data: MapData[];
  logo?: string;
};

export type MapData = {
  building: string;
  building_code: string;
  building_status: string;
  rooms: Record<string, Room>;
  coords: [number, number];
  distance: number;
  distance_unit: string;
  labels?: Label[];
  logo?: string;
};

export type Label = {
  label: string;
  color?: string;
};

export type Slot = {
  StartTime: string;
  EndTime: string;
  Status: string;
};

export type Room = {
  roomNumber: string;
  slots: Slot[];
};

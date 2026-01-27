export interface Asset {
  id: string;
  name: string;
  type: 'ip_address' | 'pc' | 'peripheral' | 'network_device' | 'mobile_device' | 'printer';
  status: 'active' | 'inactive' | 'maintenance';
  location: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPAddress extends Asset {
  type: 'ip_address';
  ipAddress: string;
  subnet: string;
  gateway?: string;
  dns?: string;
  vlan?: string;
}

export interface PC extends Asset {
  type: 'pc';
  serialNumber: string;
  model: string;
  manufacturer: string;
  operatingSystem: string;
  processor: string;
  memory: string;
  storage: string;
  ipAddress?: string;
}

export interface Peripheral extends Asset {
  type: 'peripheral';
  serialNumber: string;
  model: string;
  manufacturer: string;
  peripheralType: 'keyboard' | 'mouse' | 'monitor' | 'webcam' | 'headset' | 'dockingStation' | 'other';
  connectionType?: string;
}

export interface NetworkDevice extends Asset {
  type: 'network_device';
  serialNumber: string;
  model: string;
  manufacturer: string;
  deviceType: 'router' | 'switch' | 'accessPoint' | 'firewall' | 'modem' | 'other';
  ipAddress?: string;
  macAddress?: string;
  portCount?: number;
}

export interface MobileDevice extends Asset {
  type: 'mobile_device';
  serialNumber: string;
  model: string;
  manufacturer: string;
  deviceType: 'smartphone' | 'tablet' | 'laptop' | 'other';
  operatingSystem: string;
  imei?: string;
  phoneNumber?: string;
}

export interface Printer extends Asset {
  type: 'printer';
  serialNumber: string;
  model: string;
  manufacturer: string;
  printerType: 'laser' | 'inkjet' | 'thermal' | 'dot_matrix' | 'multifunction' | 'other';
  ipAddress?: string;
  isNetworked: boolean;
}

export type AssetType = IPAddress | PC | Peripheral | NetworkDevice | MobileDevice | Printer;

export const ASSET_TYPE_LABELS: Record<AssetType['type'], string> = {
  ip_address: 'IP Address',
  pc: 'PC',
  peripheral: 'Peripheral',
  network_device: 'Network Device',
  mobile_device: 'Mobile Device',
  printer: 'Printer',
};

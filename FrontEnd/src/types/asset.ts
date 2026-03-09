export interface Asset {
  id: string;
  name: string;
  type: string; // 'ip_address' | 'pc' | 'peripheral' | 'network_device' | 'mobile_device' | 'printer' | custom_${id}
  status: 'active' | 'inactive' | 'maintenance';
  location: string;
  assignedTo?: string;
  details?: string;
  parentAssetId?: string;
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
  isWlan?: boolean;
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

export interface AssetTypeField {
  id?: string;
  assetTypeId?: string;
  name: string;
  dataType: 'text' | 'number' | 'date' | 'boolean';
  isRequired: boolean;
  displayOrder: number;
}

export interface AssetTypeDef {
  id: string;
  name: string;
  description?: string;
  isCustom: boolean;
  requiresIpAddress: boolean;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  fields: AssetTypeField[];
}

export interface CustomAsset extends Asset {
  // We use `type: string` here because the actual value will be `custom_${assetTypeId}` or similar
  type: string;
  assetTypeId: string;
  assetType?: AssetTypeDef;
  ipAddress?: string;
  customProperties: Record<string, string>;
}

export type AssetType = IPAddress | PC | Peripheral | NetworkDevice | MobileDevice | Printer | CustomAsset;

export const ASSET_TYPE_LABELS: Record<string, string> = {
  ip_address: 'IP Address',
  pc: 'PC',
  peripheral: 'Peripheral',
  network_device: 'Network Device',
  mobile_device: 'Mobile Device',
  printer: 'Printer',
};
// Note: ASSET_TYPE_LABELS might not cover dynamic custom asset types out of the box,
// they need to be displayed via fetching the AssetTypeDef.

import { AssetType, IPAddress, PC, Peripheral, NetworkDevice, MobileDevice, Printer } from '@/types/asset';

const API_BASE_URL = import.meta.env.VITE_API_URL;


// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Statistics response type
interface AssetStatistics {
  totalAssets: number;
  byType: {
    ipAddresses: number;
    pcs: number;
    peripherals: number;
    networkDevices: number;
    mobileDevices: number;
    printers: number;
  };
  byStatus: {
    active: number;
    inactive: number;
    maintenance: number;
  };
}

// Asset API functions
export const assetApi = {
  // Get all assets with optional filters
  getAllAssets: async (params?: {
    type?: string;
    status?: string;
    search?: string;
  }): Promise<AssetType[]> => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    
    const query = queryParams.toString();
    return fetchApi<AssetType[]>(`/Assets${query ? `?${query}` : ''}`);
  },

  // Get asset statistics
  getStatistics: async (): Promise<AssetStatistics> => {
    return fetchApi<AssetStatistics>('/Assets/statistics');
  },

  // Search assets
  searchAssets: async (searchTerm: string): Promise<AssetType[]> => {
    return fetchApi<AssetType[]>(`/Assets/search?q=${encodeURIComponent(searchTerm)}`);
  },

  // Get all VLANs
  getVlans: async (): Promise<string[]> => {
    return fetchApi<string[]>('/Assets/vlans');
  },
};

// IP Address API functions
export const ipAddressApi = {
  getAll: async (): Promise<IPAddress[]> => {
    return fetchApi<IPAddress[]>('/IPAddresses');
  },

  getById: async (id: string): Promise<IPAddress> => {
    return fetchApi<IPAddress>(`/IPAddresses/${id}`);
  },

  getByVlan: async (vlan: string): Promise<IPAddress[]> => {
    return fetchApi<IPAddress[]>(`/IPAddresses/vlan/${vlan}`);
  },

  create: async (data: Omit<IPAddress, 'id' | 'createdAt' | 'updatedAt'>): Promise<IPAddress> => {
    return fetchApi<IPAddress>('/IPAddresses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: IPAddress): Promise<void> => {
    return fetchApi<void>(`/IPAddresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return fetchApi<void>(`/IPAddresses/${id}`, {
      method: 'DELETE',
    });
  },
};

// PC API functions
export const pcApi = {
  getAll: async (): Promise<PC[]> => {
    return fetchApi<PC[]>('/PCs');
  },

  getById: async (id: string): Promise<PC> => {
    return fetchApi<PC>(`/PCs/${id}`);
  },

  getBySerial: async (serialNumber: string): Promise<PC> => {
    return fetchApi<PC>(`/PCs/serial/${serialNumber}`);
  },

  create: async (data: Omit<PC, 'id' | 'createdAt' | 'updatedAt'>): Promise<PC> => {
    return fetchApi<PC>('/PCs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: PC): Promise<void> => {
    return fetchApi<void>(`/PCs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return fetchApi<void>(`/PCs/${id}`, {
      method: 'DELETE',
    });
  },
};

// Peripheral API functions
export const peripheralApi = {
  getAll: async (): Promise<Peripheral[]> => fetchApi<Peripheral[]>('/Peripherals'),
  getById: async (id: string): Promise<Peripheral> => fetchApi<Peripheral>(`/Peripherals/${id}`),
  create: async (data: Omit<Peripheral, 'id' | 'createdAt' | 'updatedAt'>): Promise<Peripheral> => 
    fetchApi<Peripheral>('/Peripherals', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: string, data: Peripheral): Promise<void> => 
    fetchApi<void>(`/Peripherals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id: string): Promise<void> => 
    fetchApi<void>(`/Peripherals/${id}`, { method: 'DELETE' }),
};

// Network Device API functions
export const networkDeviceApi = {
  getAll: async (): Promise<NetworkDevice[]> => fetchApi<NetworkDevice[]>('/NetworkDevices'),
  getById: async (id: string): Promise<NetworkDevice> => fetchApi<NetworkDevice>(`/NetworkDevices/${id}`),
  create: async (data: Omit<NetworkDevice, 'id' | 'createdAt' | 'updatedAt'>): Promise<NetworkDevice> => 
    fetchApi<NetworkDevice>('/NetworkDevices', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: string, data: NetworkDevice): Promise<void> => 
    fetchApi<void>(`/NetworkDevices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id: string): Promise<void> => 
    fetchApi<void>(`/NetworkDevices/${id}`, { method: 'DELETE' }),
};

// Mobile Device API functions
export const mobileDeviceApi = {
  getAll: async (): Promise<MobileDevice[]> => fetchApi<MobileDevice[]>('/MobileDevices'),
  getById: async (id: string): Promise<MobileDevice> => fetchApi<MobileDevice>(`/MobileDevices/${id}`),
  create: async (data: Omit<MobileDevice, 'id' | 'createdAt' | 'updatedAt'>): Promise<MobileDevice> => 
    fetchApi<MobileDevice>('/MobileDevices', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: string, data: MobileDevice): Promise<void> => 
    fetchApi<void>(`/MobileDevices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id: string): Promise<void> => 
    fetchApi<void>(`/MobileDevices/${id}`, { method: 'DELETE' }),
};

// Printer API functions
export const printerApi = {
  getAll: async (): Promise<Printer[]> => fetchApi<Printer[]>('/Printers'),
  getById: async (id: string): Promise<Printer> => fetchApi<Printer>(`/Printers/${id}`),
  create: async (data: Omit<Printer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Printer> => 
    fetchApi<Printer>('/Printers', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: string, data: Printer): Promise<void> => 
    fetchApi<void>(`/Printers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id: string): Promise<void> => 
    fetchApi<void>(`/Printers/${id}`, { method: 'DELETE' }),
};
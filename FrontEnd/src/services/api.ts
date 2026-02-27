import {
  AssetType,
  IPAddress,
  PC,
  Peripheral,
  NetworkDevice,
  MobileDevice,
  Printer,
  AssetTypeDef,
  CustomAsset,
} from "@/types/asset";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Generic fetch wrapper with error handling
// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      // Try to parse error message from server if available
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.title) {
          errorMessage = errorData.title;
        } else if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // Ignore JSON parse error for error response
      }
      throw new Error(errorMessage);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
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
    customAssets: number;
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
    if (params?.type) queryParams.append("type", params.type);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.search) queryParams.append("search", params.search);

    const query = queryParams.toString();
    return fetchApi<AssetType[]>(`/Assets${query ? `?${query}` : ""}`);
  },

  // Get asset statistics
  getStatistics: async (): Promise<AssetStatistics> => {
    return fetchApi<AssetStatistics>("/Assets/statistics");
  },

  // Search assets
  searchAssets: async (searchTerm: string): Promise<AssetType[]> => {
    return fetchApi<AssetType[]>(
      `/Assets/search?q=${encodeURIComponent(searchTerm)}`
    );
  },

  // Get all VLANs
  getVlans: async (): Promise<string[]> => {
    return fetchApi<string[]>("/Assets/vlans");
  },
};

// IP Address API functions
export const ipAddressApi = {
  getAll: async (): Promise<IPAddress[]> => {
    return fetchApi<IPAddress[]>("/IPAddresses");
  },

  getById: async (id: string): Promise<IPAddress> => {
    return fetchApi<IPAddress>(`/IPAddresses/${id}`);
  },

  getByVlan: async (vlan: string): Promise<IPAddress[]> => {
    return fetchApi<IPAddress[]>(`/IPAddresses/vlan/${vlan}`);
  },

  create: async (data: Partial<IPAddress>): Promise<IPAddress> => {
    return fetchApi<IPAddress>("/IPAddresses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<IPAddress>): Promise<void> => {
    return fetchApi<void>(`/IPAddresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return fetchApi<void>(`/IPAddresses/${id}`, {
      method: "DELETE",
    });
  },
};

// PC API functions
export const pcApi = {
  getAll: async (): Promise<PC[]> => {
    return fetchApi<PC[]>("/PCs");
  },

  getById: async (id: string): Promise<PC> => {
    return fetchApi<PC>(`/PCs/${id}`);
  },

  getBySerial: async (serialNumber: string): Promise<PC> => {
    return fetchApi<PC>(`/PCs/serial/${serialNumber}`);
  },

  create: async (data: Partial<PC>): Promise<PC> => {
    return fetchApi<PC>("/PCs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<PC>): Promise<void> => {
    return fetchApi<void>(`/PCs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return fetchApi<void>(`/PCs/${id}`, {
      method: "DELETE",
    });
  },
};

// Peripheral API functions
export const peripheralApi = {
  getAll: async (): Promise<Peripheral[]> =>
    fetchApi<Peripheral[]>("/Peripherals"),
  getById: async (id: string): Promise<Peripheral> =>
    fetchApi<Peripheral>(`/Peripherals/${id}`),
  create: async (data: Partial<Peripheral>): Promise<Peripheral> =>
    fetchApi<Peripheral>("/Peripherals", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: async (id: string, data: Partial<Peripheral>): Promise<void> =>
    fetchApi<void>(`/Peripherals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: async (id: string): Promise<void> =>
    fetchApi<void>(`/Peripherals/${id}`, { method: "DELETE" }),
};

// Network Device API functions
export const networkDeviceApi = {
  getAll: async (): Promise<NetworkDevice[]> =>
    fetchApi<NetworkDevice[]>("/NetworkDevices"),
  getById: async (id: string): Promise<NetworkDevice> =>
    fetchApi<NetworkDevice>(`/NetworkDevices/${id}`),
  create: async (data: Partial<NetworkDevice>): Promise<NetworkDevice> =>
    fetchApi<NetworkDevice>("/NetworkDevices", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: async (id: string, data: Partial<NetworkDevice>): Promise<void> =>
    fetchApi<void>(`/NetworkDevices/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: async (id: string): Promise<void> =>
    fetchApi<void>(`/NetworkDevices/${id}`, { method: "DELETE" }),
};

// Mobile Device API functions
export const mobileDeviceApi = {
  getAll: async (): Promise<MobileDevice[]> =>
    fetchApi<MobileDevice[]>("/MobileDevices"),
  getById: async (id: string): Promise<MobileDevice> =>
    fetchApi<MobileDevice>(`/MobileDevices/${id}`),
  create: async (data: Partial<MobileDevice>): Promise<MobileDevice> =>
    fetchApi<MobileDevice>("/MobileDevices", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: async (id: string, data: Partial<MobileDevice>): Promise<void> =>
    fetchApi<void>(`/MobileDevices/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: async (id: string): Promise<void> =>
    fetchApi<void>(`/MobileDevices/${id}`, { method: "DELETE" }),
};

// Printer API functions
export const printerApi = {
  getAll: async (): Promise<Printer[]> => fetchApi<Printer[]>("/Printers"),
  getById: async (id: string): Promise<Printer> =>
    fetchApi<Printer>(`/Printers/${id}`),
  create: async (data: Partial<Printer>): Promise<Printer> =>
    fetchApi<Printer>("/Printers", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: async (id: string, data: Partial<Printer>): Promise<void> =>
    fetchApi<void>(`/Printers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: async (id: string): Promise<void> =>
    fetchApi<void>(`/Printers/${id}`, { method: "DELETE" }),
};

// Asset Type API functions
export const assetTypeApi = {
  getAll: async (): Promise<AssetTypeDef[]> => fetchApi<AssetTypeDef[]>("/AssetTypes"),
  getById: async (id: string): Promise<AssetTypeDef> =>
    fetchApi<AssetTypeDef>(`/AssetTypes/${id}`),
  create: async (data: Partial<AssetTypeDef>): Promise<AssetTypeDef> =>
    fetchApi<AssetTypeDef>("/AssetTypes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: async (id: string, data: Partial<AssetTypeDef>): Promise<void> =>
    fetchApi<void>(`/AssetTypes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: async (id: string): Promise<void> =>
    fetchApi<void>(`/AssetTypes/${id}`, { method: "DELETE" }),
};

// Custom Asset API functions
export const customAssetApi = {
  getAll: async (): Promise<CustomAsset[]> => fetchApi<CustomAsset[]>("/CustomAssets"),
  getById: async (id: string): Promise<CustomAsset> =>
    fetchApi<CustomAsset>(`/CustomAssets/${id}`),
  create: async (data: Partial<CustomAsset>): Promise<CustomAsset> =>
    fetchApi<CustomAsset>("/CustomAssets", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: async (id: string, data: Partial<CustomAsset>): Promise<void> =>
    fetchApi<void>(`/CustomAssets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: async (id: string): Promise<void> =>
    fetchApi<void>(`/CustomAssets/${id}`, { method: "DELETE" }),
};

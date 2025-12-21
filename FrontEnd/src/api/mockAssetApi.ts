import { AssetType, IPAddress, PC } from "@/types/asset";
import { sampleAssets } from "@/data/sampleAssets";

// Simulated database
let assets: AssetType[] = [...sampleAssets];

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export const assetApi = {
  // Get all assets
  async getAll(): Promise<AssetType[]> {
    await delay();
    return [...assets];
  },

  // Get asset by ID
  async getById(id: string): Promise<AssetType | null> {
    await delay();
    return assets.find(asset => asset.id === id) || null;
  },

  // Get assets by type
  async getByType(type: 'ip_address' | 'pc'): Promise<AssetType[]> {
    await delay();
    return assets.filter(asset => asset.type === type);
  },

  // Get assets by status
  async getByStatus(status: 'active' | 'inactive' | 'maintenance'): Promise<AssetType[]> {
    await delay();
    return assets.filter(asset => asset.status === status);
  },

  // Get assets by VLAN (IP addresses only)
  async getByVlan(vlan: string): Promise<IPAddress[]> {
    await delay();
    return assets.filter(
      (asset): asset is IPAddress => asset.type === 'ip_address' && asset.vlan === vlan
    );
  },

  // Create new asset
  async create(assetData: Omit<AssetType, 'id' | 'createdAt' | 'updatedAt'>): Promise<AssetType> {
    await delay(500);
    const newAsset = {
      ...assetData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as AssetType;
    assets.push(newAsset);
    return newAsset;
  },

  // Update existing asset
  async update(id: string, updates: Partial<AssetType>): Promise<AssetType | null> {
    await delay(400);
    const index = assets.findIndex(asset => asset.id === id);
    if (index === -1) return null;
    
    assets[index] = {
      ...assets[index],
      ...updates,
      updatedAt: new Date(),
    } as AssetType;
    return assets[index];
  },

  // Delete asset
  async delete(id: string): Promise<boolean> {
    await delay(300);
    const index = assets.findIndex(asset => asset.id === id);
    if (index === -1) return false;
    assets.splice(index, 1);
    return true;
  },

  // Test connection to IP address
  async testConnection(ipAddress: string): Promise<{ success: boolean; latency?: number; error?: string }> {
    await delay(800 + Math.random() * 1200);
    
    // Simulate random success/failure
    const success = Math.random() > 0.3;
    if (success) {
      return { success: true, latency: Math.floor(Math.random() * 100) + 10 };
    }
    return { success: false, error: "Connection timed out" };
  },

  // Search assets by name or location
  async search(query: string): Promise<AssetType[]> {
    await delay();
    const lowerQuery = query.toLowerCase();
    return assets.filter(
      asset =>
        asset.name.toLowerCase().includes(lowerQuery) ||
        asset.location.toLowerCase().includes(lowerQuery) ||
        (asset.assignedTo?.toLowerCase().includes(lowerQuery))
    );
  },

  // Get unique VLANs
  async getVlans(): Promise<string[]> {
    await delay(200);
    const vlans = assets
      .filter((asset): asset is IPAddress => asset.type === 'ip_address' && !!asset.vlan)
      .map(asset => asset.vlan!);
    return [...new Set(vlans)];
  },

  // Reset to initial data (useful for testing)
  async reset(): Promise<void> {
    await delay();
    assets = [...sampleAssets];
  },
};

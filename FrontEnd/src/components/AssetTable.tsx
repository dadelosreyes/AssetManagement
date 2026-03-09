import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Monitor, Globe, Edit, Trash2, Wifi, WifiOff, Loader2, Smartphone, Printer, Network, Mouse, Box, Server, Database, Cpu, Speaker, Camera, Video, Keyboard } from "lucide-react";
import { AssetType, AssetTypeDef, ASSET_TYPE_LABELS } from "@/types/asset";

interface AssetTableProps {
  assets: AssetType[];
  assetTypes?: AssetTypeDef[];
  onAddAsset: () => void;
  onEditAsset: (asset: AssetType) => void;
  onDeleteAsset: (id: string) => void;
}

export const AssetTable = ({ assets, assetTypes = [], onAddAsset, onEditAsset, onDeleteAsset }: AssetTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVlan, setSelectedVlan] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [testingConnections, setTestingConnections] = useState<Set<string>>(new Set());
  const [connectionResults, setConnectionResults] = useState<Map<string, boolean>>(new Map());

  const filteredAssets = assets.filter(asset => {
    const searchLower = searchTerm.toLowerCase();

    // Check custom properties if it's a CustomAsset
    let matchesCustomProps = false;
    if (asset.type.startsWith('custom_') && 'customProperties' in asset && asset.customProperties) {
      matchesCustomProps = Object.values(asset.customProperties).some(val =>
        val && String(val).toLowerCase().includes(searchLower)
      );
    }

    const matchesSearch = asset.name.toLowerCase().includes(searchLower) ||
      asset.location.toLowerCase().includes(searchLower) ||
      (asset.assignedTo && asset.assignedTo.toLowerCase().includes(searchLower)) ||
      (asset.details && asset.details.toLowerCase().includes(searchLower)) ||
      ('ipAddress' in asset && asset.ipAddress?.includes(searchTerm)) ||
      ('serialNumber' in asset && asset.serialNumber.toLowerCase().includes(searchLower)) ||
      ('model' in asset && asset.model.toLowerCase().includes(searchLower)) ||
      ('manufacturer' in asset && asset.manufacturer.toLowerCase().includes(searchLower)) ||
      matchesCustomProps;

    const matchesVlan = selectedVlan === 'all' ||
      (asset.type === 'ip_address' && ('vlan' in asset) && (asset as any).vlan === selectedVlan);

    const matchesType = selectedType === 'all' || asset.type === selectedType;

    return matchesSearch && matchesVlan && matchesType;
  });

  const availableVlans = Array.from(new Set(
    assets
      .filter(asset => asset.type === 'ip_address')
      .map(asset => asset.vlan)
      .filter(Boolean)
  )).sort();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-destructive text-destructive-foreground">Inactive</Badge>;
      case 'maintenance':
        return <Badge className="bg-warning text-warning-foreground">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string, asset?: AssetType) => {
    if (type.startsWith('custom_')) {
      const typeId = type.substring(7);
      const def = assetTypes.find(t => t.id === typeId) || (asset && 'assetType' in asset ? asset.assetType : null);
      if (def?.icon) {
        switch (def.icon) {
          case "Monitor": return <Monitor className="h-4 w-4" />;
          case "Smartphone": return <Smartphone className="h-4 w-4" />;
          case "Printer": return <Printer className="h-4 w-4" />;
          case "Network": return <Network className="h-4 w-4" />;
          case "Server": return <Server className="h-4 w-4" />;
          case "Database": return <Database className="h-4 w-4" />;
          case "Globe": return <Globe className="h-4 w-4" />;
          case "Wifi": return <Wifi className="h-4 w-4" />;
          case "Cpu": return <Cpu className="h-4 w-4" />;
          case "Speaker": return <Speaker className="h-4 w-4" />;
          case "Camera": return <Camera className="h-4 w-4" />;
          case "Video": return <Video className="h-4 w-4" />;
          case "Keyboard": return <Keyboard className="h-4 w-4" />;
          case "Mouse": return <Mouse className="h-4 w-4" />;
          case "Box":
          default:
            return <Box className="h-4 w-4" />;
        }
      }
      return <Box className="h-4 w-4" />;
    }

    switch (type) {
      case 'ip_address': return <Globe className="h-4 w-4" />;
      case 'pc': return <Monitor className="h-4 w-4" />;
      case 'peripheral': return <Mouse className="h-4 w-4" />;
      case 'network_device': return <Network className="h-4 w-4" />;
      case 'mobile_device': return <Smartphone className="h-4 w-4" />;
      case 'printer': return <Printer className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: string, asset?: AssetType) => {
    if (type.startsWith('custom_')) {
      const typeId = type.substring(7);
      const def = assetTypes.find(t => t.id === typeId) || (asset && 'assetType' in asset ? asset.assetType : null);
      return def?.name || 'Custom Asset';
    }
    return ASSET_TYPE_LABELS[type] || type;
  };

  const testConnection = async (asset: AssetType) => {
    if (!('ipAddress' in asset) || !asset.ipAddress) return;

    setTestingConnections(prev => new Set(prev).add(asset.id));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      await fetch(`http://${asset.ipAddress}`, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      setConnectionResults(prev => new Map(prev).set(asset.id, true));
    } catch {
      setConnectionResults(prev => new Map(prev).set(asset.id, false));
    } finally {
      setTestingConnections(prev => {
        const newSet = new Set(prev);
        newSet.delete(asset.id);
        return newSet;
      });
    }
  };

  const getConnectionIcon = (asset: AssetType) => {
    if (!('ipAddress' in asset) || !asset.ipAddress) return null;

    const isLoading = testingConnections.has(asset.id);
    const result = connectionResults.get(asset.id);

    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    if (result === true) return <Wifi className="h-4 w-4 text-success" />;
    if (result === false) return <WifiOff className="h-4 w-4 text-destructive" />;
    return null;
  };

  const getAssetDetails = (asset: AssetType) => {
    switch (asset.type) {
      case 'ip_address':
        return (
          <div className="text-sm">
            <div className="font-mono flex items-center gap-2">
              {asset.ipAddress}
              {getConnectionIcon(asset)}
            </div>
            <div className="text-muted-foreground">
              Subnet: {(asset as any).subnet}
              {('vlan' in asset) && asset.vlan && <><br />VLAN: {(asset as any).vlan}</>}
            </div>
            {asset.details && <div className="text-muted-foreground italic mt-1">{asset.details}</div>}
          </div>
        );
      case 'pc':
        return (
          <div className="text-sm">
            <div>{(asset as any).manufacturer} {(asset as any).model}</div>
            <div className="text-muted-foreground">SN: {(asset as any).serialNumber}</div>
            {'ipAddress' in asset && asset.ipAddress && <div className="text-muted-foreground">IP: {asset.ipAddress}</div>}
            {asset.details && <div className="text-muted-foreground italic mt-1">{asset.details}</div>}
          </div>
        );
      case 'peripheral':
        return (
          <div className="text-sm">
            <div>{(asset as any).manufacturer} {(asset as any).model}</div>
            <div className="text-muted-foreground capitalize">{(asset as any).peripheralType.replace('_', ' ')}</div>
            {'connectionType' in asset && (asset as any).connectionType && <div className="text-muted-foreground">{(asset as any).connectionType}</div>}
            {asset.details && <div className="text-muted-foreground italic mt-1">{asset.details}</div>}
          </div>
        );
      case 'network_device':
        return (
          <div className="text-sm">
            <div>{(asset as any).manufacturer} {(asset as any).model}</div>
            <div className="text-muted-foreground capitalize">{(asset as any).deviceType.replace('_', ' ')}</div>
            {'ipAddress' in asset && (asset as any).ipAddress && <div className="font-mono text-muted-foreground flex items-center gap-2">IP: {(asset as any).ipAddress} {getConnectionIcon(asset)}</div>}
            {asset.details && <div className="text-muted-foreground italic mt-1">{asset.details}</div>}
          </div>
        );
      case 'mobile_device':
        return (
          <div className="text-sm">
            <div>{(asset as any).manufacturer} {(asset as any).model}</div>
            <div className="text-muted-foreground">{(asset as any).operatingSystem}</div>
            {'phoneNumber' in asset && (asset as any).phoneNumber && <div className="text-muted-foreground">{(asset as any).phoneNumber}</div>}
            {asset.details && <div className="text-muted-foreground italic mt-1">{asset.details}</div>}
          </div>
        );
      case 'printer':
        return (
          <div className="text-sm">
            <div>{(asset as any).manufacturer} {(asset as any).model}</div>
            <div className="text-muted-foreground capitalize">{(asset as any).printerType.replace('_', ' ')}</div>
            {'isNetworked' in asset && (asset as any).isNetworked && ('ipAddress' in asset) && asset.ipAddress && (
              <div className="font-mono text-muted-foreground flex items-center gap-2">IP: {asset.ipAddress} {getConnectionIcon(asset)}</div>
            )}
            {asset.details && <div className="text-muted-foreground italic mt-1">{asset.details}</div>}
          </div>
        );
      default:
        if (asset.type.startsWith('custom_') && 'customProperties' in asset) {
          const props = asset.customProperties || {};
          const typeDef = assetTypes.find(t => t.id === asset.type?.substring(7)) || asset.assetType;
          return (
            <div className="text-sm">
              {Object.entries(props).slice(0, 3).map(([key, value]) => {
                const fieldDef = typeDef?.fields?.find(f => f.id === key || f.name === key);
                const displayKey = fieldDef ? fieldDef.name : key;
                let displayVal = value;
                if (fieldDef?.dataType === 'boolean') {
                  displayVal = value === 'true' ? 'Yes' : 'No';
                }
                return (
                  <div key={key} className="text-muted-foreground">
                    <span className="font-medium text-foreground">{displayKey}:</span> {displayVal}
                  </div>
                );
              })}
              {Object.keys(props).length > 3 && (
                <div className="text-xs text-muted-foreground mt-1">+{Object.keys(props).length - 3} more properties</div>
              )}
              {('ipAddress' in asset) && asset.ipAddress && (
                <div className="font-mono text-muted-foreground flex items-center gap-2 mt-1">
                  IP: {asset.ipAddress} {getConnectionIcon(asset as any)}
                </div>
              )}
              {asset.details && <div className="text-muted-foreground italic mt-1">{asset.details}</div>}
            </div>
          );
        }
        return null;
    };

    const hasIpAddress = (asset: AssetType): boolean => {
      return 'ipAddress' in asset && !!asset.ipAddress;
    };

    return (
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">Asset Inventory</CardTitle>
              <CardDescription>Manage all your IT assets</CardDescription>
            </div>
            <Button onClick={onAddAsset} className="bg-gradient-primary shadow-soft">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="type-filter">Type:</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(ASSET_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                  {assetTypes.map(t => (
                    <SelectItem key={`custom_${t.id}`} value={`custom_${t.id}`}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="vlan-filter">VLAN:</Label>
              <Select value={selectedVlan} onValueChange={setSelectedVlan}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All VLANs</SelectItem>
                  {availableVlans.map(vlan => (
                    <SelectItem key={vlan} value={vlan!}>{vlan}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(asset.type, asset)}
                        <span className="text-sm">{getTypeName(asset.type, asset)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>{getAssetDetails(asset)}</TableCell>
                    <TableCell>{getStatusBadge(asset.status)}</TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell>{asset.assignedTo || '-'}</TableCell>
                    <TableCell>{new Date(asset.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(asset.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {hasIpAddress(asset) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => testConnection(asset)}
                            disabled={testingConnections.has(asset.id)}
                            title="Test Connection"
                          >
                            {testingConnections.has(asset.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Wifi className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => onEditAsset(asset)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDeleteAsset(asset.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAssets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No assets found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };
};

export default AssetTable;

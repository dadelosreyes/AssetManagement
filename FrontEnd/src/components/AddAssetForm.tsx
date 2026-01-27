import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { AssetType, ASSET_TYPE_LABELS } from "@/types/asset";
import { useToast } from "@/hooks/use-toast";

interface AddAssetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: any) => void;
  editingAsset?: AssetType;
}

type AssetTypeValue = AssetType['type'];

export const AddAssetForm = ({ isOpen, onClose, onSave, editingAsset }: AddAssetFormProps) => {
  console.log("🟢 AddAssetForm rendered, isOpen:", isOpen);
  const { toast } = useToast();
  const [assetType, setAssetType] = useState<AssetTypeValue>(editingAsset?.type || 'ip_address');

  const [formData, setFormData] = useState({
    name: '',
    status: 'active',
    location: '',
    assignedTo: '',
    // IP Address fields
    ipAddress: '',
    subnet: '',
    gateway: '',
    dns: '',
    vlan: '',
    // Common device fields
    serialNumber: '',
    model: '',
    manufacturer: '',
    // PC fields
    operatingSystem: '',
    processor: '',
    memory: '',
    storage: '',
    pcIpAddress: '',
    // Peripheral fields
    peripheralType: 'keyboard',
    connectionType: '',
    // Network device fields
    networkDeviceType: 'router',
    macAddress: '',
    portCount: '',
    networkIpAddress: '',
    // Mobile device fields
    mobileDeviceType: 'smartphone',
    mobileOS: '',
    imei: '',
    phoneNumber: '',
    // Printer fields
    printerType: 'laser',
    printerIpAddress: '',
    isNetworked: false,
  });

  useEffect(() => {
    if (editingAsset) {
      setAssetType(editingAsset.type);
      setFormData({
        name: editingAsset.name,
        status: editingAsset.status,
        location: editingAsset.location,
        assignedTo: editingAsset.assignedTo || '',
        ipAddress: editingAsset.type === 'ip_address' ? editingAsset.ipAddress : '',
        subnet: editingAsset.type === 'ip_address' ? editingAsset.subnet : '',
        gateway: editingAsset.type === 'ip_address' ? editingAsset.gateway || '' : '',
        dns: editingAsset.type === 'ip_address' ? editingAsset.dns || '' : '',
        vlan: editingAsset.type === 'ip_address' ? editingAsset.vlan || '' : '',
        serialNumber: 'serialNumber' in editingAsset ? editingAsset.serialNumber : '',
        model: 'model' in editingAsset ? editingAsset.model : '',
        manufacturer: 'manufacturer' in editingAsset ? editingAsset.manufacturer : '',
        operatingSystem: editingAsset.type === 'pc' ? editingAsset.operatingSystem : '',
        processor: editingAsset.type === 'pc' ? editingAsset.processor : '',
        memory: editingAsset.type === 'pc' ? editingAsset.memory : '',
        storage: editingAsset.type === 'pc' ? editingAsset.storage : '',
        pcIpAddress: editingAsset.type === 'pc' ? editingAsset.ipAddress || '' : '',
        peripheralType: editingAsset.type === 'peripheral' ? editingAsset.peripheralType : 'keyboard',
        connectionType: editingAsset.type === 'peripheral' ? editingAsset.connectionType || '' : '',
        networkDeviceType: editingAsset.type === 'network_device' ? editingAsset.deviceType : 'router',
        macAddress: editingAsset.type === 'network_device' ? editingAsset.macAddress || '' : '',
        portCount: editingAsset.type === 'network_device' ? String(editingAsset.portCount || '') : '',
        networkIpAddress: editingAsset.type === 'network_device' ? editingAsset.ipAddress || '' : '',
        mobileDeviceType: editingAsset.type === 'mobile_device' ? editingAsset.deviceType : 'smartphone',
        mobileOS: editingAsset.type === 'mobile_device' ? editingAsset.operatingSystem : '',
        imei: editingAsset.type === 'mobile_device' ? editingAsset.imei || '' : '',
        phoneNumber: editingAsset.type === 'mobile_device' ? editingAsset.phoneNumber || '' : '',
        printerType: editingAsset.type === 'printer' ? editingAsset.printerType : 'laser',
        printerIpAddress: editingAsset.type === 'printer' ? editingAsset.ipAddress || '' : '',
        isNetworked: editingAsset.type === 'printer' ? editingAsset.isNetworked : false,
      });
    } else {
      setFormData({
        name: '', status: 'active', location: '', assignedTo: '',
        ipAddress: '', subnet: '', gateway: '', dns: '', vlan: '',
        serialNumber: '', model: '', manufacturer: '',
        operatingSystem: '', processor: '', memory: '', storage: '', pcIpAddress: '',
        peripheralType: 'keyboard', connectionType: '',
        networkDeviceType: 'router', macAddress: '', portCount: '', networkIpAddress: '',
        mobileDeviceType: 'smartphone', mobileOS: '', imei: '', phoneNumber: '',
        printerType: 'laser', printerIpAddress: '', isNetworked: false,
      });
    }
  }, [editingAsset, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    console.log("🔴 FORM SUBMIT TRIGGERED!", e);
    e.preventDefault();
    console.log("🔴 After preventDefault, assetType:", assetType);

    const baseAsset = {
      id: editingAsset?.id, // Let backend generate ID for new assets
      name: formData.name,
      status: formData.status as 'active' | 'inactive' | 'maintenance',
      location: formData.location,
      assignedTo: formData.assignedTo || undefined,
      createdAt: editingAsset?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    console.log("🟡 baseAsset created:", baseAsset);

    let asset: any; // Use any temporarily to build partial object

    switch (assetType) {
      case 'ip_address':
        console.log("🟡 Building IP Address asset...");
        asset = {
          ...baseAsset,
          type: 'ip_address',
          ipAddress: formData.ipAddress,
          subnet: formData.subnet,
          gateway: formData.gateway || undefined,
          dns: formData.dns || undefined,
          vlan: formData.vlan || undefined,
        };
        console.log("🟡 IP Address asset built:", asset);
        break;
      case 'pc':
        asset = {
          ...baseAsset,
          type: 'pc',
          serialNumber: formData.serialNumber,
          model: formData.model,
          manufacturer: formData.manufacturer,
          operatingSystem: formData.operatingSystem,
          processor: formData.processor,
          memory: formData.memory,
          storage: formData.storage,
          ipAddress: formData.pcIpAddress || undefined,
        };
        break;
      case 'peripheral':
        asset = {
          ...baseAsset,
          type: 'peripheral',
          serialNumber: formData.serialNumber,
          model: formData.model,
          manufacturer: formData.manufacturer,
          peripheralType: formData.peripheralType,
          connectionType: formData.connectionType || undefined,
        };
        break;
      case 'network_device':
        asset = {
          ...baseAsset,
          type: 'network_device',
          serialNumber: formData.serialNumber,
          model: formData.model,
          manufacturer: formData.manufacturer,
          deviceType: formData.networkDeviceType,
          ipAddress: formData.networkIpAddress || undefined,
          macAddress: formData.macAddress || undefined,
          portCount: formData.portCount && !isNaN(parseInt(formData.portCount)) ? parseInt(formData.portCount) : undefined,
        };
        break;
      case 'mobile_device':
        asset = {
          ...baseAsset,
          type: 'mobile_device',
          serialNumber: formData.serialNumber,
          model: formData.model,
          manufacturer: formData.manufacturer,
          deviceType: formData.mobileDeviceType as any,
          operatingSystem: formData.mobileOS,
          imei: formData.imei || undefined,
          phoneNumber: formData.phoneNumber || undefined,
        };
        break;
      case 'printer':
        asset = {
          ...baseAsset,
          type: 'printer',
          serialNumber: formData.serialNumber,
          model: formData.model,
          manufacturer: formData.manufacturer,
          printerType: formData.printerType as any,
          ipAddress: formData.printerIpAddress || undefined,
          isNetworked: formData.isNetworked,
        };
        break;
      default:
        return;
    }

    console.log("🟢 About to call onSave with asset:", asset);
    console.log("🟢 onSave function is:", onSave);
    console.log("🟢 Type of onSave:", typeof onSave);
    onSave(asset);
    // Note: toast and onClose are handled by the mutation callbacks in Assets.tsx
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderTypeSpecificFields = () => {
    switch (assetType) {
      case 'ip_address':
        return (
          <Card>
            <CardHeader>
              <CardTitle>IP Address Details</CardTitle>
              <CardDescription>Network configuration information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ipAddress">IP Address *</Label>
                  <Input id="ipAddress" value={formData.ipAddress} onChange={(e) => handleInputChange('ipAddress', e.target.value)} placeholder="192.168.1.100" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subnet">Subnet *</Label>
                  <Input id="subnet" value={formData.subnet} onChange={(e) => handleInputChange('subnet', e.target.value)} placeholder="255.255.255.0" required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vlan">VLAN</Label>
                  <Input id="vlan" value={formData.vlan} onChange={(e) => handleInputChange('vlan', e.target.value)} placeholder="VLAN-100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gateway">Gateway</Label>
                  <Input id="gateway" value={formData.gateway} onChange={(e) => handleInputChange('gateway', e.target.value)} placeholder="192.168.1.1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dns">DNS</Label>
                  <Input id="dns" value={formData.dns} onChange={(e) => handleInputChange('dns', e.target.value)} placeholder="8.8.8.8" />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'pc':
        return (
          <Card>
            <CardHeader>
              <CardTitle>PC Details</CardTitle>
              <CardDescription>Computer system specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer *</Label>
                  <Input id="manufacturer" value={formData.manufacturer} onChange={(e) => handleInputChange('manufacturer', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input id="model" value={formData.model} onChange={(e) => handleInputChange('model', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number *</Label>
                  <Input id="serialNumber" value={formData.serialNumber} onChange={(e) => handleInputChange('serialNumber', e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="operatingSystem">Operating System *</Label>
                  <Input id="operatingSystem" value={formData.operatingSystem} onChange={(e) => handleInputChange('operatingSystem', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processor">Processor *</Label>
                  <Input id="processor" value={formData.processor} onChange={(e) => handleInputChange('processor', e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="memory">Memory *</Label>
                  <Input id="memory" value={formData.memory} onChange={(e) => handleInputChange('memory', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storage">Storage *</Label>
                  <Input id="storage" value={formData.storage} onChange={(e) => handleInputChange('storage', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pcIpAddress">IP Address</Label>
                  <Input id="pcIpAddress" value={formData.pcIpAddress} onChange={(e) => handleInputChange('pcIpAddress', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'peripheral':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Peripheral Details</CardTitle>
              <CardDescription>Peripheral device information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="peripheralType">Peripheral Type *</Label>
                  <Select value={formData.peripheralType} onValueChange={(v) => handleInputChange('peripheralType', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="keyboard">Keyboard</SelectItem>
                      <SelectItem value="mouse">Mouse</SelectItem>
                      <SelectItem value="monitor">Monitor</SelectItem>
                      <SelectItem value="webcam">Webcam</SelectItem>
                      <SelectItem value="headset">Headset</SelectItem>
                      <SelectItem value="dockingStation">Docking Station</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="connectionType">Connection Type</Label>
                  <Input id="connectionType" value={formData.connectionType} onChange={(e) => handleInputChange('connectionType', e.target.value)} placeholder="USB-C, Bluetooth..." />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer *</Label>
                  <Input id="manufacturer" value={formData.manufacturer} onChange={(e) => handleInputChange('manufacturer', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input id="model" value={formData.model} onChange={(e) => handleInputChange('model', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number *</Label>
                  <Input id="serialNumber" value={formData.serialNumber} onChange={(e) => handleInputChange('serialNumber', e.target.value)} required />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'network_device':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Network Device Details</CardTitle>
              <CardDescription>Networking equipment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="networkDeviceType">Device Type *</Label>
                  <Select value={formData.networkDeviceType} onValueChange={(v) => handleInputChange('networkDeviceType', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="router">Router</SelectItem>
                      <SelectItem value="switch">Switch</SelectItem>
                      <SelectItem value="accessPoint">Access Point</SelectItem>
                      <SelectItem value="firewall">Firewall</SelectItem>
                      <SelectItem value="modem">Modem</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portCount">Port Count</Label>
                  <Input id="portCount" type="number" value={formData.portCount} onChange={(e) => handleInputChange('portCount', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer *</Label>
                  <Input id="manufacturer" value={formData.manufacturer} onChange={(e) => handleInputChange('manufacturer', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input id="model" value={formData.model} onChange={(e) => handleInputChange('model', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number *</Label>
                  <Input id="serialNumber" value={formData.serialNumber} onChange={(e) => handleInputChange('serialNumber', e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="networkIpAddress">IP Address</Label>
                  <Input id="networkIpAddress" value={formData.networkIpAddress} onChange={(e) => handleInputChange('networkIpAddress', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="macAddress">MAC Address</Label>
                  <Input id="macAddress" value={formData.macAddress} onChange={(e) => handleInputChange('macAddress', e.target.value)} placeholder="00:1A:2B:3C:4D:5E" />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'mobile_device':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Mobile Device Details</CardTitle>
              <CardDescription>Mobile device information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobileDeviceType">Device Type *</Label>
                  <Select value={formData.mobileDeviceType} onValueChange={(v) => handleInputChange('mobileDeviceType', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smartphone">Smartphone</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobileOS">Operating System *</Label>
                  <Input id="mobileOS" value={formData.mobileOS} onChange={(e) => handleInputChange('mobileOS', e.target.value)} placeholder="iOS 17, Android 14..." required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer *</Label>
                  <Input id="manufacturer" value={formData.manufacturer} onChange={(e) => handleInputChange('manufacturer', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input id="model" value={formData.model} onChange={(e) => handleInputChange('model', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number *</Label>
                  <Input id="serialNumber" value={formData.serialNumber} onChange={(e) => handleInputChange('serialNumber', e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imei">IMEI</Label>
                  <Input id="imei" value={formData.imei} onChange={(e) => handleInputChange('imei', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" value={formData.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'printer':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Printer Details</CardTitle>
              <CardDescription>Printer information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="printerType">Printer Type *</Label>
                  <Select value={formData.printerType} onValueChange={(v) => handleInputChange('printerType', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laser">Laser</SelectItem>
                      <SelectItem value="inkjet">Inkjet</SelectItem>
                      <SelectItem value="thermal">Thermal</SelectItem>
                      <SelectItem value="dot_matrix">Dot Matrix</SelectItem>
                      <SelectItem value="multifunction">Multifunction</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 flex items-center gap-2 pt-6">
                  <Switch id="isNetworked" checked={formData.isNetworked} onCheckedChange={(v) => handleInputChange('isNetworked', v)} />
                  <Label htmlFor="isNetworked">Network Printer</Label>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer *</Label>
                  <Input id="manufacturer" value={formData.manufacturer} onChange={(e) => handleInputChange('manufacturer', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input id="model" value={formData.model} onChange={(e) => handleInputChange('model', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number *</Label>
                  <Input id="serialNumber" value={formData.serialNumber} onChange={(e) => handleInputChange('serialNumber', e.target.value)} required />
                </div>
              </div>
              {formData.isNetworked && (
                <div className="space-y-2">
                  <Label htmlFor="printerIpAddress">IP Address</Label>
                  <Input id="printerIpAddress" value={formData.printerIpAddress} onChange={(e) => handleInputChange('printerIpAddress', e.target.value)} />
                </div>
              )}
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingAsset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
          <DialogDescription>{editingAsset ? 'Update the asset information below.' : 'Enter the details for the new asset.'}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assetType">Asset Type</Label>
              <Select value={assetType} onValueChange={(v: AssetTypeValue) => setAssetType(v)} disabled={!!editingAsset}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ASSET_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => handleInputChange('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input id="assignedTo" value={formData.assignedTo} onChange={(e) => handleInputChange('assignedTo', e.target.value)} placeholder="Optional" />
          </div>

          {renderTypeSpecificFields()}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-gradient-primary">{editingAsset ? 'Update Asset' : 'Create Asset'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

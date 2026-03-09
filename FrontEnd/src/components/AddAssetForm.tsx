import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { AssetType, AssetTypeDef, ASSET_TYPE_LABELS } from "@/types/asset";
import { useToast } from "@/hooks/use-toast";
import { assetTypeApi, assetApi } from "@/services/api";

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
  const [assetType, setAssetType] = useState<string>(editingAsset?.type || 'ip_address');
  const [customAssetTypes, setCustomAssetTypes] = useState<AssetTypeDef[]>([]);
  const [allAssets, setAllAssets] = useState<AssetType[]>([]);
  const [customFieldsData, setCustomFieldsData] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    status: 'active',
    location: '',
    assignedTo: '',
    details: '',
    parentAssetId: 'none',
    // IP Address fields
    ipAddress: '',
    subnet: '',
    gateway: '',
    dns: '',
    vlan: '',
    isWlan: false,
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
    // Fetch custom asset types
    assetTypeApi.getAll()
      .then(data => setCustomAssetTypes(data))
      .catch(err => console.error("Failed to load asset types", err));

    // Fetch all assets for parent asset selection
    assetApi.getAllAssets()
      .then(data => setAllAssets(data))
      .catch(err => console.error("Failed to load all assets", err));
  }, []);

  useEffect(() => {
    if (editingAsset) {
      const editing = editingAsset as any;
      setAssetType(editing.type);
      setFormData({
        name: editing.name,
        status: editing.status,
        location: editing.location,
        assignedTo: editing.assignedTo || '',
        details: editing.details || '',
        parentAssetId: editing.parentAssetId || 'none',
        ipAddress: editing.type === 'ip_address' ? editing.ipAddress : (editing.type?.startsWith('custom_') ? editing.ipAddress || '' : ''),
        subnet: editing.type === 'ip_address' ? editing.subnet : (editing.type?.startsWith('custom_') ? editing.customProperties?.subnet || '' : ''),
        gateway: editing.type === 'ip_address' ? editing.gateway || '' : (editing.type?.startsWith('custom_') ? editing.customProperties?.gateway || '' : ''),
        dns: editing.type === 'ip_address' ? editing.dns || '' : (editing.type?.startsWith('custom_') ? editing.customProperties?.dns || '' : ''),
        vlan: editing.type === 'ip_address' ? editing.vlan || '' : (editing.type?.startsWith('custom_') ? editing.customProperties?.vlan || '' : ''),
        isWlan: editing.type === 'ip_address' ? editing.isWlan || false : (editing.type?.startsWith('custom_') ? editing.customProperties?.isWlan === 'true' : false),
        serialNumber: 'serialNumber' in editing ? editing.serialNumber : '',
        model: 'model' in editing ? editing.model : '',
        manufacturer: 'manufacturer' in editing ? editing.manufacturer : '',
        operatingSystem: editing.type === 'pc' ? editing.operatingSystem : '',
        processor: editing.type === 'pc' ? editing.processor : '',
        memory: editing.type === 'pc' ? editing.memory : '',
        storage: editing.type === 'pc' ? editing.storage : '',
        pcIpAddress: editing.type === 'pc' ? editing.ipAddress || '' : '',
        peripheralType: editing.type === 'peripheral' ? editing.peripheralType : 'keyboard',
        connectionType: editing.type === 'peripheral' ? editing.connectionType || '' : '',
        networkDeviceType: editing.type === 'network_device' ? editing.deviceType : 'router',
        macAddress: editing.type === 'network_device' ? editing.macAddress || '' : '',
        portCount: editing.type === 'network_device' ? String(editing.portCount || '') : '',
        networkIpAddress: editing.type === 'network_device' ? editing.ipAddress || '' : '',
        mobileDeviceType: editing.type === 'mobile_device' ? editing.deviceType : 'smartphone',
        mobileOS: editing.type === 'mobile_device' ? editing.operatingSystem : '',
        imei: editing.type === 'mobile_device' ? editing.imei || '' : '',
        phoneNumber: editing.type === 'mobile_device' ? editing.phoneNumber || '' : '',
        printerType: editing.type === 'printer' ? editing.printerType : 'laser',
        printerIpAddress: editing.type === 'printer' ? editing.ipAddress || '' : '',
        isNetworked: editing.type === 'printer' ? editing.isNetworked : false,
      });

      if (editing.type.startsWith('custom_')) {
        setCustomFieldsData(editing.customProperties || {});
      } else {
        setCustomFieldsData({});
      }
    } else {
      setFormData({
        name: '', status: 'active', location: '', assignedTo: '', details: '', parentAssetId: 'none',
        ipAddress: '', subnet: '', gateway: '', dns: '', vlan: '', isWlan: false,
        serialNumber: '', model: '', manufacturer: '',
        operatingSystem: '', processor: '', memory: '', storage: '', pcIpAddress: '',
        peripheralType: 'keyboard', connectionType: '',
        networkDeviceType: 'router', macAddress: '', portCount: '', networkIpAddress: '',
        mobileDeviceType: 'smartphone', mobileOS: '', imei: '', phoneNumber: '',
        printerType: 'laser', printerIpAddress: '', isNetworked: false,
      });
      setCustomFieldsData({});
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
      details: formData.details || undefined,
      parentAssetId: formData.parentAssetId !== 'none' ? formData.parentAssetId : undefined,
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
          isWlan: formData.isWlan || false,
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
        // Handle CustomAssets
        if (assetType.startsWith("custom_")) {
          const typeId = assetType.substring(7);
          const typeDef = customAssetTypes.find(t => t.id === typeId);
          let customProps = { ...customFieldsData };

          if (typeDef?.requiresIpAddress) {
            if (formData.subnet) customProps['subnet'] = formData.subnet;
            if (formData.gateway) customProps['gateway'] = formData.gateway;
            if (formData.dns) customProps['dns'] = formData.dns;
            if (formData.vlan) customProps['vlan'] = formData.vlan;
            customProps['isWlan'] = formData.isWlan ? 'true' : 'false';
          }

          asset = {
            ...baseAsset,
            type: assetType, // Will be ignored by backend for type, backend looks at AssetTypeId or URL
            assetTypeId: typeId,
            ipAddress: formData.ipAddress || undefined,
            customProperties: customProps
          };
        } else {
          return;
        }
        break;
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

  const handleCustomFieldChange = (fieldId: string, value: string | boolean) => {
    setCustomFieldsData(prev => ({ ...prev, [fieldId]: String(value) }));
  };

  const renderIpAddressFields = (title: string, description: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ipAddress">IP Address *</Label>
            <Input id="ipAddress" value={formData.ipAddress} onChange={(e) => handleInputChange('ipAddress', e.target.value)} placeholder="192.168.1.100" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subnet">Subnet *</Label>
            <Input id="subnet" value={formData.subnet} onChange={(e) => handleInputChange('subnet', e.target.value)} placeholder="255.255.255.0" />
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
          <div className="space-y-2 flex items-center pt-2 gap-2">
            <Switch id="isWlan" checked={formData.isWlan} onCheckedChange={(checked) => handleInputChange('isWlan', checked)} />
            <Label htmlFor="isWlan">Is WLAN</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTypeSpecificFields = () => {
    switch (assetType) {
      case 'ip_address':
        return renderIpAddressFields('IP Address Details', 'Network configuration information');

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
      default:
        if (assetType.startsWith("custom_")) {
          const typeDef = customAssetTypes.find(t => t.id === assetType.substring(7));
          if (!typeDef) return null;

          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{typeDef.name} Details</CardTitle>
                  <CardDescription>{typeDef.description || 'Custom asset information'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {(typeDef.fields || []).slice().sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map(field => {
                      const fieldId = field.id || field.name; // Fallback to name if id is missing somehow
                      const value = customFieldsData[fieldId] || '';
                      if (field.dataType === 'boolean') {
                        return (
                          <div key={fieldId} className="space-y-2 flex items-center gap-2 pt-6">
                            <Switch
                              id={fieldId}
                              checked={value === 'true'}
                              onCheckedChange={(checked) => handleCustomFieldChange(fieldId, checked.toString())}
                            />
                            <Label htmlFor={fieldId}>{field.name} {field.isRequired && '*'}</Label>
                          </div>
                        );
                      }
                      return (
                        <div key={fieldId} className="space-y-2">
                          <Label htmlFor={fieldId}>{field.name} {field.isRequired && '*'}</Label>
                          <Input
                            id={fieldId}
                            type={field.dataType === 'date' ? 'date' : field.dataType === 'number' ? 'number' : 'text'}
                            value={value}
                            onChange={(e) => handleCustomFieldChange(fieldId, e.target.value)}
                            required={field.isRequired}
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              {typeDef.requiresIpAddress && renderIpAddressFields("Network Details", "Network & IP Information for this Asset")}
            </div>
          );
        }
        return null;
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
              <Select value={assetType} onValueChange={(v: string) => setAssetType(v)} disabled={!!editingAsset}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ASSET_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                  {customAssetTypes.map(t => (
                    <SelectItem key={t.id} value={`custom_${t.id}`}>{t.name}</SelectItem>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input id="assignedTo" value={formData.assignedTo} onChange={(e) => handleInputChange('assignedTo', e.target.value)} placeholder="User or Department" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentAssetId">Assigned Asset (Parent)</Label>
              <Select value={formData.parentAssetId} onValueChange={(v) => handleInputChange('parentAssetId', v)}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {allAssets.filter(a => a.id !== editingAsset?.id).map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name} ({a.type})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Details / Notes</Label>
            <Input id="details" value={formData.details} onChange={(e) => handleInputChange('details', e.target.value)} placeholder="Additional information..." />
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

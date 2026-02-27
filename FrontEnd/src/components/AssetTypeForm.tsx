import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { AssetTypeDef, AssetTypeField } from "@/types/asset";
import { Plus, Trash2 } from "lucide-react";

interface AssetTypeFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (assetType: Omit<AssetTypeDef, 'id' | 'createdAt' | 'updatedAt'>) => void;
    editingType?: AssetTypeDef;
}

export const AssetTypeForm = ({ isOpen, onClose, onSave, editingType }: AssetTypeFormProps) => {
    const [name, setName] = useState(editingType?.name || "");
    const [description, setDescription] = useState(editingType?.description || "");
    const [requiresIpAddress, setRequiresIpAddress] = useState(editingType?.requiresIpAddress || false);
    const [fields, setFields] = useState<Omit<AssetTypeField, 'id' | 'assetTypeId'>[]>(
        editingType?.fields || [
            { name: "Serial Number", dataType: "text", isRequired: true, displayOrder: 1 },
            { name: "Manufacturer", dataType: "text", isRequired: true, displayOrder: 2 },
        ]
    );

    useEffect(() => {
        if (editingType) {
            setName(editingType.name);
            setDescription(editingType.description || "");
            setRequiresIpAddress(editingType.requiresIpAddress || false);
            setFields(editingType.fields);
        } else {
            setName("");
            setDescription("");
            setRequiresIpAddress(false);
            setFields([
                { name: "Serial Number", dataType: "text", isRequired: true, displayOrder: 1 },
                { name: "Manufacturer", dataType: "text", isRequired: true, displayOrder: 2 },
            ]);
        }
    }, [editingType, isOpen]);

    const addField = () => {
        setFields([...fields, { name: "", dataType: "text", isRequired: false, displayOrder: fields.length + 1 }]);
    };

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const updateField = (index: number, key: keyof AssetTypeField, value: any) => {
        const updated = [...fields];
        updated[index] = { ...updated[index], [key]: value };
        setFields(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        onSave({
            name,
            description,
            isCustom: true,
            requiresIpAddress,
            fields: fields.map((f, i) => ({ ...f, displayOrder: i + 1 })) as AssetTypeField[]
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingType ? 'Edit Asset Type' : 'Create Custom Asset Type'}</DialogTitle>
                    <DialogDescription>Define a new type of asset and its dynamic fields.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Asset Type Name *</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Projector, Drone, etc." required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
                        </div>
                        <div className="space-y-2 flex items-center pt-2 gap-2">
                            <Switch checked={requiresIpAddress} onCheckedChange={setRequiresIpAddress} id="requiresIpAddress" />
                            <Label htmlFor="requiresIpAddress">Network Device (Has IP Address)</Label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Custom Fields</h3>
                            <Button type="button" onClick={addField} variant="outline" size="sm" className="gap-2">
                                <Plus className="h-4 w-4" /> Add Field
                            </Button>
                        </div>

                        {fields.map((field, index) => (
                            <Card key={index}>
                                <CardContent className="p-4 grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-5 space-y-2">
                                        <Label>Field Name *</Label>
                                        <Input value={field.name} onChange={(e) => updateField(index, 'name', e.target.value)} placeholder="e.g. Lens Type" required />
                                    </div>
                                    <div className="col-span-3 space-y-2">
                                        <Label>Data Type</Label>
                                        <Select value={field.dataType} onValueChange={(v) => updateField(index, 'dataType', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">Text</SelectItem>
                                                <SelectItem value="number">Number</SelectItem>
                                                <SelectItem value="date">Date</SelectItem>
                                                <SelectItem value="boolean">Yes/No (Boolean)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-3 space-y-2 flex items-center pt-6 gap-2">
                                        <Switch checked={field.isRequired} onCheckedChange={(v) => updateField(index, 'isRequired', v)} />
                                        <Label>Required</Label>
                                    </div>
                                    <div className="col-span-1 flex justify-end pt-6">
                                        <Button type="button" variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => removeField(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {fields.length === 0 && (
                            <div className="text-center py-4 text-muted-foreground border rounded-lg border-dashed">
                                No custom fields defined. Add some fields to characterize this asset type.
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-gradient-primary">{editingType ? 'Save Changes' : 'Create Asset Type'}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

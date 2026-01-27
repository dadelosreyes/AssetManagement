import { useState } from "react";
import { AssetDashboard } from "@/components/AssetDashboard";
import { AssetTable } from "@/components/AssetTable";
import { AddAssetForm } from "@/components/AddAssetForm";
import { AppBar } from "@/components/AppBar";
import { AssetType } from "@/types/asset";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  assetApi,
  ipAddressApi,
  pcApi,
  peripheralApi,
  networkDeviceApi,
  mobileDeviceApi,
  printerApi,
} from "@/services/api";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DebugPanel } from "@/components/DebugPanel";

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetType | undefined>();
  const [deleteAssetId, setDeleteAssetId] = useState<string | null>(null);

  // Fetch assets
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: () => assetApi.getAllAssets(),
  });

  // Helper to get the correct API based on asset type
  const getApiForType = (type: AssetType["type"]) => {
    switch (type) {
      case "ip_address": return ipAddressApi;
      case "pc": return pcApi;
      case "peripheral": return peripheralApi;
      case "network_device": return networkDeviceApi;
      case "mobile_device": return mobileDeviceApi;
      case "printer": return printerApi;
      default: throw new Error(`Unknown asset type: ${type}`);
    }
  };

  // Create mutation
  const createMutation = useMutation<AssetType, Error, Partial<AssetType>>({
    mutationFn: (newAsset: Partial<AssetType>) => {
      const api = getApiForType(newAsset.type!);
      // @ts-ignore
      return api.create(newAsset);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast({ title: "Asset added", description: "Successfully created new asset." });
      setIsFormOpen(false);
      setEditingAsset(undefined);
    },
  });

  // Update mutation
  const updateMutation = useMutation<void, Error, AssetType>({
    mutationFn: (updatedAsset: AssetType) => {
      const api = getApiForType(updatedAsset.type);
      // @ts-ignore
      return api.update(updatedAsset.id, updatedAsset);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast({ title: "Asset updated", description: "Successfully updated asset." });
      setIsFormOpen(false);
      setEditingAsset(undefined);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (assetId: string) => {
      const asset = assets.find((a) => a.id === assetId);
      if (!asset) throw new Error("Asset not found");
      const api = getApiForType(asset.type);
      return api.delete(assetId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast({ title: "Asset deleted", description: "The asset has been removed from the system.", variant: "destructive" });
      setDeleteAssetId(null);
    },
  });

  const handleSaveAsset = (asset: any) => {
    if (editingAsset) {
      updateMutation.mutate(asset);
    } else {
      createMutation.mutate(asset);
    }
  };

  const handleEditAsset = (asset: AssetType) => {
    setEditingAsset(asset);
    setIsFormOpen(true);
  };

  const handleDeleteAsset = (id: string) => {
    setDeleteAssetId(id);
  };

  const confirmDeleteAsset = () => {
    if (deleteAssetId) {
      deleteMutation.mutate(deleteAssetId);
    }
  };

  const handleAddAsset = () => {
    setEditingAsset(undefined);
    setIsFormOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <AppBar />
      <div className="container mx-auto px-4 py-8 space-y-8">

        <AssetDashboard assets={assets} />

        <AssetTable
          assets={assets}
          onAddAsset={handleAddAsset}
          onEditAsset={handleEditAsset}
          onDeleteAsset={handleDeleteAsset}
        />

        <AddAssetForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingAsset(undefined);
          }}
          onSave={handleSaveAsset}
          editingAsset={editingAsset}
        />

        <AlertDialog open={!!deleteAssetId} onOpenChange={() => setDeleteAssetId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Asset</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this asset? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteAsset} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <DebugPanel />
      </div>
    </div>
  );
};

export default Index;

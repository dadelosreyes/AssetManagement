import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { AssetTable } from "@/components/AssetTable";
import { AddAssetForm } from "@/components/AddAssetForm";
import { AssetType } from "@/types/asset";
import { useToast } from "@/hooks/use-toast";
import { DebugPanel } from "@/components/DebugPanel";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  assetApi,
  ipAddressApi,
  pcApi,
  peripheralApi,
  networkDeviceApi,
  mobileDeviceApi,
  printerApi,
} from "@/services/api";

const Assets = () => {
  console.log("🔥 Assets.tsx component loaded/rendered");
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
      case "ip_address":
        return ipAddressApi;
      case "pc":
        return pcApi;
      case "peripheral":
        return peripheralApi;
      case "network_device":
        return networkDeviceApi;
      case "mobile_device":
        return mobileDeviceApi;
      case "printer":
        return printerApi;
      default:
        throw new Error(`Unknown asset type: ${type}`);
    }
  };

  // Create mutation
  const createMutation = useMutation<AssetType, Error, Partial<AssetType>>({
    mutationFn: (newAsset: Partial<AssetType>) => {
      console.log("Creating asset:", newAsset);
      const api = getApiForType(newAsset.type);
      // @ts-ignore - Dynamic dispatch is tricky with strict types, but effectively safe here
      return api.create(newAsset);
    },
    onSuccess: (data) => {
      console.log("Asset created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast({ title: "Asset added", description: "Successfully created new asset." });
      setIsFormOpen(false);
      setEditingAsset(undefined);
    },
    onError: (error) => {
      console.error("Failed to create asset:", error);
      toast({
        title: "Error",
        description: `Failed to create asset: ${error.message}`,
        variant: "destructive",
      });
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
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update asset: ${error.message}`,
        variant: "destructive",
      });
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
      toast({
        title: "Asset deleted",
        description: "Successfully removed asset.",
        variant: "destructive",
      });
      setDeleteAssetId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete asset: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSaveAsset = (asset: any) => {
    console.log("handleSaveAsset called with:", asset);
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

  if (isLoading) {
    return <div className="p-8 text-center">Loading assets...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Assets</h1>
        <AssetTable
          assets={assets}
          onAddAsset={handleAddAsset}
          onEditAsset={handleEditAsset}
          onDeleteAsset={handleDeleteAsset}
        />

        <AddAssetForm
          isOpen={isFormOpen}
          onClose={() => {
            console.log("🔵 onClose called");
            setIsFormOpen(false);
            setEditingAsset(undefined);
          }}
          onSave={(asset) => {
            console.log("🔵 onSave prop received in Assets.tsx:", asset);
            handleSaveAsset(asset);
          }}
          editingAsset={editingAsset}
        />

        <AlertDialog open={!!deleteAssetId || deleteMutation.isPending} onOpenChange={(open) => !open && setDeleteAssetId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Asset</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this asset? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  confirmDeleteAsset();
                }}
                disabled={deleteMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <DebugPanel />
      </div>
    </div>
  );
};

export default Assets;

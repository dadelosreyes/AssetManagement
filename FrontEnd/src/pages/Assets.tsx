import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { AssetTable } from "@/components/AssetTable";
import { AddAssetForm } from "@/components/AddAssetForm";
import { sampleAssets } from "@/data/sampleAssets";
import { AssetType } from "@/types/asset";
import { useToast } from "@/hooks/use-toast";
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

const Assets = () => {
  const { toast } = useToast();
  const [assets, setAssets] = useState<AssetType[]>(sampleAssets);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetType | undefined>();
  const [deleteAssetId, setDeleteAssetId] = useState<string | null>(null);

  const handleSaveAsset = (asset: AssetType) => {
    if (editingAsset) {
      setAssets(assets.map((a) => (a.id === asset.id ? asset : a)));
      toast({ title: "Asset updated", description: `${asset.name} has been updated.` });
    } else {
      setAssets([...assets, asset]);
      toast({ title: "Asset added", description: `${asset.name} has been added.` });
    }
    setIsFormOpen(false);
    setEditingAsset(undefined);
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
      const asset = assets.find((a) => a.id === deleteAssetId);
      setAssets(assets.filter((a) => a.id !== deleteAssetId));
      toast({ title: "Asset deleted", description: `${asset?.name} has been removed.`, variant: "destructive" });
      setDeleteAssetId(null);
    }
  };

  const handleAddAsset = () => {
    setEditingAsset(undefined);
    setIsFormOpen(true);
  };

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
              <AlertDialogAction onClick={confirmDeleteAsset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Assets;

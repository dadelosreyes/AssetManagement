import { useState } from "react";
import { AssetDashboard } from "@/components/AssetDashboard";
import { AssetTable } from "@/components/AssetTable";
import { AddAssetForm } from "@/components/AddAssetForm";
import { AppBar } from "@/components/AppBar";
import { AssetType } from "@/types/asset";
import { sampleAssets } from "@/data/sampleAssets";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Index = () => {
  const [assets, setAssets] = useState<AssetType[]>(sampleAssets);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetType | undefined>();
  const [deleteAssetId, setDeleteAssetId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSaveAsset = (asset: AssetType) => {
    if (editingAsset) {
      setAssets(prev => prev.map(a => a.id === asset.id ? asset : a));
    } else {
      setAssets(prev => [...prev, asset]);
    }
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
      setAssets(prev => prev.filter(a => a.id !== deleteAssetId));
      setDeleteAssetId(null);
      toast({
        title: "Asset Deleted",
        description: "The asset has been removed from the system.",
        variant: "destructive",
      });
    }
  };

  const handleAddAsset = () => {
    setEditingAsset(undefined);
    setIsFormOpen(true);
  };

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
      </div>
    </div>
  );
};

export default Index;

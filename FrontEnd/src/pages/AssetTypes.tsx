import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Settings2, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { assetTypeApi } from "@/services/api";
import { AssetTypeDef } from "@/types/asset";
import { AssetTypeForm } from "@/components/AssetTypeForm";
import { AppBar } from "@/components/AppBar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const AssetTypes = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingType, setEditingType] = useState<AssetTypeDef | undefined>();
    const [typeToDelete, setTypeToDelete] = useState<AssetTypeDef | null>(null);

    const { data: assetTypes, isLoading } = useQuery({
        queryKey: ['asset-types'],
        queryFn: assetTypeApi.getAll,
    });

    const createMutation = useMutation({
        mutationFn: assetTypeApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['asset-types'] });
            toast({ title: "Success", description: "Asset type created successfully." });
            setIsFormOpen(false);
        },
        onError: (err: Error) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<AssetTypeDef> }) => assetTypeApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['asset-types'] });
            toast({ title: "Success", description: "Asset type updated successfully." });
            setIsFormOpen(false);
            setEditingType(undefined);
        },
        onError: (err: Error) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: assetTypeApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['asset-types'] });
            toast({ title: "Success", description: "Asset type deleted successfully." });
            setTypeToDelete(null);
        },
        onError: (err: Error) => {
            toast({ title: "Error", description: err.message || "Failed to delete asset type.", variant: "destructive" });
            setTypeToDelete(null);
        }
    });

    const handleSave = (assetTypeData: Omit<AssetTypeDef, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingType) {
            updateMutation.mutate({ id: editingType.id, data: { ...assetTypeData, id: editingType.id } as Partial<AssetTypeDef> });
        } else {
            createMutation.mutate(assetTypeData);
        }
    };

    const handleEdit = (type: AssetTypeDef) => {
        setEditingType(type);
        setIsFormOpen(true);
    };

    const _handleDelete = () => {
        if (typeToDelete) {
            deleteMutation.mutate(typeToDelete.id);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <AppBar />
            <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Asset Types</h1>
                        <p className="text-slate-500 mt-1">Manage custom asset types and their dynamic fields.</p>
                    </div>
                    <Button onClick={() => { setEditingType(undefined); setIsFormOpen(true); }} className="bg-gradient-primary gap-2">
                        <Plus className="h-4 w-4" /> Create Custom Type
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assetTypes?.map((type) => (
                            <Card key={type.id} className="relative group overflow-hidden border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <Settings2 className="h-5 w-5" />
                                            </div>
                                            <CardTitle className="text-xl">{type.name}</CardTitle>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-primary" onClick={() => handleEdit(type)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-destructive" onClick={() => setTypeToDelete(type)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    {type.description && <CardDescription className="mt-2">{type.description}</CardDescription>}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm font-medium text-slate-900 mb-2">Fields ({type.fields?.length || 0})</div>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        {type.fields?.sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 5).map(f => (
                                            <span key={f.id || f.name} className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                                {f.name} <span className="text-slate-400">({f.dataType})</span>
                                            </span>
                                        ))}
                                        {(type.fields?.length || 0) > 5 && (
                                            <span className="px-2 py-1 rounded-md bg-slate-50 text-slate-500 border border-slate-100">
                                                +{(type.fields?.length || 0) - 5} more
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {assetTypes?.length === 0 && (
                            <div className="col-span-full text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <Settings2 className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                                <h3 className="text-lg font-medium text-slate-900">No custom asset types</h3>
                                <p className="mt-1">Create your first custom asset type to get started.</p>
                                <Button onClick={() => { setEditingType(undefined); setIsFormOpen(true); }} variant="outline" className="mt-4 gap-2">
                                    <Plus className="h-4 w-4" /> Create Custom Type
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <AssetTypeForm
                    isOpen={isFormOpen}
                    onClose={() => { setIsFormOpen(false); setEditingType(undefined); }}
                    onSave={handleSave}
                    editingType={editingType}
                />

                <AlertDialog open={!!typeToDelete} onOpenChange={(open) => !open && setTypeToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the <strong>{typeToDelete?.name}</strong> asset type.
                                You cannot delete this type if there are assets belonging to it.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={_handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default AssetTypes;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { sampleAssets } from "@/data/sampleAssets";
import {
    ipAddressApi,
    pcApi,
    peripheralApi,
    networkDeviceApi,
    mobileDeviceApi,
    printerApi,
} from "@/services/api";
import { AssetType } from "@/types/asset";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export const DebugPanel = () => {
    const [isSeeding, setIsSeeding] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();

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

    const handleSeedData = async () => {
        setIsSeeding(true);
        let successCount = 0;
        let failCount = 0;

        try {
            console.log("Starting data seeding...");

            // Process assets sequentially to avoid overwhelming the backend or hitting concurrency limits
            for (const asset of sampleAssets) {
                try {
                    // Remove ID to let backend generate it (or keep it if your backend supports GUID assignment)
                    // Usually best to let backend handle IDs for new creates, but depends on your backend logic.
                    // Since sampleAssets IDs are likely simple strings like "1", "2", we might conflict if we keep them 
                    // AND the backend expects GUIDs. 
                    // However, the sample data has specific data. Let's try sending as-is first, 
                    // if it fails we might need to omit ID.
                    // LOOKING AT sampleAssets.ts: id is "1", "2"...
                    // LOOKING AT BACKEND: uses string IDs. 
                    // If we send an ID, the backend might try to use it.
                    // Let's try to remove the ID to be safe and let the backend (EF Core) generate a new one 
                    // OR if the backend allows explicit IDs.
                    // The Create methods in `api.ts` take `Partial<T>`, so we can just pass the asset.

                    // IMPORTANT: The backend EF Core usually expects a GUID or int key. 
                    // If the backend model `id` is a string (which it likely is for GUIDs), 
                    // sending "1" might fail if it tries to parse as GUID, or succeed if it just stores string.
                    // Let's create a copy without ID just to be safe and ensure clean DB state.
                    const { id, ...assetWithoutId } = asset;

                    const api = getApiForType(asset.type);
                    // @ts-ignore
                    await api.create(assetWithoutId);
                    successCount++;
                } catch (error) {
                    console.error(`Failed to seed asset ${asset.name}:`, error);
                    failCount++;
                }
            }

            await queryClient.invalidateQueries({ queryKey: ["assets"] });
            await queryClient.invalidateQueries({ queryKey: ["statistics"] });

            toast({
                title: "Seeding Complete",
                description: `Successfully added ${successCount} assets. Failed: ${failCount}`,
                variant: failCount > 0 ? "destructive" : "default",
            });
        } catch (error) {
            console.error("Seeding error:", error);
            toast({
                title: "Seeding Failed",
                description: "An unexpected error occurred during seeding.",
                variant: "destructive",
            });
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 p-4 bg-background border rounded-lg shadow-lg z-50">
            <h3 className="font-bold mb-2 text-sm">Debug Panel</h3>
            <Button
                onClick={handleSeedData}
                disabled={isSeeding}
                size="sm"
                className="w-full"
            >
                {isSeeding ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Seeding...
                    </>
                ) : (
                    "Seed Sample Data"
                )}
            </Button>
        </div>
    );
};

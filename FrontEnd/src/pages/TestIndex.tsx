// src/pages/TestApi.tsx
// A simple test page to understand how the API works

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Import the API functions
import { assetApi, pcApi } from "@/services/api";

const TestApi = () => {
  const { toast } = useToast();

  // State to store data from API
  const [allAssets, setAllAssets] = useState<any[]>([]);
  const [allPCs, setAllPCs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newPcId, setNewPcId] = useState<string | null>(null);

  // =============================================================================
  // TEST 1: Fetch all assets (GET request)
  // =============================================================================
  const testFetchAllAssets = async () => {
    setLoading(true);
    try {
      console.log("📡 Calling API: GET /api/Assets");

      const data = await assetApi.getAllAssets();

      console.log("✅ Response:", data);
      setAllAssets(data);

      toast({
        title: "Success!",
        description: `Loaded ${data.length} assets from the API`,
      });
    } catch (error) {
      console.error("❌ Error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch assets. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // TEST 2: Fetch only PCs (GET request)
  // =============================================================================
  const testFetchPCs = async () => {
    setLoading(true);
    try {
      console.log("📡 Calling API: GET /api/PCs");

      const data = await pcApi.getAll();

      console.log("✅ Response:", data);
      setAllPCs(data);

      toast({
        title: "Success!",
        description: `Loaded ${data.length} PCs from the API`,
      });
    } catch (error) {
      console.error("❌ Error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch PCs. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // TEST 3: Create a new PC (POST request)
  // =============================================================================
  const testCreatePC = async () => {
    setLoading(true);
    try {
      console.log("📡 Calling API: POST /api/PCs");

      // Create a test PC
      const newPC = {
        name: "Test PC " + Date.now(),
        type: "pc",
        status: "active",
        location: "Test Lab",
        assignedTo: "Test User",
        serialNumber: "TEST-" + Date.now(),
        model: "Test Model",
        manufacturer: "Test Manufacturer",
        operatingSystem: "Windows 11",
        processor: "Intel i7",
        memory: "16GB",
        storage: "512GB SSD",
      };

      console.log("📤 Sending:", newPC);

      const createdPC = await pcApi.create(newPC);

      console.log("✅ Created PC:", createdPC);
      setNewPcId(createdPC.id);

      toast({
        title: "Success!",
        description: `Created PC: ${createdPC.name}`,
      });

      // Refresh the PC list
      await testFetchPCs();
    } catch (error) {
      console.error("❌ Error:", error);
      toast({
        title: "Error",
        description: "Failed to create PC. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // TEST 4: Update the PC we just created (PUT request)
  // =============================================================================
  const testUpdatePC = async () => {
    if (!newPcId) {
      toast({
        title: "No PC to update",
        description: "Create a PC first using the 'Create a PC' button",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("📡 Calling API: PUT /api/PCs/" + newPcId);

      // Find the PC we created
      const pcToUpdate = allPCs.find((pc) => pc.id === newPcId);
      if (!pcToUpdate) {
        throw new Error("PC not found");
      }

      // Update it
      const updatedPC = {
        ...pcToUpdate,
        name: pcToUpdate.name + " (UPDATED)",
        memory: "32GB", // Upgrade the memory
      };

      console.log("📤 Sending:", updatedPC);

      await pcApi.update(newPcId, updatedPC);

      console.log("✅ Updated PC");

      toast({
        title: "Success!",
        description: `Updated PC: ${updatedPC.name}`,
      });

      // Refresh the PC list
      await testFetchPCs();
    } catch (error) {
      console.error("❌ Error:", error);
      toast({
        title: "Error",
        description: "Failed to update PC. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // TEST 5: Delete the PC we created (DELETE request)
  // =============================================================================
  const testDeletePC = async () => {
    if (!newPcId) {
      toast({
        title: "No PC to delete",
        description: "Create a PC first using the 'Create a PC' button",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("📡 Calling API: DELETE /api/PCs/" + newPcId);

      await pcApi.delete(newPcId);

      console.log("✅ Deleted PC");

      toast({
        title: "Success!",
        description: "Deleted the test PC",
        variant: "destructive",
      });

      setNewPcId(null);

      // Refresh the PC list
      await testFetchPCs();
    } catch (error) {
      console.error("❌ Error:", error);
      toast({
        title: "Error",
        description: "Failed to delete PC. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">API Test Page 🧪</h1>
          <p className="text-muted-foreground mt-2">
            Test your backend API connection. Open the browser console (F12) to
            see detailed logs.
          </p>
        </div>

        {/* Test Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>API Tests</CardTitle>
            <CardDescription>
              Click buttons to test different API operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={testFetchAllAssets}
                disabled={loading}
                variant="outline"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                1. Fetch All Assets (GET)
              </Button>

              <Button
                onClick={testFetchPCs}
                disabled={loading}
                variant="outline"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                2. Fetch Only PCs (GET)
              </Button>

              <Button
                onClick={testCreatePC}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                3. Create a PC (POST)
              </Button>

              <Button
                onClick={testUpdatePC}
                disabled={loading || !newPcId}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                4. Update PC (PUT)
              </Button>

              <Button
                onClick={testDeletePC}
                disabled={loading || !newPcId}
                variant="destructive"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                5. Delete PC (DELETE)
              </Button>
            </div>

            {newPcId && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  ✅ Test PC Created! ID:{" "}
                  <code className="bg-green-100 px-2 py-1 rounded">
                    {newPcId}
                  </code>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Display All Assets */}
        {allAssets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>All Assets ({allAssets.length})</CardTitle>
              <CardDescription>Data from GET /api/Assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allAssets.map((asset, index) => (
                  <div key={index} className="p-3 bg-muted rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{asset.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({asset.type})
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          asset.status === "active"
                            ? "bg-green-100 text-green-800"
                            : asset.status === "inactive"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {asset.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Location: {asset.location}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Display PCs */}
        {allPCs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>PCs Only ({allPCs.length})</CardTitle>
              <CardDescription>Data from GET /api/PCs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allPCs.map((pc, index) => (
                  <div key={index} className="p-3 bg-muted rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{pc.name}</span>
                        {pc.id === newPcId && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {pc.manufacturer} {pc.model}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {pc.processor} • {pc.memory} • {pc.storage}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Serial: {pc.serialNumber}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>📖 How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Step-by-step testing:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Make sure your backend API is running (dotnet run)</li>
                <li>Open browser console (F12) to see detailed API calls</li>
                <li>
                  Click "1. Fetch All Assets" - this will load all assets from
                  the API
                </li>
                <li>
                  Click "2. Fetch Only PCs" - this will load only PC assets
                </li>
                <li>
                  Click "3. Create a PC" - this will create a test PC in your
                  database
                </li>
                <li>
                  Click "4. Update PC" - this will update the PC you just
                  created
                </li>
                <li>Click "5. Delete PC" - this will delete the test PC</li>
              </ol>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="font-semibold text-blue-900 mb-2">
                💡 What's Happening:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Each button calls a function in{" "}
                  <code>src/services/api.ts</code>
                </li>
                <li>• That function makes an HTTP request to your backend</li>
                <li>• The backend responds with data (or success/error)</li>
                <li>• We update the React state with the new data</li>
                <li>• React re-renders to show the updated information</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h4 className="font-semibold text-yellow-900 mb-2">
                ⚠️ Common Issues:
              </h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>
                  • <strong>CORS Error:</strong> Make sure your backend has CORS
                  configured for localhost:5173
                </li>
                <li>
                  • <strong>Network Error:</strong> Check if your backend is
                  running on the correct port
                </li>
                <li>
                  • <strong>404 Error:</strong> Verify your API endpoints match
                  between frontend and backend
                </li>
                <li>
                  • <strong>500 Error:</strong> Check your backend console for
                  database or server errors
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestApi;

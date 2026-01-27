import { AppBar } from "@/components/AppBar";
import { AssetDashboard } from "@/components/AssetDashboard";
import { useQuery } from "@tanstack/react-query";
import { assetApi } from "@/services/api";

const Dashboard = () => {
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: () => assetApi.getAllAssets(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppBar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <AssetDashboard assets={assets} />
      </div>
    </div>
  );
};

export default Dashboard;

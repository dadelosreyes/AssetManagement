import { AppBar } from "@/components/AppBar";
import { AssetDashboard } from "@/components/AssetDashboard";
import { sampleAssets } from "@/data/sampleAssets";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <AssetDashboard assets={sampleAssets} />
      </div>
    </div>
  );
};

export default Dashboard;

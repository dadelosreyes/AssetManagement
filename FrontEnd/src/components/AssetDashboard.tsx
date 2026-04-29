import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Globe, Activity, AlertTriangle, Smartphone, Printer, Network, Mouse } from "lucide-react";
import { AssetType } from "@/types/asset";
import { useState } from "react";

interface AssetDashboardProps {
  assets: AssetType[];
}

export const AssetDashboard = ({ assets }: AssetDashboardProps) => {
  const [selectedStatus, setSelectedStatus] = useState<AssetType["status"] | null>(null);

  const totalAssets = assets.length;
  const activeAssets = assets.filter(asset => asset.status === "active").length;
  const inactiveAssets = assets.filter(asset => asset.status === "inactive").length;
  const maintenanceAssets = assets.filter(asset => asset.status === "maintenance").length;

  const countByType = (type: AssetType["type"]) =>
    assets.filter(asset => asset.type === type).length;

  const filteredAssets = selectedStatus
    ? assets.filter(asset => asset.status === selectedStatus)
    : [];

  const stats = [
    { title: "Total Assets", value: totalAssets, icon: Activity, description: "All managed assets", color: "bg-gradient-primary" },
    { title: "IP Addresses", value: countByType("ip_address"), icon: Globe, description: "Network addresses", color: "bg-gradient-primary" },
    { title: "PCs", value: countByType("pc"), icon: Monitor, description: "Computer systems", color: "bg-success" },
    { title: "Network Devices", value: countByType("network_device"), icon: Network, description: "Routers, switches, etc.", color: "bg-gradient-primary" },
    { title: "Mobile Devices", value: countByType("mobile_device"), icon: Smartphone, description: "Phones & tablets", color: "bg-gradient-primary" },
    { title: "Printers", value: countByType("printer"), icon: Printer, description: "Printing devices", color: "bg-gradient-primary" },
    { title: "Peripherals", value: countByType("peripheral"), icon: Mouse, description: "Keyboards, mice, etc.", color: "bg-gradient-primary" },
    { title: "Maintenance", value: maintenanceAssets, icon: AlertTriangle, description: "Under maintenance", color: "bg-warning" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Asset Overview</h2>
        <p className="text-muted-foreground">
          Manage and monitor your IT infrastructure assets
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title} className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Asset Status Distribution
          </CardTitle>
          <CardDescription>
            Click a status to view related assets
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Badge
              variant="secondary"
              onClick={() => setSelectedStatus("active")}
              className="cursor-pointer bg-success text-success-foreground"
            >
              Active: {activeAssets}
            </Badge>

            <Badge
              variant="secondary"
              onClick={() => setSelectedStatus("inactive")}
              className="cursor-pointer bg-destructive text-destructive-foreground"
            >
              Inactive: {inactiveAssets}
            </Badge>

            <Badge
              variant="secondary"
              onClick={() => setSelectedStatus("maintenance")}
              className="cursor-pointer bg-warning text-warning-foreground"
            >
              Maintenance: {maintenanceAssets}
            </Badge>

            {selectedStatus && (
              <Badge
                variant="outline"
                onClick={() => setSelectedStatus(null)}
                className="cursor-pointer"
              >
                Clear
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedStatus && (
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="capitalize">
              {selectedStatus} Assets
            </CardTitle>
            <CardDescription>
              Showing assets with {selectedStatus} status
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="rounded-lg border p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {asset.type}
                      </p>
                    </div>

                    <Badge variant="secondary">
                      {asset.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No assets found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
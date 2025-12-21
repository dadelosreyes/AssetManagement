import { AppBar } from "@/components/AppBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart3, PieChart, TrendingUp } from "lucide-react";

const Reports = () => {
  const reportTypes = [
    {
      title: "Asset Inventory Report",
      description: "Complete list of all assets with their current status",
      icon: FileText,
    },
    {
      title: "Usage Statistics",
      description: "Analysis of asset utilization and performance",
      icon: BarChart3,
    },
    {
      title: "Status Distribution",
      description: "Breakdown of assets by status categories",
      icon: PieChart,
    },
    {
      title: "Trend Analysis",
      description: "Historical trends and projections",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Reports</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {reportTypes.map((report) => (
            <Card key={report.title} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{report.title}</CardTitle>
                <report.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>{report.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;

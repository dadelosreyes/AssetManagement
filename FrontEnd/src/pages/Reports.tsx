import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { AppBar } from "@/components/AppBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, BarChart3, PieChart, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { assetApi } from "@/services/api";
import { AssetType } from "@/types/asset";

//download pdf
const downloadPDF = (filename: string, rows: Record<string, any>[]) => {
  if (!rows.length) return;

  const doc = new jsPDF();

  const headers = Object.keys(rows[0]);
  const data = rows.map((row) => headers.map((h) => row[h]));

  doc.text(filename, 14, 15);

  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 20,
  });

  doc.save(filename.replace(".csv", ".pdf"));
};

//download csv
const Reports = () => {
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: () => assetApi.getAllAssets(),
  });

  const convertToCSV = (rows: Record<string, any>[]) => {
    if (!rows.length) return "";

    const headers = Object.keys(rows[0]);

    return [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => `"${String(row[header] ?? "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");
  };

  const downloadCSV = (filename: string, rows: Record<string, any>[]) => {
    const csvContent = convertToCSV(rows);

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  const reports = [
    {
      title: "Asset Inventory Report",
      description: "Complete list of all assets with their status",
      icon: FileText,
      filename: "asset-inventory-report.csv",
      getRows: () =>
        assets.map((asset: AssetType) => ({
          name: asset.name,
          type: asset.type,
          status: asset.status,
          assignedTo: asset.assignedTo ?? "",
          location: asset.location ?? "",
        })),
    },
    {
      title: "Status Distribution",
      description: "Breakdown of assets by status categories",
      icon: PieChart,
      filename: "status-distribution.csv",
      getRows: () => {
        const counts = assets.reduce((acc: Record<string, number>, asset: AssetType) => {
          acc[asset.status] = (acc[asset.status] || 0) + 1;
          return acc;
        }, {});

        return Object.entries(counts).map(([status, count]) => ({
          status,
          count,
        }));
      },
    },
    {
      title: "Asset Type Distribution",
      description: "Breakdown of assets by type",
      icon: BarChart3,
      filename: "asset-type-distribution.csv",
      getRows: () => {
        const counts = assets.reduce((acc: Record<string, number>, asset: AssetType) => {
          acc[asset.type] = (acc[asset.type] || 0) + 1;
          return acc;
        }, {});

        return Object.entries(counts).map(([type, count]) => ({
          type,
          count,
          
        }));
            
      },
    },
    
    {
      title: "Trend Analysis",
      description: "Historical trends and projections",
      icon: TrendingUp,
      filename: "trend-analysis.csv",
      getRows: () =>
        assets.map((asset: AssetType) => ({
          name: asset.name,
          createdAt: asset.createdAt ?? "",
          updatedAt: asset.updatedAt ?? "",
          status: asset.status,
        })),
    },
  ];

  if (isLoading) {
    return <div className="p-8 text-center">Loading reports...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppBar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Reports</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {reports.map((report) => (
            <Card
              key={report.title}
              className="hover:shadow-lg transition-shadow"
>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {report.title}
                </CardTitle>
                  <report.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <CardDescription>{report.description}</CardDescription>

                {/*BUTTONS HERE */}
         <div className="flex gap-2 mt-4">
            <button
              onClick={() => downloadCSV(report.filename, report.getRows())}
              className="text-xs px-3 py-1 bg-muted rounded hover:bg-muted/80"
      >
             Download as CSV
            </button>
            <button
               onClick={() => downloadPDF(report.filename, report.getRows())}
              className="text-xs px-3 py-1 bg-primary text-white rounded hover:bg-primary/90"
      >
             Download as PDF
            </button>
        </div>
            </CardContent>
          </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
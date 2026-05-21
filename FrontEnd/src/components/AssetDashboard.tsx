import {
  CheckCircle2,
  XCircle,
  Wrench,
  X,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Monitor,
  Globe,
  Activity,
  AlertTriangle,
  Smartphone,
  Printer,
  Network,
  Mouse,
} from "lucide-react";

import { AssetType } from "@/types/asset";
import { useState } from "react";

// ========================================
// TYPES
// ========================================

// Props interface for the dashboard component
interface AssetDashboardProps {
  assets: AssetType[];
}

// ========================================
// COMPONENT
// ========================================

export const AssetDashboard = ({ assets }: AssetDashboardProps) => {

  

  // ========================================
  // STATE
  // ========================================

  // Stores the selected asset status filter
  // Example: "active", "inactive", "maintenance"
  const [selectedStatus, setSelectedStatus] =
    useState<AssetType["status"] | null>(null);

  // ========================================
  // HELPERS
  // ========================================

  // Checks if the badge is currently active
  const isActive = (status: AssetType["status"]) =>
    selectedStatus === status;

  // ========================================
  // SUMMARY COUNTS
  // ========================================

  // Total assets count
  const totalAssets = assets.length;

  // Count active assets
  const activeAssets = assets.filter(
    (asset) => asset.status === "active"
  ).length;

  // Count inactive assets
  const inactiveAssets = assets.filter(
    (asset) => asset.status === "inactive"
  ).length;

  // Count maintenance assets
  const maintenanceAssets = assets.filter(
    (asset) => asset.status === "maintenance"
  ).length;

  // ========================================
  // COUNT ASSETS BY TYPE
  // ========================================

  // Reusable function to count asset types
  const countByType = (type: AssetType["type"]) =>
    assets.filter((asset) => asset.type === type).length;

  // ========================================
  // FILTERED ASSETS
  // ========================================

  // Filters assets based on selected status
  const filteredAssets = selectedStatus
    ? assets.filter((asset) => asset.status === selectedStatus)
    : [];

  // ========================================
  // DASHBOARD STAT CARDS
  // ========================================

  // Array used to render dashboard statistic cards
  const stats = [
    {
      title: "Total Assets",
      value: totalAssets,
      icon: Activity,
      description: "All managed assets",
      color: "bg-gradient-primary",
    },
    {
      title: "IP Addresses",
      value: countByType("ip_address"),
      icon: Globe,
      description: "Network addresses",
      color: "bg-gradient-primary",
    },
    {
      title: "PCs",
      value: countByType("pc"),
      icon: Monitor,
      description: "Computer systems",
      color: "bg-success",
    },
    {
      title: "Network Devices",
      value: countByType("network_device"),
      icon: Network,
      description: "Routers, switches, etc.",
      color: "bg-gradient-primary",
    },
    {
      title: "Mobile Devices",
      value: countByType("mobile_device"),
      icon: Smartphone,
      description: "Phones & tablets",
      color: "bg-gradient-primary",
    },
    {
      title: "Printers",
      value: countByType("printer"),
      icon: Printer,
      description: "Printing devices",
      color: "bg-gradient-primary",
    },
    {
      title: "Peripherals",
      value: countByType("peripheral"),
      icon: Mouse,
      description: "Keyboards, mice, etc.",
      color: "bg-gradient-primary",
    },
    {
      title: "Maintenance",
      value: maintenanceAssets,
      icon: AlertTriangle,
      description: "Under maintenance",
      color: "bg-warning",
    },
  ];

  // ========================================
  // UI
  // ========================================

  return (
    <div className="space-y-6">

      {/* ========================================
          PAGE HEADER
      ======================================== */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Asset Overview
        </h2>

        <p className="text-muted-foreground">
          Manage and monitor your IT infrastructure assets
        </p>
      </div>

      {/* ========================================
          DASHBOARD STATISTICS CARDS
      ======================================== */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* Loop through all statistics */}
        {stats.map((stat) => {

          // Dynamic icon component
          const Icon = stat.icon;

          return (
            <Card key={stat.title} className="shadow-soft">

              {/* Card Header */}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

                {/* Card Title */}
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>

                {/* Icon Container */}
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>

              {/* Card Content */}
              <CardContent>

                {/* Main Value */}
                <div className="text-2xl font-bold">
                  {stat.value}
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ========================================
          STATUS DISTRIBUTION SECTION
      ======================================== */}
      <Card className="shadow-medium">

        {/* Header */}
        <CardHeader>

          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Asset Status Distribution
          </CardTitle>

          <CardDescription>
            Click a status to view related assets
          </CardDescription>
        </CardHeader>

        {/* Content */}
        <CardContent>

          {/* Status Badges Container */}
          <div className="flex flex-wrap gap-3 w-full">

            {/* ========================================
                ACTIVE BADGE
            ======================================== */}
            <Badge
              onClick={() => setSelectedStatus("active")}
              className={`
              cursor-pointer
              flex items-center justify-between
              flex-1 sm:flex-none
              min-w-[110px]
              sm:min-w-[130px]
              px-3
              py-1.5
              text-xs
              sm:text-sm
              rounded-md
              transition-all
              duration-200

              ${
                isActive("active")
                  ? "bg-green-500 text-white shadow-md ring-1 ring-green-300"
                  : "bg-success text-success-foreground hover:shadow-sm hover:opacity-90"
              }
            `}
            >
              <div className="flex items-center gap-1.5">  
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Active</span>
            </div>

            <span className="font-bold">
              {activeAssets}
            </span>
            </Badge>

            {/* ========================================
                INACTIVE BADGE
            ======================================== */}
            <Badge
              onClick={() => setSelectedStatus("inactive")}
              className={`
              cursor-pointer
              flex items-center justify-between
              flex-1 sm:flex-none
              min-w-[110px]
              sm:min-w-[130px]
              px-3
              py-1.5
              text-xs
              sm:text-sm
              rounded-md
              transition-all
              duration-200

              ${
                isActive("inactive")
                  ? "bg-red-500 text-white shadow-md ring-1 ring-red-300"
                  : "bg-destructive text-destructive-foreground hover:shadow-sm hover:opacity-90"
              }
            `}
            >
              <div className="flex items-center gap-1.5">
              <XCircle className="h-3.5 w-3.5" />
              <span>Inactive</span>
            </div>

            <span className="font-bold">
              {inactiveAssets}
            </span>
            </Badge>

            {/* ========================================
                MAINTENANCE BADGE
            ======================================== */}
            <Badge
              onClick={() => setSelectedStatus("maintenance")}
              className={`
              cursor-pointer
              flex items-center justify-between
              flex-1 sm:flex-none
              min-w-[110px]
              sm:min-w-[145px]
              px-3
              py-1.5
              text-xs
              sm:text-sm
              rounded-md
              transition-all
              duration-200

              ${
                isActive("maintenance")
                  ? "bg-yellow-500 text-black shadow-md ring-1 ring-yellow-300"
                  : "bg-warning text-warning-foreground hover:shadow-sm hover:opacity-90"
              }
            `}
            >
              <div className="flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5" />
              <span>Maintenance</span>
            </div>

            <span className="font-bold">
              {maintenanceAssets}
            </span>
            </Badge>

            {/* ========================================
                CLEAR FILTER BUTTON
            ======================================== */}
            {selectedStatus && (
              <Badge
                onClick={() => setSelectedStatus(null)}
                className="
                cursor-pointer
                flex items-center justify-center
                min-w-[110px]
                sm:min-w-[130px]
                px-3
                py-1.5
                text-xs
                sm:text-sm
                font-medium
                rounded-md
                border
                border-red-500
                bg-red-500
                text-white
                hover:bg-red-600
                hover:border-red-600
                transition-all
                duration-200
              "
              >
                <>
                <X className="h-3.5 w-3.5 mr-1" />
                Clear Filter
              </>
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          FILTERED ASSET TABLE
      ======================================== */}
      {selectedStatus && (
        <Card className="shadow-medium">

          {/* Header */}
          <CardHeader>

            <CardTitle className="capitalize">
              {selectedStatus} Assets
            </CardTitle>

            <CardDescription>
              Showing assets with {selectedStatus} status
            </CardDescription>
          </CardHeader>

          {/* Content */}
          <CardContent>

            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto">

              <table className="w-full border-collapse text-sm">

                {/* ========================================
                    TABLE HEAD
                ======================================== */}
                <thead>
                  <tr className="border-b text-left">

                    <th className="p-3">Name</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Assigned To</th>
                    <th className="p-3">Created At</th>
                    <th className="p-3">Updated At</th>
                  </tr>
                </thead>

                {/* ========================================
                    TABLE BODY
                ======================================== */}
                <tbody>

                  {/* If assets exist */}
                  {filteredAssets.length > 0 ? (

                    filteredAssets.map((asset) => (
                      <tr
                        key={asset.id}
                        className="border-b hover:bg-muted/50"
                      >

                        {/* Asset Name */}
                        <td className="p-3 font-medium">
                          {asset.name}
                        </td>

                        {/* Asset Status */}
                        <td className="p-3">
                          <Badge variant="secondary">
                            {asset.status}
                          </Badge>
                        </td>

                        {/* Asset Location */}
                        <td className="p-3">
                          {asset.location ?? "N/A"}
                        </td>

                        {/* Assigned User */}
                        <td className="p-3">
                          {asset.assignedTo ?? "N/A"}
                        </td>

                        {/* Created Date */}
                        <td className="p-3">
                          {asset.createdAt
                            ? new Date(asset.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>

                        {/* Updated Date */}
                        <td className="p-3">
                          {asset.updatedAt
                            ? new Date(asset.updatedAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))

                  ) : (

                    /* Empty State */
                    <tr>
                      <td
                        colSpan={9}
                        className="
                          p-4
                          text-center
                          text-muted-foreground
                        "
                      >
                        No assets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
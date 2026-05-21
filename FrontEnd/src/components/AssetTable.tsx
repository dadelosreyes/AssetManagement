import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Monitor,
  Globe,
  Smartphone,
  Printer,
  Network,
  Mouse,
} from "lucide-react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { AssetType, ASSET_TYPE_LABELS } from "@/types/asset";

interface AssetTableProps {
  assets: AssetType[];
  onAddAsset: () => void;
  onEditAsset: (asset: AssetType) => void;
  onDeleteAsset: (id: string) => void;
  onViewAsset: (asset: AssetType) => void;
}
export const AssetTable = ({
  assets,
  onAddAsset,
  onEditAsset,
  onDeleteAsset,
  onViewAsset,
}: AssetTableProps) => {


  // ================= STATE =================
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [exportMode, setExportMode] = useState<
    "all" | "filtered" | "page"
  >("filtered");

  // ================= FILTER =================
  const filteredAssets = assets.filter((asset) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      asset.name.toLowerCase().includes(search) ||
      asset.location.toLowerCase().includes(search) ||
      (asset.assignedTo || "")
        .toLowerCase()
        .includes(search);

    const matchesType =
      selectedType === "all" || asset.type === selectedType;

    return matchesSearch && matchesType;
  });

  // ================= PAGINATION =================
  const totalPages = Math.ceil(
    filteredAssets.length / itemsPerPage
  );

  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType]);

  // ================= EXPORT =================
  const handleExport = (format: "csv" | "xlsx") => {
    let data: AssetType[] = [];

    if (exportMode === "all") {
      data = assets;
    } else if (exportMode === "filtered") {
      data = filteredAssets;
    } else {
      data = paginatedAssets;
    }

    const exportData = data.map((a) => {
  const base = {
    Name: a.name,
    Type: a.type,
    Status: a.status,
    Location: a.location,
    AssignedTo: a.assignedTo || "-",
    CreatedAt: new Date(a.createdAt).toLocaleString(),
    UpdatedAt: new Date(a.updatedAt).toLocaleString(),
  };

  // ================= IP ADDRESS =================
  if (a.type === "ip_address") {
    return {
      ...base,
      IP: (a as any).ipAddress,
      Subnet: (a as any).subnet,
      VLAN: (a as any).vlan,
      Details: a.details || "",
    };
  }

  // ================= PC =================
  if (a.type === "pc") {
    return {
      ...base,
      Manufacturer: (a as any).manufacturer,
      Model: (a as any).model,
      SerialNumber: (a as any).serialNumber,
      IP: (a as any).ipAddress || "",
      OS: (a as any).operatingSystem || "",
      CPU: (a as any).cpu || "",
      RAM: (a as any).ram || "",
      Storage: (a as any).storage || "",
      Details: a.details || "",
    };
  }

  // ================= MOBILE =================
  if (a.type === "mobile_device") {
    return {
      ...base,
      Manufacturer: (a as any).manufacturer,
      Model: (a as any).model,
      OS: (a as any).operatingSystem,
      Phone: (a as any).phoneNumber || "",
      IMEI: (a as any).imei || "",
    };
  }

  // ================= PRINTER =================
  if (a.type === "printer") {
    return {
      ...base,
      Manufacturer: (a as any).manufacturer,
      Model: (a as any).model,
      Type: (a as any).printerType,
      IP: (a as any).ipAddress || "",
      Networked: (a as any).isNetworked ? "Yes" : "No",
    };
  }

  // ================= NETWORK DEVICE =================
  if (a.type === "network_device") {
    return {
      ...base,
      Manufacturer: (a as any).manufacturer,
      Model: (a as any).model,
      DeviceType: (a as any).deviceType,
      IP: (a as any).ipAddress || "",
    };
  }

  // ================= PERIPHERAL =================
  if (a.type === "peripheral") {
    return {
      ...base,
      Manufacturer: (a as any).manufacturer,
      Model: (a as any).model,
      PeripheralType: (a as any).peripheralType,
      ConnectionType: (a as any).connectionType,
    };
  }

  // ================= CUSTOM ASSETS =================
  if (a.type.startsWith("custom_")) {
    return {
      ...base,
      ...((a as any).customProperties || {}),
    };
  }

  return base;
});

    const ws = XLSX.utils.json_to_sheet(exportData);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "Assets"
    );

    const fileName =
      exportMode === "all"
        ? "all-assets"
        : exportMode === "filtered"
        ? "filtered-assets"
        : "page-assets";

    if (format === "csv") {
      const csv = XLSX.write(wb, {
        bookType: "csv",
        type: "array",
      });

      saveAs(
        new Blob([csv], {
          type: "text/csv;charset=utf-8;",
        }),
        `${fileName}.csv`
      );
    } else {
      const xlsx = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
      });

      saveAs(
        new Blob([xlsx], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `${fileName}.xlsx`
      );
    }
  };

  // ================= ICON =================
  const getIcon = (type: string) => {
    switch (type) {
      case "ip_address":
        return <Globe className="h-4 w-4" />;
      case "pc":
        return <Monitor className="h-4 w-4" />;
      case "mobile_device":
        return <Smartphone className="h-4 w-4" />;
      case "printer":
        return <Printer className="h-4 w-4" />;
      case "network_device":
        return <Network className="h-4 w-4" />;
      case "peripheral":
        return <Mouse className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  // ================= UI =================
  return (
    <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden">

  {/* HEADER */}
  <CardHeader className="border-b border-slate-200 bg-white">

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

      {/* TITLE */}
      <div>
        <CardTitle className="text-2xl font-semibold text-slate-900">
          Assets
        </CardTitle>

        <CardDescription className="text-slate-500">
          {filteredAssets.length} of {assets.length} shown
        </CardDescription>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-3">

        {/* EXPORT */}
        <Button
          variant="outline"
          className="border-slate-200 bg-white hover:bg-slate-50"
          onClick={() => handleExport("xlsx")}
        >
          Export
        </Button>

        {/* ADD */}
        <Button
          onClick={onAddAsset}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New asset
        </Button>
      </div>
    </div>

    {/* FILTER BAR */}
    <div className="flex flex-col lg:flex-row gap-3 mt-5">

      {/* SEARCH */}
      <div className="relative flex-1">

        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

        <Input
          placeholder="Search tag, name, serial, location..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="pl-10 bg-white border-slate-200"
        />
      </div>

      {/* CATEGORY */}
      <Select
        value={selectedType}
        onValueChange={setSelectedType}
      >
        <SelectTrigger className="w-full lg:w-[180px] border-slate-200 bg-white">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>

        <SelectContent>

          <SelectItem value="all">
            All categories
          </SelectItem>

          {Object.entries(ASSET_TYPE_LABELS).map(
            ([v, l]) => (
              <SelectItem key={v} value={v}>
                {l}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>

      {/* EXPORT MODE */}
      <Select
        value={exportMode}
        onValueChange={(v: any) =>
          setExportMode(v)
        }
      >
        <SelectTrigger className="w-full lg:w-[180px] border-slate-200 bg-white">
          <SelectValue placeholder="Export Mode" />
        </SelectTrigger>

        <SelectContent>

          <SelectItem value="all">
            All Data
          </SelectItem>

          <SelectItem value="filtered">
            Filtered Data
          </SelectItem>

          <SelectItem value="page">
            Current Page
          </SelectItem>

        </SelectContent>
      </Select>
    </div>
  </CardHeader>

  {/* TABLE */}
  <CardContent className="p-0">

    <div className="overflow-x-auto">

      <Table>

        {/* TABLE HEADER */}
        <TableHeader className="bg-slate-50">

          <TableRow className="border-b border-slate-200">

            <TableHead className="text-slate-600 font-medium">
              Type
            </TableHead>

            <TableHead className="text-slate-600 font-medium">
              Name
            </TableHead>

            <TableHead className="text-slate-600 font-medium">
              Category
            </TableHead>

            <TableHead className="text-slate-600 font-medium">
              Status
            </TableHead>

            <TableHead className="text-slate-600 font-medium">
              Location
            </TableHead>

            <TableHead className="text-slate-600 font-medium">
              Assigned
            </TableHead>

            <TableHead className="text-slate-600 font-medium">
              Actions
            </TableHead>

          </TableRow>
        </TableHeader>

        {/* BODY */}
        <TableBody>

          {paginatedAssets.length > 0 ? (
            paginatedAssets.map((a) => (

              <TableRow
                key={a.id}
                className="hover:bg-slate-50 transition border-b border-slate-100"
              >

                {/* TYPE */}
                <TableCell>

                  <div className="flex items-center gap-2 text-slate-700">

                    <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center">
                      {getIcon(a.type)}
                    </div>

                    <span className="text-sm">
                      {ASSET_TYPE_LABELS[a.type] || "Custom Asset"}
                    </span>
                  </div>
                </TableCell>

                {/* NAME */}
                <TableCell className="font-medium text-slate-900">
                  {a.name}
                </TableCell>

                {/* CATEGORY */}
                <TableCell className="text-slate-600">
                  {ASSET_TYPE_LABELS[a.type]}
                </TableCell>

                {/* STATUS */}
                <TableCell>

                  <span
                    className={`
                      px-2.5 py-1 rounded-md text-xs font-medium border
                      ${
                        a.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : a.status === "maintenance"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      }
                    `}
                  >
                    {a.status.toUpperCase()}
                  </span>
                </TableCell>

                {/* LOCATION */}
                <TableCell className="text-slate-700">
                  {a.location}
                </TableCell>

                {/* ASSIGNED */}
                <TableCell className="text-slate-700">
                  {a.assignedTo || "—"}
                </TableCell>

                {/* ACTIONS */}
                <TableCell>
                <div className="flex items-center gap-1">

                  {/* VIEW */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onViewAsset(a)}
                    className="hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </Button>

                  {/* EDIT */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEditAsset(a)}
                    className="hover:bg-slate-100"
                  >
                    <Edit className="h-4 w-4 text-slate-600" />
                  </Button>

                  {/* DELETE */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDeleteAsset(a.id)}
                    className="hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>

                </div>
              </TableCell>

              </TableRow>
            ))
          ) : (

            <TableRow>

              <TableCell
                colSpan={7}
                className="h-32 text-center text-slate-500"
              >
                No assets found.
              </TableCell>

            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

    {/* PAGINATION */}
    {totalPages > 1 && (

      <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-white">

        <Button
          variant="outline"
          onClick={() =>
            setCurrentPage((p) =>
              Math.max(p - 1, 1)
            )
          }
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <div className="text-sm text-slate-600">
          Page {currentPage} of {totalPages}
        </div>

        <Button
          variant="outline"
          onClick={() =>
            setCurrentPage((p) =>
              Math.min(p + 1, totalPages)
            )
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>

      </div>
    )}
  </CardContent>
</Card>
)};
export default AssetTable;
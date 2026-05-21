import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useRef, useState } from "react";
import { AppBar } from "@/components/AppBar";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  FileText,
  Upload,
  Download,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { assetApi } from "@/services/api";
import { AssetType } from "@/types/asset";

// ========================================
// PDF EXPORT
// ========================================
const downloadPDF = (
  filename: string,
  rows: Record<string, any>[]
) => {
  if (!rows.length) return;

  const doc = new jsPDF();

  const headers = Object.keys(rows[0]);

  const data = rows.map((row) =>
    headers.map((h) => row[h])
  );

  doc.text(filename, 14, 15);

  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 20,
  });

  doc.save(filename.replace(".csv", ".pdf"));
};

// ========================================
// EXCEL EXPORT
// ========================================
const downloadExcel = (
  filename: string,
  rows: Record<string, any>[]
) => {
  const worksheet =
    XLSX.utils.json_to_sheet(rows);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Report"
  );

  XLSX.writeFile(
    workbook,
    filename.replace(".csv", ".xlsx")
  );
};

// ========================================
// MAIN COMPONENT
// ========================================
const Reports = () => {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [importedRows, setImportedRows] =
    useState<any[]>([]);

  // ========================================
  // FETCH ASSETS
  // ========================================
  const { data: assets = [], isLoading } =
    useQuery({
      queryKey: ["assets"],
      queryFn: () =>
        assetApi.getAllAssets(),
    });

  // ========================================
  // CSV EXPORT
  // ========================================
  const downloadCSV = (
    filename: string,
    rows: Record<string, any>[]
  ) => {
    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    const csvOutput =
      XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csvOutput], {
      type: "text/csv;charset=utf-8;",
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  // ========================================
  // TEMPLATE DOWNLOAD
  // ========================================
  const downloadTemplate = () => {
    const template = [
      {
        Name: "",
        Type: "pc",
        Status: "active",
        AssignedTo: "",
        Location: "",
      },
    ];

    const worksheet =
      XLSX.utils.json_to_sheet(template);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Template"
    );

    XLSX.writeFile(
      workbook,
      "asset-import-template.xlsx"
    );
  };

  // ========================================
  // IMPORT EXCEL / CSV
  // ========================================
  const handleImport = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = (evt) => {
      const data = evt.target?.result;

      const workbook =
        XLSX.read(data, {
          type: "binary",
        });

      const sheetName =
        workbook.SheetNames[0];

      const worksheet =
        workbook.Sheets[sheetName];

      const jsonData =
        XLSX.utils.sheet_to_json(
          worksheet
        );

      setImportedRows(jsonData);

      console.log(
        "Imported Data:",
        jsonData
      );
    };

    reader.readAsBinaryString(file);
  };

  // ========================================
  // REPORT CONFIG
  // ========================================
  const reports = [
    {
      title:
        "Asset Inventory Report",

      description:
        "Complete list of all assets with their status",

      icon: FileText,

      filename:
        "asset-inventory-report.csv",

      getRows: () =>
        assets.map(
          (asset: AssetType) => ({
            Name: asset.name,
            Type: asset.type,
            Status: asset.status,
            AssignedTo:
              asset.assignedTo ?? "",
            Location:
              asset.location ?? "",
          })
        ),
    },
  ];

  // ========================================
  // LOADING
  // ========================================
  if (isLoading)
    return (
      <div className="p-8 text-center">
        Loading reports...
      </div>
    );

  // ========================================
  // UI
  // ========================================
  return (
    <div className="min-h-screen bg-background">
      <AppBar />

      <div className="container mx-auto px-4 py-8 space-y-6">

        {/* ========================================
            HEADER
        ======================================== */}
        <div>
          <h1 className="text-3xl font-bold">
            Reports & Data
          </h1>

          <p className="text-muted-foreground">
            Export, import, and manage
            asset reports
          </p>
        </div>

        {/* ========================================
            IMPORT SECTION
        ======================================== */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">

            <div
              className="
                border-2
                border-dashed
                rounded-xl
                p-10
                flex
                flex-col
                items-center
                justify-center
                text-center
                cursor-pointer
                hover:bg-muted/40
                transition
              "
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-3" />

              <h2 className="text-lg font-semibold">
                Import Excel / CSV
              </h2>

              <p className="text-sm text-muted-foreground">
                Click here to upload your
                asset file
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleImport}
              />
            </div>

            {/* TEMPLATE BUTTON */}
            <div className="flex justify-end mt-4">
              <button
                onClick={downloadTemplate}
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-lg
                  bg-primary
                  text-white
                  hover:bg-primary/90
                  text-sm
                  font-medium
                "
              >
                <Download className="h-4 w-4" />
                Download Template
              </button>
            </div>
          </CardContent>
        </Card>

        {/* ========================================
            IMPORT PREVIEW
        ======================================== */}
        {importedRows.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Imported Preview
              </CardTitle>

              <CardDescription>
                Showing first imported
                rows
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      {Object.keys(
                        importedRows[0]
                      ).map((key) => (
                        <th
                          key={key}
                          className="text-left p-3"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {importedRows
                      .slice(0, 5)
                      .map((row, i) => (
                        <tr
                          key={i}
                          className="border-b"
                        >
                          {Object.values(
                            row
                          ).map(
                            (
                              value: any,
                              idx
                            ) => (
                              <td
                                key={idx}
                                className="p-3"
                              >
                                {String(
                                  value
                                )}
                              </td>
                            )
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ========================================
            REPORT CARDS
        ======================================== */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {reports.map((report) => (
            <Card
              key={report.title}
              className="
                hover:shadow-lg
                transition-shadow
              "
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

                <CardTitle className="text-sm font-medium">
                  {report.title}
                </CardTitle>

                <report.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <CardDescription>
                  {report.description}
                </CardDescription>

                {/* EXPORT BUTTONS */}
                <div className="flex flex-wrap gap-2 mt-4">

                  {/* CSV */}
                  <button
                    onClick={() =>
                      downloadCSV(
                        report.filename,
                        report.getRows()
                      )
                    }
                    className="
                      text-[10px]
                      px-2
                      py-1
                      bg-muted
                      rounded
                      hover:bg-muted/80
                      uppercase
                      font-bold
                    "
                  >
                    CSV
                  </button>

                  {/* EXCEL */}
                  <button
                    onClick={() =>
                      downloadExcel(
                        report.filename,
                        report.getRows()
                      )
                    }
                    className="
                      text-[10px]
                      px-2
                      py-1
                      bg-green-100
                      text-green-700
                      rounded
                      hover:bg-green-200
                      uppercase
                      font-bold
                    "
                  >
                    Excel
                  </button>

                  {/* PDF */}
                  <button
                    onClick={() =>
                      downloadPDF(
                        report.filename,
                        report.getRows()
                      )
                    }
                    className="
                      text-[10px]
                      px-2
                      py-1
                      bg-primary
                      text-white
                      rounded
                      hover:bg-primary/90
                      uppercase
                      font-bold
                    "
                  >
                    PDF
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
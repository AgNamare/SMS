// src/lib/utils/exports.ts
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

export function exportCSV<T>(
  columns: { header: string; accessor: keyof T }[],
  data: T[]
) {
  const headers = columns.map((col) => col.header);
  const rows = data.map((row) => columns.map((col) => row[col.accessor]));

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n"
  );
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data.csv";
  link.click();
}

export function exportExcel<T>(
  columns: { header: string; accessor: keyof T }[],
  data: T[]
) {
  const headers = columns.map((col) => col.header);
  const rows = data.map((row) => columns.map((col) => row[col.accessor]));

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "data.xlsx");
}

export function exportPDF<T>(
  columns: { header: string; accessor: keyof T }[],
  data: T[]
) {
  const headers = columns.map((col) => col.header);
  const rows = data.map((row) =>
    columns.map((col) => String(row[col.accessor]))
  );

  const doc = new jsPDF();
  autoTable(doc, {
    head: [headers],
    body: rows,
  });
  doc.save("data.pdf");
}

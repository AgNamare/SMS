"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { Input } from "@/src/app/components/ui/input";
import { Button } from "@/src/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/app/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/src/app/components/ui/dropdown-menu";
import { ChevronDown, FileText, FileCheck, File, Search } from "lucide-react";
import { exportCSV, exportExcel, exportPDF } from "../lib/utils/exports";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  loading?: boolean;
  search: string;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
  setSearch: (val: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  setPage,
  totalPages,
  loading = false,
  search,
  rowsPerPage,
  setRowsPerPage,
  setSearch,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  const exportColumns: { header: string; accessor: keyof TData }[] =
    columns.map((col) => ({
      header:
        (typeof col.header === "string" ? col.header : col.id) ?? "Unknown",
      accessor: ((col as any).accessorKey ?? col.id) as keyof TData,
    }));

  return (
    <div className='relative w-full bg-white border-rounded-sm p-2 '>
      {/* Search, Rows, Columns, Export */}
      <div className='flex items-center py-4 gap-2 flex-wrap'>
        {/* Search */}
        <div className='relative max-w-sm'>
          <Search
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            size={16}
          />
          <Input
            placeholder='Search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-9 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none'
          />
        </div>

        {/* Rows per page */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline'>
              Rows: {rowsPerPage} <ChevronDown className='ml-1 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            {[10, 50, 100, 200].map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => {
                  setRowsPerPage(size);
                  setPage(1);
                }}>
                {size} rows
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Column visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown className='ml-1 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  className='capitalize'>
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline'>
              Export <ChevronDown className='ml-1 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => exportCSV(exportColumns, data)}>
              <FileText className='mr-2 h-4 w-4' /> CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportExcel(exportColumns, data)}>
              <FileCheck className='mr-2 h-4 w-4' /> Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportPDF(exportColumns, data)}>
              <File className='mr-2 h-4 w-4' /> PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table container */}
      <div className='relative overflow-hidden rounded-md border'>
        <Table className={`${loading ? "opacity-50" : "opacity-100"}`}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              // Skeleton loading state for initial load or loading state
              Array.from({ length: rowsPerPage }).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
                      <div className='h-4 bg-gray-200 rounded animate-pulse' />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              // Data rows
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // No results state (only when not loading and data exists but filtered out)
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'>
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1 || loading}>
          Previous
        </Button>
        <span className='px-3 py-1 text-sm'>
          Page {page} of {totalPages}
        </span>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages || loading}>
          Next
        </Button>
      </div>
    </div>
  );
}

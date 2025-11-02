"use client";

import { fromTimestamp } from "@/src/lib/utils/time";
import { ColumnDef } from "@tanstack/react-table";

export type Permission = {
  module: string;
  action: string;
  Description: string;
};

export const columns: ColumnDef<Permission>[] = [
  {
    accessorKey: "name",
    header: "Permission Name",
  },
  {
    accessorKey: "module",
    header: "Module",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];

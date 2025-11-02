"use client";

import { Checkbox } from "@/src/app/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (
  selectedPermissions: number[],
  setSelectedPermissions: React.Dispatch<React.SetStateAction<number[]>>
): ColumnDef<any>[] => [
  {
    id: "select",
    header: ({ table }) => {
      const allIds = table.getRowModel().rows.map((r) => r.original.id);
      const allSelected =
        allIds.length > 0 &&
        allIds.every((id) => selectedPermissions.includes(id));
      const someSelected =
        allIds.some((id) => selectedPermissions.includes(id)) && !allSelected;

      return (
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected}
          onCheckedChange={(checked) => {
            if (checked === true) {
              // Select all
              const newSelection = [...selectedPermissions];
              allIds.forEach((id) => {
                if (!newSelection.includes(id)) {
                  newSelection.push(id);
                }
              });
              setSelectedPermissions(newSelection);
            } else {
              // Deselect all
              setSelectedPermissions((prev) =>
                prev.filter((id) => !allIds.includes(id))
              );
            }
          }}
          aria-label='Select all'
        />
      );
    },
    cell: ({ row }) => {
      const id = row.original.id;
      const isChecked = selectedPermissions.includes(id);

      return (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isChecked}
            onCheckedChange={(checked) => {
              setSelectedPermissions((prev) => {
                if (checked) {
                  // Add to selection
                  return [...prev, id];
                } else {
                  // Remove from selection
                  return prev.filter((pid) => pid !== id);
                }
              });
            }}
            aria-label={`Select permission ${id}`}
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Permission",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];

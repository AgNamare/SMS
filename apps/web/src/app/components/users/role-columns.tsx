"use client";

import { fromTimestamp } from "@/src/lib/utils/time";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
export type Role = {
  id: number;
  name: string;
  isSystemRole: boolean;
  permissions?: any[];
  UserRole?: any[];
  createdAt?: number;
  updatedAt?: number;
};

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: "Role Name",
    cell: ({ row }) => (
      <div>
        <div className='font-medium'>{row.getValue("name")}</div>
      </div>
    ),
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const permissions = row.original.permissions || [];
      return (
        <div className='text-center'>
          <span className='font-medium'>{permissions.length}</span>
          {permissions.length > 0 && (
            <div className='text-xs text-gray-500 mt-1'>
              {permissions
                .slice(0, 2)
                .map((p: any) => p.name)
                .join(", ")}
              {permissions.length > 2 && "..."}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "UserRole",
    header: "Users",
    cell: ({ row }) => {
      const userRoles = row.original.UserRole || [];
      return (
        <div className='text-center'>
          <span className='font-medium'>{userRoles.length}</span>
          {userRoles.length > 0 && (
            <div className='text-xs text-gray-500 mt-1'>
              {userRoles
                .slice(0, 2)
                .map(
                  (ur: any) => `${ur.user?.first_name} ${ur.user?.last_name}`
                )
                .join(", ")}
              {userRoles.length > 2 && "..."}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as number;
      return createdAt ? (
        <div className='text-sm text-gray-500'>
          {fromTimestamp(createdAt).toLocaleDateString()}
        </div>
      ) : (
        <span className='text-gray-400'>-</span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const role = row.original;

      const handleAssignPermissions = () => {
        const event = new CustomEvent("assignPermissions", {
          detail: role,
        });
        window.dispatchEvent(event);
      };

      const handleEdit = () => {
        console.log("Edit role:", role.id);
      };

      const handleDelete = () => {
        console.log("Delete role:", role.id);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 p-0 hover:bg-accent'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleAssignPermissions}>
              Manage Permissions
            </DropdownMenuItem>

            {!role.isSystemRole && (
              <>
                <DropdownMenuItem onClick={handleEdit}>
                  Edit Role
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className='text-red-600 focus:text-red-600'>
                  Delete Role
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

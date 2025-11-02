"use client";

import { fromTimestamp } from "@/src/lib/utils/time";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  first_name: string;
  profile_photo: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "profile_photo",
    header: "Profile Photo",
    cell: ({ row }) => {
      const photoUrl = row.original.profile_photo;

      return photoUrl ? (
        <img
          src={photoUrl}
          alt={`${row.original.first_name}'s profile`}
          className='w-10 h-10 rounded-full object-cover border border-gray-200'
        />
      ) : (
        <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500'>
          N/A
        </div>
      );
    },
  },
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

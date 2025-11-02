// src/app/components/users/user-client.tsx
"use client";

import { DataTable } from "../../components/data-table";
import { UserCreatePopup } from "@/src/app/components/popups/UserCreatePopup"; // Import the popup
import { useApiData } from "../../hooks/use-api-data";
import { columns } from "./columns";
import { usePageInfo } from "../../hooks/use-page-info";

interface UsersClientProps {
  initialData: {
    data: any[];
    total: number;
    page: number;
    totalPages: number;
  };
  error?: string;
}

export function UsersClient({ initialData, error }: UsersClientProps) {
  usePageInfo("Users Management", [
    { label: "Users", href: "/dashboard/users" },
  ]);
  const {
    data: users,
    loading,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    search,
    setSearch,
    refresh,
  } = useApiData("/api/users", 1, 10, initialData);

  return (
    <div className='container mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Users Management</h1>
        {/* Only show the Create button if user has permission */}
        {<UserCreatePopup onUserCreated={refresh} />}
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 rounded-md p-4 mb-4'>
          <p className='text-red-800'>{error}</p>
        </div>
      )}

      <DataTable
        columns={columns}
        data={users}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        loading={loading}
        search={search}
        setSearch={setSearch}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />
    </div>
  );
}

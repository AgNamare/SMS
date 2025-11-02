// src/app/components/users/user-client.tsx
"use client";

import { DataTable } from "../../components/data-table";
import { useApiData } from "../../hooks/use-api-data";
import { columns } from "./permission-columns";

interface Permission {
  initialData: {
    data: any[];
    total: number;
    page: number;
    totalPages: number;
  };
  error?: string;
}

export function PermissionClient({ initialData, error }: Permission) {
  const {
    data: permissions,
    loading,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    search,
    setSearch,
  } = useApiData("/api/users/roles/permissions", 1, 10, initialData);

  return (
    <div className='container mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Permissions Management</h1>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 rounded-md p-4 mb-4'>
          <p className='text-red-800'>{error}</p>
        </div>
      )}

      <DataTable
        columns={columns}
        data={permissions}
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

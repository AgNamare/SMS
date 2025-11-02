// src/app/components/users/role-client.tsx
"use client";

import { DataTable } from "../../components/data-table";
import { useApiData } from "../../hooks/use-api-data";
import { usePageInfo } from "../../hooks/use-page-info";
import { PermissionAssignmentPopup } from "../popups/permission-assignment-popup";
import { columns } from "./role-columns";
import { useState, useEffect, useMemo } from "react";

interface RoleClientProps {
  initialData: {
    data: any[];
    total: number;
    page: number;
    totalPages: number;
  };
  initialModules: any[];
  error?: string;
}

export function RoleClient({
  initialData,
  initialModules,
  error,
}: RoleClientProps) {
  const breadcrumbs = useMemo(
    () => [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Role management", href: "/user/roles" },
    ],
    []
  );

  usePageInfo("Role Management", breadcrumbs);
  const {
    data: roles,
    loading,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    search,
    setSearch,
    refresh,
  } = useApiData("/api/users/roles", 1, 10, initialData);

  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [showPermissionPopup, setShowPermissionPopup] = useState(false);

  // Handle the custom event from the table
  useEffect(() => {
    const handleAssignPermissions = (event: CustomEvent) => {
      setSelectedRole(event.detail);
      setShowPermissionPopup(true);
    };

    window.addEventListener(
      "assignPermissions" as any,
      handleAssignPermissions as EventListener
    );

    return () => {
      window.removeEventListener(
        "assignPermissions" as any,
        handleAssignPermissions as EventListener
      );
    };
  }, []);

  const handlePermissionAssigned = () => {
    setShowPermissionPopup(false);
    setSelectedRole(null);
    refresh();
  };

  return (
    <div className='container mx-auto'>
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-md p-4 mb-4'>
          <p className='text-red-800'>{error}</p>
        </div>
      )}

      <DataTable
        columns={columns}
        data={roles}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        loading={loading}
        search={search}
        setSearch={setSearch}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />

      {/* Permission Assignment Popup */}
      {showPermissionPopup && selectedRole && (
        <PermissionAssignmentPopup
          role={selectedRole}
          modules={initialModules}
          onClose={() => setShowPermissionPopup(false)}
          onSuccess={handlePermissionAssigned}
        />
      )}
    </div>
  );
}

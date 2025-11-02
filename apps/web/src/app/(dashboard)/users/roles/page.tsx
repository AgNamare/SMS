// src/app/users/page.tsx
import { getServerSession } from "next-auth";
import { RoleClient } from "@/src/app/components/users/role-client";
import { RoleService } from "@/src/modules/user/services/role-service";
import { PermissionService } from "@/src/modules/user/services/permission-service";
import { authOptions } from "@/src/app/lib/auth-options";

export default async function RolesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div>Please log in to view roles</div>;
  }

  const roleService = new RoleService();
  const permissionService = new PermissionService();

  try {
    // Fetch initial roles data
    const initialData = await roleService.listPaginated(1, 10);

    // Fetch available modules for permission assignment
    const modules = await permissionService.getModules();

    return <RoleClient initialData={initialData} initialModules={modules} />;
  } catch (error) {
    console.error("Error loading roles page:", error);
    return (
      <RoleClient
        initialData={{ data: [], total: 0, page: 1, totalPages: 1 }}
        initialModules={[]}
      />
    );
  }
}

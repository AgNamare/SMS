import { getServerSession } from "next-auth";
import { PermissionService } from "@/src/modules/user/services/permission-service";
import { PermissionClient } from "@/src/app/components/users/permission-client";
import { authOptions } from "@/src/app/lib/auth-options";

export default async function PermissionsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div>Please log in to view users</div>;
  }

  const permissionService = new PermissionService();

  try {
    const initialData = await permissionService.listPaginated(1, 10);

    return <PermissionClient initialData={initialData} />;
  } catch (error) {
    return (
      <PermissionClient
        initialData={{ data: [], total: 0, page: 1, totalPages: 1 }}
      />
    );
  }
}

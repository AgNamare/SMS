// src/app/schools/page.tsx
import { getServerSession } from "next-auth";
import { UserService } from "@/src/modules/user/services/user-service";
import { authOptions } from "../lib/auth-options";

export const dynamic = "force-dynamic";

export default async function SchoolsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return <div>Please log in</div>;
  }

  const userService = new UserService();
  const user = await userService.getUserWithPermissions(session.user.id);

  const canCreateSchool =
    user?.roles.some((r:any) => r.permissions.includes("School:create")) ||
    user?.roles.some((role:any) => role.name == "SUPER_ADMIN");

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-6'>🏫 Schools</h1>
      {canCreateSchool && (
        <button className='mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
          + Create School
        </button>
      )}
    </div>
  );
}

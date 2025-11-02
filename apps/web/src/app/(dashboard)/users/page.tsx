import { UserRoute } from "@/src/modules/user/routes/user-route";
import { getServerSession } from "next-auth";
import { UsersClient } from "../../components/users/user-client";
import { authOptions } from "../../lib/auth-options";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  const userRoute = new UserRoute();

  try {
    const users = await userRoute.serverGetPaginatedUsers(1, 10);
    return <UsersClient initialData={users} />;
  } catch (error: any) {
    return (
      <div className='text-center text-red-500 p-10'>Failed to load users.</div>
    );
  }
}

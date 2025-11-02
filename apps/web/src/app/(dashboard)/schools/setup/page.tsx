// src/app/school-setup/page.tsx
import { getServerSession } from "next-auth";
import { SchoolService } from "@/src/modules/school/services/school-service";
import { UserService } from "@/src/modules/user/services/user-service";
import { SchoolSetupForm } from "@/src/app/components/school/school-setup-form";
import { saveSchoolDetails } from "@/src/app/actions/school-actions";

export default async function SchoolSetupPage() {
  const schoolService = new SchoolService();
  const userService = new  UserService();

  try {
    const [school, usersData] = await Promise.all([
      schoolService.getSchool(),
      userService.getUsersForSelection(),
    ]);

    return (
      <div className='container mx-auto py-8 px-4'>
        <div className='max-w-4xl mx-auto'>
          <SchoolSetupForm users={usersData} formAction={saveSchoolDetails} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading school details:", error);
    return (
      <div className='container mx-auto py-8'>
        <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4'>
          <p className='text-destructive'>Failed to load school details</p>
        </div>
      </div>
    );
  }
}

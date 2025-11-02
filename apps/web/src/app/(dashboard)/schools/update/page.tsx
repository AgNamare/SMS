import { SchoolSetupForm } from "@/src/app/components/school/school-setup-form";
import {
  updateSchoolDetails,
  saveSchoolDetails,
} from "@/src/app/actions/school-actions";
import { SchoolService } from "@/src/modules/school/services/school-service";
import { UserService } from "@/src/modules/user/services/user-service";

export default async function UpdateSchoolPage() {
  const schoolService = new SchoolService();
  const userService = new UserService();
  const [school, usersData] = await Promise.all([
    schoolService.getSchool(),
    userService.getUsersForSelection(),
  ]);

  // Choose correct server action depending on whether the school exists
  const action = school ? updateSchoolDetails : saveSchoolDetails;

  return (
    <div className='max-w-5xl mx-auto py-10'>
      <SchoolSetupForm
        initialData={school}
        users={usersData}
        formAction={updateSchoolDetails}
      />
    </div>
  );
}

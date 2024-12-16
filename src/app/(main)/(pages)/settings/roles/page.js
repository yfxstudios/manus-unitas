import { getCurrentUser } from "@/app/actions";
import RolesList from "./_components/rolesList";

export const dynamic = "force-dynamic";

const Roles = async () => {
  const orgId = await getCurrentUser()


  return (
    <div className="flex flex-col gap-2 px-4 md:px-36 py-16">
      <div className="flex flex-row flex-wrap gap-4 w-full">
        <RolesList
          orgId={orgId.organizationId._id}
        />

      </div>
    </div>
  );

};

export default Roles;

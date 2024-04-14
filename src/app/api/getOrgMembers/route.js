import { getOrgMembers } from "@/lib/mongo/users";

export async function GET(req) {
  const pathname = req.url.split("/");
  const orgName = pathname[pathname.length - 2];
  const members = await getOrgMembers(orgName).catch((e) => {
    throw new Error(e);
  });
  return new Response({ status: 200, body: members });
}

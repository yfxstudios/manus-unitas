import { NextResponse } from "next/server";
import { getRole } from "@/lib/mongo/organization";

export async function GET(req) {
  // request url is /api/roles?type=roleType&organization=organization
  // URLSearchParams is a built-in class to handle query strings
  const params = new URLSearchParams(req.url.split('?')[1]);

  const roleType = params.get('type');
  const organization = params.get('organization');

  if (!roleType || !organization) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const role = await getRole(organization, roleType);


  if (!role) {
    return NextResponse.json({ error: 'Role not found' }, { status: 404 });
  }

  return NextResponse.json(role);
}
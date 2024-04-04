import { getRoles } from "@/lib/mongo/organization";
import { NextResponse } from "next/server";

export async function GET(req) {
  const params = new URLSearchParams(req.url.split('?')[1]);

  const organization = params.get('organization');

  const roles = await getRoles(organization);

  return NextResponse.json(roles);
}
'use server'

import Roles from "@/lib/schemas/roleSchema"

export const deleteRole = async (role) => {
  const roles = await Roles.deleteMany({ $or: [{ _id: role._id }, { parent: role._id }] })
}
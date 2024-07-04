
import React from 'react'
import Roles from '@/lib/schemas/roleSchema'
import NewRoleBtn from './newRoleBtn'
import { getServerSession } from 'next-auth'
import Users from '@/lib/schemas/userSchema'

const page = async () => {
  const session = await getServerSession()
  const user = await Users.findOne({ email: session.user.email })

  const organization = user.organizationId

  const roles = await Roles.find()

  const handleClick = async () => {
    'use server'
    const role = new Roles({
      name: 'New Role',
      subRoles: [{
        name: 'Sub Role 1'
      },
      {
        name: 'Sub Role 2'
      }],
      organizationId: organization
    })

    await role.save()
  }
  return (
    <div
      className="max-w-lg mx-auto"
    >
      <h1 className="text-2xl font-bold">Roles</h1>
      <div
        className="mt-4"
      >
        <h2 className="text-lg font-bold">Roles</h2>
        <div
          className="mt-2"
        >
          <p>Roles are the different positions that volunteers can fill at an event. They can be as specific or general as you need them to be.</p>
        </div>
      </div>
      <NewRoleBtn handleClick={async () => {
        'use server'
        handleClick()
      }} />

      <div
        className="mt-4"
      >
        <h2 className="text-lg font-bold">Current Roles</h2>
        <div
          className="mt-2"
        >
          {roles.map((role, i) => (
            <div
              key={i}
              className="mt-2"
            >
              <p
                className="font-bold"
              >{role.name}</p>
              <ul>
                {role.subRoles.map((subRole, i) => (
                  <li
                    key={i}
                  >
                    {subRole.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default page

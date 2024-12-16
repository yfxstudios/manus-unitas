import { getCurrentUser } from '@/app/actions'
import Users from '@/lib/schemas/userSchema'
import NewVolunteersChart from './_components/newVolunteers'
import TopVolunteers from './_components/topVolunteers'


const Analytics = async () => {
  const user = await getCurrentUser()
  const organizationId = user.organizationId
  console.log(organizationId)
  const users = await Users.find({
    organizationId: organizationId
  }, { first_name: 1, last_name: 1, email: 1, joined: 1, time: 1 }).lean()
  
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-semibold ">Analytics</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <NewVolunteersChart
          users={users}
        />

        <TopVolunteers
          users={users}
        />
      </div>
    </div>
  )
}

export default Analytics

export const dynamic = "force-dynamic"
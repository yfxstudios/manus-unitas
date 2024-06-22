import NewVolunteersChart from './_components/newVolunteers'
import TotalHoursByMonthChart from './_components/HoursByMonthChart'
import Users from '@/lib/schemas/userSchema'


const Analytics = async () => {
  const users = await Users.find({}, { joined: 1 }).lean()
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-semibold ">Analytics</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        <NewVolunteersChart
          users={users}
        />


        <TotalHoursByMonthChart />
      </div>
    </div>
  )
}

export default Analytics

'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'


const TotalHoursByMonthChart = () => {

  const data = [
    { value: 1, date: '2024/06/01' },
    { value: 2, date: '2024/06/02' },
    { value: 3, date: '2024/06/03' },
    { value: 4, date: '2024/06/04' },
    { value: 15, date: '2024/06/05' },
    { value: 5, date: '2024/06/06' },
    { value: 0, date: '2024/06/07' },
    { value: 1, date: '2024/06/08' },
    { value: 7, date: '2024/06/09' },
    { value: 6, date: '2024/06/10' },
    { value: 7, date: '2024/06/11' },
    { value: 2, date: '2024/06/12' },
    { value: 7, date: '2024/06/13' },
    { value: 8, date: '2024/06/14' },
    { value: 1, date: '2024/06/15' },
    { value: 4, date: '2024/06/16' },
    { value: 8, date: '2024/06/17' },
    { value: 3, date: '2024/06/18' },
    { value: 12, date: '2024/06/19' },
    { value: 6, date: '2024/06/20' },
    { value: 15, date: '2024/06/21' },
    { value: 5, date: '2024/06/22' },
    { value: 0, date: '2024/06/23' },
    { value: 1, date: '2024/06/24' },
    { value: 8, date: '2024/06/25' },
    { value: 2, date: '2024/06/26' },
    { value: 3, date: '2024/06/27' },
    { value: 8, date: '2024/06/28' },
    { value: 15, date: '2024/06/29' },
    { value: 12, date: '2024/06/30' },
  ]



  // 0:
  // date: "June"
  // value: 49

  return (
    <>
      <ResponsiveContainer width="100%" minHeight={300}>

        <BarChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>

      </ResponsiveContainer>
    </>

  )
}

export default TotalHoursByMonthChart

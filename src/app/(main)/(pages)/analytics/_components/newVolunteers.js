"use client";

import { format } from "date-fns";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const VolunteersChart = ({ users }) => {
  const [length, setLength] = useState("7");
  const [startDate, setStartDate] = useState(new Date().getDate() - 7);
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    if (length === "YTD") {
      setStartDate(new Date(new Date().getFullYear(), 0, 1))
      setEndDate(new Date())
    } else {
      setStartDate(new Date(new Date().setDate(new Date().getDate() - length)))
      setEndDate(new Date())
    }
  }, [length]);

  users = users.filter((user) => user.joined >= startDate && user.joined <= endDate);








  const data = users.reduce((acc, user) => {
    // add blank entry for each day between start and end date

    const date = new Date(user.joined).toLocaleDateString();
    const existing = acc.find((item) => item.date === date);

    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ date, value: 1 });
    }

    if (length === "YTD") {
      const year = new Date().getFullYear();
      const ytd = new Date(year, 0, 1)
      for (let i = 0; i < Math.floor((new Date() - ytd) / (1000 * 60 * 60 * 24)); i++) {
        const date = new Date(new Date().setDate(new Date().getDate() - i)).toLocaleDateString();
        const existing = acc.find((item) => item.date === date);

        if (!existing) {
          acc.push({ date, value: 0 });
        }
      }
    } else {
      for (let i = 0; i < length; i++) {
        const date = new Date(new Date().setDate(new Date().getDate() - i)).toLocaleDateString();
        const existing = acc.find((item) => item.date === date);

        if (!existing) {
          acc.push({ date, value: 0 });
        }
      }
    }


    return acc;
  }, []);

  console.log(`${length === "YTD" ? startDate : ""}`)

  data
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  let xAxisInterval = Math.round(data.length / 10)

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>New Volunteers</CardTitle>

        <Select onValueChange={setLength} value={length}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Last 7 days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="180">Last 180 days</SelectItem>
            <SelectItem value="365">Last 365 days</SelectItem>
            <SelectItem value="YTD">YTD</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" minHeight={300}>
          <LineChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={date => format(date, "MMM dd")}

              // {...length !== "7" && length !== "30" ? { interval: xAxisInterval } : {}}
              minTickGap={15}
            />
            <YAxis
              allowDecimals={false}
            />
            <Tooltip
              labelFormatter={date => format(date, "MMMM dd")}
              formatter={value => [
                value + ` new volunteer${value !== 1 ? "s" : ""}`,
              ]}
            />
            <Line dataKey="value" name="New Volunteers" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VolunteersChart;

"use client";

import { Label } from "@/components/ui/label";
import * as React from "react";
import { TimePeriodSelect } from "./period-select";
import { TimePickerInput } from "./time-picker-input";

export function TimePicker12({ date, setDate, noLabel }) {
	const [period, setPeriod] = React.useState(
		date.getHours() >= 12 ? "PM" : "AM"
	);

	const minuteRef = React.useRef(null);
	const hourRef = React.useRef(null);
	const secondRef = React.useRef(null);
	const periodRef = React.useRef(null);

	return (
		<div className="flex items-end gap-2">
			<div className="grid gap-1 text-center">
				{!noLabel && (
					<Label htmlFor="hours" className="text-xs">
						Hours
					</Label>
				)}
				<TimePickerInput
					picker="12hours"
					period={period}
					date={date}
					setDate={setDate}
					ref={hourRef}
					onRightFocus={() => minuteRef.current?.focus()}
					
				/>
			</div>
			<div className="grid gap-1 text-center">
				{!noLabel && (
					<Label htmlFor="minutes" className="text-xs">
						Minutes
					</Label>
				)}
				<TimePickerInput
					picker="minutes"
					id="minutes12"
					date={date}
					setDate={setDate}
					ref={minuteRef}
					onLeftFocus={() => hourRef.current?.focus()}
					onRightFocus={() => secondRef.current?.focus()}
				/>
			</div>
			<div className="grid gap-1 text-center">
				<TimePeriodSelect
					period={period}
					setPeriod={setPeriod}
					date={date}
					setDate={setDate}
					ref={periodRef}
					onLeftFocus={() => secondRef.current?.focus()}
				/>
			</div>
		</div>
	);
}

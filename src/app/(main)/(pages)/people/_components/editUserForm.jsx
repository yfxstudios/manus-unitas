"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Loader2, RotateCcw } from "lucide-react";
import { formatPhoneNumber } from "@/lib/util/phoneNumber";
import { Switch } from "@/components/ui/switch";

const schema = z.object({
	first_name: z.string().min(1, "First Name is required"),
	last_name: z.string().min(1, "Last Name is required"),
	email: z.string().email("Invalid email"),
	phone: z.string().min(14, "Phone is required"),
	admin: z.boolean().default(false),
});

const EditUserForm = props => {
	const [isLoading, setIsLoading] = useState(false);
	const [phone, setPhone] = useState(props.user.phone);

	const handleChange = e => {
		const formatted = formatPhoneNumber(e.currentTarget.value);
		setPhone(formatted);

		return formatted;
	};

	const form = useForm({
		mode: "onChange",
		resolver: zodResolver(schema),
		defaultValues: {
			first_name: props.user.first_name,
			last_name: props.user.last_name,
			email: props.user.email,
			phone: props.user.phone,
			admin: props.user.admin,
		},
	});

	const handleSubmit = async data => {
		setIsLoading(true);
		await props.handleSubmit(data, props.user._id);
		setIsLoading(false);
		form.reset();
	};

	return (
		<Form {...form}>
			<form
				className="flex flex-col gap-6 p-2"
				onSubmit={form.handleSubmit(handleSubmit)}
			>
				<FormField
					disabled={isLoading}
					control={form.control}
					name="first_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg">First Name</FormLabel>
							<FormControl>
								<div className="flex flex-row gap-4 items-center">
									<Input {...field} placeholder="John" />
									<RotateCcw
										onClick={e =>
											field.onChange(props.user.first_name) && e.target.focus()
										}
										className="cursor-pointer"
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					disabled={isLoading}
					control={form.control}
					name="last_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg">Last Name</FormLabel>
							<FormControl>
								<div className="flex flex-row gap-4 items-center">
									<Input {...field} placeholder="Doe" />
									<RotateCcw
										onClick={e =>
											field.onChange(props.user.last_name) && e.target.focus()
										}
										className="cursor-pointer"
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					disabled={isLoading}
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg">Email</FormLabel>
							<FormControl>
								<div className="flex flex-row gap-4 items-center">
									<Input {...field} placeholder="Doe" />
									<RotateCcw
										onClick={e =>
											field.onChange(props.user.email) && e.target.focus()
										}
										className="cursor-pointer"
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					disabled={isLoading}
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg">Phone</FormLabel>
							<FormControl>
								<div className="flex flex-row gap-4 items-center">
									<Input
										{...field}
										placeholder="(555) 555-5555"
										value={phone}
										onChange={e => {
											const formatted = handleChange(e);
											field.onChange(formatted);
										}}
									/>
									<RotateCcw
										onClick={e => {
											field.onChange(props.user.phone);
											e.target.focus();
										}}
										className="cursor-pointer"
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					disabled={isLoading}
					control={form.control}
					name="admin"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="flex flex-row gap-4 items-center">
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
									<FormLabel className="text-lg">Admin</FormLabel>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					disabled={isLoading || !form.formState.isValid}
					className="w-full"
				>
					{isLoading ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						"Submit"
					)}
				</Button>
			</form>
		</Form>
	);
};

export default EditUserForm;

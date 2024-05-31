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

import { Loader2 } from "lucide-react";
import { formatPhoneNumber } from "@/lib/util/phoneNumber";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

const schema = z.object({
	first_name: z.string().min(1, "First Name is required"),
	last_name: z.string().min(1, "Last Name is required"),
	username: z.string().min(1, "Username is required"),
	email: z.string().email("Invalid email"),
	// password: z.string().min(6, "Password must be at least 6 characters"),
	admin: z.boolean().default(false),
	phone: z.string().min(14, "Phone is required"),
});

const NewUserForm = props => {
	const [isLoading, setIsLoading] = useState(false);
	const [phone, setPhone] = useState("");

	const handleChange = e => {
		const formatted = formatPhoneNumber(e.currentTarget.value);
		setPhone(formatted);

		return formatted;
	};

	const form = useForm({
		mode: "onChange",
		resolver: zodResolver(schema),
	});

	console.log(form);

	const handleSubmit = async data => {
		setIsLoading(true);
		await props.handleSubmit(data).then(res => {
			if (res) {
				alert(res);
				const { first_name, last_name, username, email, admin, phone } = data;
				form.reset({
					first_name: first_name,
					last_name: last_name,
					username: username,
					email: email,
					admin: admin,
					phone: phone,
				});
			} else {
				form.reset();
			}
			setIsLoading(false);
		});
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
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					disabled={isLoading}
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg">Username</FormLabel>
							<FormControl>
								<div className="flex flex-row gap-4 items-center">
									<Input {...field} placeholder="johndoe" />
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
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* <FormField
					disabled={isLoading}
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg">Password</FormLabel>
							<FormControl>
								<div className="flex flex-row gap-4 items-center">
									<Input {...field} placeholder="Password" />
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/> */}

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
						"Add User"
					)}
				</Button>

				<p>User will receive an email with a link to set their password</p>
			</form>
		</Form>
	);
};

export default NewUserForm;

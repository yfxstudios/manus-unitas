"use client";

import React, { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
	displayName: z.string().min(3, "Must be at least 3 characters").max(50),
	description: z
		.string()
		.min(10, "Must be at least 10 characters")
		.max(500, "Must be less than 500 characters"),
	website: z
		.string()
		.min(1, "Website is required")
		.includes(".", { message: "Must be a valid website" })
		.max(50, "Must be less than 50 characters"),
	address: z.string().min(10, "Must be at least 10 characters"),
	phone: z.string().min(10, "Must be a valid phone number"),
	email: z.string().email("Must be a valid email"),
});

const EditOrganizationForm = props => {
	const [isLoading, setIsLoading] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [phone, setPhone] = useState(props.organization.phone);

	const handleChange = e => {
		const formatted = formatPhoneNumber(e.currentTarget.value);
		setPhone(formatted);

		return formatted;
	};

	const form = useForm({
		mode: "onChange",
		resolver: zodResolver(schema),
		defaultValues: {
			displayName: props.organization.displayName,
			description: props.organization.description,
			website: props.organization.website,
			address: props.organization.address,
			phone: props.organization.phone,
			email: props.organization.email,
		},
	});

	const data = form.getValues();

	useEffect(() => {
		if (
			data.displayName === props.organization.displayName &&
			data.description === props.organization.description &&
			data.website === props.organization.website &&
			data.address === props.organization.address &&
			data.phone === props.organization.phone &&
			data.email === props.organization.email
		) {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [data, props.organization]);

	const handleSubmit = async data => {
		setIsLoading(true);
		await props.handleSubmit(data, props.organization._id);
		setIsLoading(false);
		// form.reset();
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
					name="displayName"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg">Name</FormLabel>
							<FormControl>
								<div className="flex flex-row gap-4 items-center">
									<Input
										{...field}
										placeholder={props.organization.displayName}
									/>
									<RotateCcw
										onClick={e =>
											field.onChange(props.organization.displayName) &&
											e.target.focus()
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
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg">Description</FormLabel>
							<FormControl>
								<div className="flex flex-row gap-4 items-center">
									<Textarea
										{...field}
										className="resize-none "
										placeholder={props.organization.description}
									/>
									<RotateCcw
										onClick={e =>
											field.onChange(props.organization.description) &&
											e.target.focus()
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
					name="website"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg">Website</FormLabel>
							<FormControl>
								<div className="flex flex-row gap-4 items-center">
									<Input {...field} placeholder={props.organization.website} />
									<RotateCcw
										onClick={e =>
											field.onChange(props.organization.website) &&
											e.target.focus()
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
					name="address"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg">Address</FormLabel>
							<FormControl>
								<div className="flex flex-row gap-4 items-center">
									<Input {...field} placeholder={props.organization.address} />
									<RotateCcw
										onClick={e =>
											field.onChange(props.organization.address) &&
											e.target.focus()
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
							<FormLabel className="text-lg">Organization Phone</FormLabel>
							<FormControl>
								<div className="flex flex-row gap-4 items-center">
									<Input
										{...field}
										placeholder={props.organization.phone}
										value={phone}
										onChange={e => {
											const formatted = handleChange(e);
											field.onChange(formatted);
										}}
									/>
									<RotateCcw
										onClick={e => {
											setPhone(props.organization.phone);
											field.onChange(props.organization.phone);
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
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg">Organization Email</FormLabel>
							<FormControl>
								<div className="flex flex-row gap-4 items-center">
									<Input {...field} placeholder={props.organization.email} />
									<RotateCcw
										onClick={e =>
											field.onChange(props.organization.email) &&
											e.target.focus()
										}
										className="cursor-pointer"
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					disabled={isLoading || !form.formState.isValid || disabled}
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

export default EditOrganizationForm;

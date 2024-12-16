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
import { cn } from "@/lib/utils";

const schema = z
	.object({
		current_password: z.string().min(1, "Current Password is required"),
		// new_password and confirm_password must match
		new_password: z.string().min(1, "New Password is required"),
		confirm_password: z.string().min(1, "Confirm Password is required"),
	})
	.superRefine(({ confirm_password, new_password }, ctx) => {
		if (confirm_password !== new_password) {
			ctx.addIssue({
				code: "custom",
			});
		}
	})
	.superRefine(({ current_password, new_password }, ctx) => {
		if (current_password === new_password) {
			ctx.addIssue({
				code: "custom",
				message: "New password must be different from current password",
				path: ["new_password"],
			});
		}
	});

const UpdatePasswordForm = props => {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm({
		mode: "onChange",
		resolver: zodResolver(schema),
		defaultValues: {
			current_password: "",
			new_password: "",
			confirm_password: "",
		},
	});

	const handleSubmit = async data => {
		setIsLoading(true);
		await props.handleSubmit(data);
		setIsLoading(false);
		form.reset();
	};

	return (
		<Form {...form}>
			<form
				className={cn("flex flex-col gap-4", props.className)}
				onSubmit={form.handleSubmit(handleSubmit)}
			>
				<FormField
					disabled={isLoading}
					control={form.control}
					name="current_password"
					render={({ field }) => (
						<FormItem className="mb-8">
							<FormLabel className="text-lg">Current Password</FormLabel>
							<FormControl>
								<Input {...field} type="password" placeholder="" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					disabled={isLoading}
					control={form.control}
					name="new_password"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg">New Password</FormLabel>
							<FormControl>
								<Input {...field} type="password" placeholder="" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					disabled={isLoading}
					control={form.control}
					validate={val => {}}
					name="confirm_password"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-lg">Confirm Password</FormLabel>
							<FormControl>
								<Input {...field} type="password" placeholder="" />
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
						"Update"
					)}
				</Button>
			</form>
		</Form>
	);
};

export default UpdatePasswordForm;

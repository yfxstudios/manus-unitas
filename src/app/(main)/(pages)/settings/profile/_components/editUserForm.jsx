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

const schema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(14, "Phone is required"),
});

const EditUserForm = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState(props.user.phone);

  const handleChange = (e) => {
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
    },
  });

  const handleSubmit = async (data) => {
    setIsLoading(true);
    await props.handleSubmit(
      {
        first_name: data.first_name,
        last_name: data.last_name,
      },
      props.user._id
    );
    setIsLoading(false);
    // form.reset();
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
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">First Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="John" />
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
                <Input {...field} placeholder="Doe" />
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
                <Input {...field} placeholder="Doe" disabled />
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
                <Input
                  {...field}
                  placeholder="(555) 555-5555"
                  value={phone}
                  onChange={(e) => {
                    const formatted = handleChange(e);
                    field.onChange(formatted);
                  }}
                  disabled
                />
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

export default EditUserForm;

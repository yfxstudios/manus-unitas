"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { date, z } from "zod";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { add, addDays, format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePicker12 } from "@/components/ui/time-picker-12h";
import { useMediaQuery } from "@uidotdev/usehooks";

const schema = z.object({
  title: z
    .string()
    .min(3, "Title is required")
    .max(50, "Must be less than 50 characters"),
  description: z
    .string()
    .min(10, "Must be at least 10 characters")
    .max(500, "Must be less than 500 characters"),
  date: z.object({
    start: z.date().min(new Date(), "Start Date must be in the future"),
    end: z.date().min(new Date(), "End Date must be in the future"),
  })
});

const NewEventForm = props => {
  const [isLoading, setIsLoading] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      date: {
        start: new Date(),
        end: add(new Date(), { hours: 1 }),
      },
      endTime: new Date(),
      // volunteers: [],
      // accepted: [],
      // rejected: []
    },
  });

  const handleSubmit = async data => {
    setIsLoading(true);
    await props.onSubmit(data);
    setIsLoading(false);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6 p-2", props.className)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          disabled={isLoading}
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Title</FormLabel>
              <FormControl>
                <Input placeholder="Event Title" {...field} />
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
                <Input placeholder="Event Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-lg">Date</FormLabel>
              <FormControl>
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "min-w-[280px] justify-start text-left font-normal",
                        !field.value.start && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                      {field.value.start && field.value.end
                        ? `${format(field.value.start, `PPP h:mm a`)} - ${format(
                          field.value.end,
                          "h:mm a"
                        )}`
                        : "Select Date & Time"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto">
                    <Calendar
                      mode="single"
                      selected={field.value.start}
                      onSelect={newDay => {
                        if (!newDay) return;
                        if (!field.value.start) {
                          setStartTime(newDay);
                          return;
                        }
                        const diff =
                          newDay.getTime() - field.value.start.getTime();
                        const diffInDays = diff / (1000 * 60 * 60 * 24);
                        const newDateFull = add(field.value.start, {
                          days: Math.ceil(diffInDays),
                        });
                        field.onChange({
                          start: newDateFull,
                          end: field.value.end,
                        });
                      }}
                      disabled={d => d < new Date().setHours(0, 0, 0, 0)}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border w-fit flex flex-row gap-3">
                      <div
                        className={cn(
                          "flex flex-col text-left justify-around w-full text-sm text-muted-foreground"
                        )}
                      >
                        <p>
                          Start
                        </p>
                        <p>
                          End
                        </p>
                      </div>
                      <div>
                        <Input type="time"
                          value={format(field.value.start, "HH:mm")}
                          onChange={e => {
                            let [hours, minutes] = e.target.value.split(":");

                            field.onChange({
                              start: new Date(
                                field.value.start.setHours(hours, minutes)
                              ),
                              end: field.value.end,
                            });
                          }}
                        />

                        <Input type="time"
                          value={format(field.value.end, "HH:mm")}
                          onChange={e => {
                            let [hours, minutes] = e.target.value.split(":");
                            field.onChange({
                              start: field.value.start,
                              end: new Date(
                                field.value.end.setHours(hours, minutes)
                              ),
                            });
                          }}
                        />

                      </div>
                      {/* 
                      <TimePicker12
                        setDate={newTime => {
                          field.onChange({
                            start: new Date(
                              field.value.start.setHours(
                                newTime.getHours(),
                                newTime.getMinutes()
                              )
                            ),
                            end: field.value.end,
                          });
                        }}
                        date={field.value.start}
                      /> */}
                      {/* <TimePicker12
                        setDate={newTime => {
                          field.onChange({
                            start: field.value.start,
                            end: new Date(
                              field.value.end.setHours(
                                newTime.getHours(),
                                newTime.getMinutes()
                              )
                            ),
                          });
                        }}
                        date={field.value.end}
                        noLabel
                      /> */}
                    </div>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || !form.formState.isValid}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create Event"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default NewEventForm;

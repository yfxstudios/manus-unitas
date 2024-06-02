'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { date, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

const schema = z.object({
  title: z.string().min(3, 'Title is required').max(50, 'Must be less than 50 characters'),
  description: z.string().min(10, 'Must be at least 10 characters').max(500, 'Must be less than 500 characters'),
  date: z.date().min(new Date(), 'Date is required'),
  startTime: z.string().min(1, 'Start Time is required'),
  endTime: z.string().min(1, 'End Time is required'),
})

const NewEventForm = (props) => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      // volunteers: [],
      // accepted: [],
      // rejected: []
    }
  })

  const handleSubmit = async (data) => {
    setIsLoading(true)
    await props.onSubmit(data)
    setIsLoading(false)
    form.reset()
  }

  return (
    <Form {...form}>
      <form className='flex flex-col gap-6 p-2' onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          disabled={isLoading}
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder='Event Title'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Description</FormLabel>
              <FormControl>
                <Input
                  placeholder='Event Description'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name='date'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel className="text-lg">Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2" />
                      {field.value ? format(new Date(field.value), 'MMM dd, yyyy') : 'Select a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name='startTime'
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Start Time</FormLabel>
              <FormControl>
                <Input
                  type='time'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name='endTime'
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">End Time</FormLabel>
              <FormControl>
                <Input
                  type='time'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            'Create Event'
          )}
        </Button>

      </form>
    </Form>
  )
}

export default NewEventForm

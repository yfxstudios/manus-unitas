'use client'

import { formatPhoneNumber } from '@/lib/util/phoneNumber'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const schema = z.object({
  organizationName: z.string().min(1, 'Organization Name is required'),
  organizationType: z.string().min(1, 'Organization Type is required'),
  organizationDescription: z.string().min(1, 'Organization Description is required'),
  organizationWebsite: z.string().min(1, 'Organization Website is required'),
  organizationAddress: z.string().min(1, 'Organization Address is required'),
  organizationPhone: z.string().min(1, 'Organization Phone is required'),
  organizationEmail: z.string().min(1, 'Organization Email is required')
})


export default function OrganizationForm(props) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      organizationName: '',
      organizationType: '',
      organizationDescription: '',
      organizationWebsite: '',
      organizationAddress: '',
      organizationPhone: '',
      organizationEmail: ''
    }
  })

  const handleSubmit = async (data) => {
    setIsLoading(true)
    const response = await props.handleSubmit(data)
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-16">
      <h1 className='text-4xl font-bold mb-8'>Add Your Organization</h1>


      <Form {...form}>
        <form className="flex flex-col items-center justify-center p-2 w-full max-w-sm" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name='organizationName'
            render={({ field }) => (
              <FormItem className="w-full m-3">
                <FormLabel className="text-lg">Organization Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Organization Name'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='organizationType'
            render={({ field }) => (
              <FormItem className="w-full m-3">
                <FormLabel className="text-lg">Organization Type</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Church, 501(c)(3), school, etc.'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='organizationDescription'
            render={({ field }) => (
              <FormItem className="w-full m-3">
                <FormLabel className="text-lg">Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Description'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='organizationWebsite'
            render={({ field }) => (
              <FormItem className="w-full m-3">
                <FormLabel className="text-lg">Website</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Website'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='organizationAddress'
            render={({ field }) => (
              <FormItem className="w-full m-3">
                <FormLabel className="text-lg">Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Address'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='organizationPhone'
            render={({ field }) => (
              <FormItem className="w-full m-3">
                <FormLabel className="text-lg">Organization Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Organization Phone'
                    {...field}
                    onChange={e => field.onChange(formatPhoneNumber(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='organizationEmail'
            render={({ field }) => (
              <FormItem className="w-full m-3">
                <FormLabel className="text-lg">Organization Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Organization Email'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type='submit'
            disabled={isLoading || !form.formState.isValid}
            className='w-full'
          >
            {isLoading ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </Form>

    </div>
  )
}
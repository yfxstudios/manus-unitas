'use client'

import React from 'react'

import { useState } from 'react'

import { formatPhoneNumber } from '@/lib/util/phoneNumber'


import { signIn } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'


const schema = z.object({
  first_name: z.string().min(1, 'First Name is required'),
  last_name: z.string().min(1, 'Last Name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  phone: z.string().min(1, 'Phone Number is required'),
  password: z.string().min(1, 'Password is required'),
  confirm_password: z.string().min(1, 'Confirm Password is required'),
  terms: z.boolean().refine(value => value === true, { message: 'Please agree to the terms and conditions' })
})


export default function VolunteerSignUp(props) {
  const [passwordVisible, setPasswordVisible] = useState(false) // TODO: Wire up password visibility


  const [isLoading, setIsLoading] = useState(false)


  const handleSubmit = async (data) => {
    const response = await props.handleSubmit({
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      email: data.email,
      phone: data.phone,
      password: data.password,
      confirm_password: data.confirm_password
    })

    if (response === 'User already exists') {
      alert('User already exists')
    } else if (response === 'Username already exists') {
      alert('Username already exists')
    } else if (response === 'Organization already exists') {
      alert('Organization already exists')
    } else if (response === 'success') {
      signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: '/organization-details'
      })
    }
  }

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
      terms: false
    }
  })


  return (
    <div className="flex flex-col items-center justify-center h-screen" >
      <h1 className="text-4xl font-bold">Administrator Sign Up</h1>
      <Button variant="link" className="mb-4" asChild>
        <a href="/signup">Sign up as a volunteer</a>
      </Button>

      <Form {...form}>
        <form className="flex flex-col items-center justify-center" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name='first_name'
            render={({ field }) => (
              <FormItem className="w-full m-3">
                <FormLabel className="text-lg">First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='First Name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name='last_name'
            render={({ field }) => (
              <FormItem className="w-full m-3">
                <FormLabel className="text-lg">Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Last Name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem className="w-full m-3">
                <FormLabel className="text-lg">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Username'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className="w-full m-3">
                <FormLabel className="text-lg">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Email'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem className="w-full m-3">
                <FormLabel className="text-lg">Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Phone Number'
                    {...field}
                    onChange={e => field.onChange(formatPhoneNumber(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className="w-full m-3">
                <FormLabel className="text-lg">Password</FormLabel>
                <FormControl>
                  <Input
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder='Password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name='confirm_password'
            render={({ field }) => (
              <FormItem className="w-full m-3">
                <FormLabel className="text-lg">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder='Confirm Password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 mb-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Accept terms and conditions
                  </FormLabel>
                  <FormDescription>
                    You agree to our
                    <Link href="/terms-and-conditions"> Terms of Service </Link>and<Link href="/privacy-policy"> Privacy Policy </Link>page.
                  </FormDescription>
                </div>
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
              'Sign Up'
            )}
          </Button>

        </form>
      </Form>
    </div >
  )
}


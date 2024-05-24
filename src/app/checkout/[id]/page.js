'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { getPrice } from '@/app/actions'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'

// import {}

const checkout = () => {
  const pathname = usePathname()
  const id = pathname.split('/')[2]
  console.log(id)

  const { data, error, isFetched } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getPrice(id)
  })

  if (error) return <div>Error: {error.message}</div>




  return (
    <div className='bg-gray-100 min-h-screen flex flex-row items-center justify-center'>
      <div className='h-screen w-1/2 flex flex-col bg-primary text-primary-foreground p-16 rounded-r-xl shadow-lg justify-center gap-4'>
        <Link href="/subscribe" passHref>
          <div className='flex flex-row items-center gap-3 mb-4 cursor-pointer transition-opacity hover:opacity-75'>
            <ArrowLeft />
            <div className='rounded-full bg-primary-foreground p-1'>
              <Image className='h-4 w-4' width={128} height={128} src='/logo.svg' alt='logo' />
            </div>
            <p>Manus Unitas</p>
          </div>
        </Link>
        {!isFetched ? (
          <>
            <Skeleton className='h-6 w-2/3 rounded-lg mb-3' />
            <Skeleton className='h-24 w-full rounded-xl' />
            <Skeleton className='h-4 w-full rounded-lg' />

          </>
        ) : (
          <div>
            <div className='flex flex-row items-center gap-3 mb-5'>
              <h1 className='text-5xl font-light'>${
                (data.unit_amount / 100).toFixed(2)
              }</h1>
              <p className='text-sm'>/ {data.recurring.interval}</p>
            </div>
            <div className='flex flex-col p-4 gap-2 rounded-xl bg-black/20'>
              <h1 className='text-2xl font-semibold'>{data.name}</h1>
              <p className='mb-1'>{data.description}</p>
            </div>
            <div className='flex flex-row justify-between py-6 px-4'>
              <p className='text-sm'>Total due</p>
              <p className='text-sm font-bold'>${
                (data.unit_amount / 100).toFixed(2)
              }</p>
            </div>

          </div>
        )}
      </div>

      <div className='w-1/2 dark:bg-primary/50 p-16'>
        <h1 className='text-3xl font-normal mb-4'>{ }</h1>
        <p className='text-gray-500 mb-4'>You are purchasing an item with id: {id}</p>
        <Button className=''>Purchase</Button>
      </div>
    </div>
  )
}

export default checkout

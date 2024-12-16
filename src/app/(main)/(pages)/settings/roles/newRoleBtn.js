'use client'
import { Button } from '@/components/ui/button'
import React from 'react'

const NewRoleBtn = ({ handleClick }) => {
  return (
    <Button
      onClick={() => handleClick()}
    >
      Create Role
    </Button>
  )
}

export default NewRoleBtn

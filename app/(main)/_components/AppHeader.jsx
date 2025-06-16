"use client"
import { useAuthContext } from '@/app/provider';
import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

function AppHeader() {
    const {user} = useAuthContext();
  return (
    <div className='p-3 flex justify-between items-center'>
        <SidebarTrigger/>
        <div className='w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center'>
            <span className='text-sm font-medium'>DU</span>
        </div>
    </div>
  )
}

export default AppHeader
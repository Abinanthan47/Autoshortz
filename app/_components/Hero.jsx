import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function Hero() {
  return (
    <div className='flex flex-col items-center justify-center gap-6 py-20'>
        <h2 className='text-5xl text-center font-medium'>AI Video Generator</h2>
        <p className='text-xl text-gray-600 text-center max-w-2xl'>
          Create engaging short videos with AI-powered script generation, voice synthesis, and automatic video creation.
        </p>
        <div>
            <Link href="/dashboard">
                <Button size="lg">Get Started</Button>
            </Link>
        </div>
    </div>
  )
}

export default Hero
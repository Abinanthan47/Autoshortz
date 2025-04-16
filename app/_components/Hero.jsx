import React from 'react'
import Authentication from './Authentication'
import { Button } from '@/components/ui/button'

function Hero() {
  return (
    <div className='flex items-center justify-center gap-3'>
        <h2 className='text-5xl text-center font-medium'>Ai Video generator</h2>

        <div>
            <Authentication>
                <Button>Get Login</Button>
            </Authentication>
        </div>
    </div>

    
  )
}

export default Hero
"use client"
import { Button } from '../../components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthContext } from '../provider'

function Header() {
  const { user } = useAuthContext();
  return (
    <div className='p-4 flex items-center justify-between'>
      <div className='flex items-center gap-3'>
        <Image src={'/globe.svg'}
          alt='logo'
          width={30}
          height={30} />
        <h2 className='text-2xl font-medium'>VideoGen</h2>
      </div>
      <div>
        <div className='flex items-center gap-3'>
          <Link href={'/dashboard'}>
            <Button>Dashboard</Button>
          </Link>
          <div className='w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center'>
            <span className='text-sm font-medium'>DU</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
"use client"
import { Button } from '../../components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthContext } from '../provider'
import Authentication from './Authentication'

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
        {
          !user ?
            <Authentication>
              <Button>Get Started</Button>
            </Authentication>
            : <div className='flex items-center gap-3'>
              <Link href={'/dashboard'}>
                <Button>Dashboard</Button>
              </Link>
              {
                user?.pictureURL &&  
                  <Image src={user?.pictureURL} alt='userImage' width={40} height={40} className='rounded-full' /> 
              }

            </div>
        }
      </div>
    </div>
  )
}

export default Header
"use client"
import { useAuthContext } from '@/app/provider'
import { Button } from '@/components/ui/button'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Gem, HomeIcon, LucideFileVideo, Search, Wallet2, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MenuItems =[
    {
        title:'Home',
        url:'/dashboard',
        icon:HomeIcon
    },
    {
        title:'Create New Video',
        url:'/create-new-video',
        icon:LucideFileVideo
    },
    {
        title:'Explore',
        url:'/explore',
        icon:Search
    },
    {
        title:'Billing',
        url:'/billing',
        icon:Wallet2
    },
   
]


function AppSidebar() {
    const path = usePathname();
    const {user} = useAuthContext();
    return (
        <Sidebar>
            <SidebarHeader >
                <div>
                    <div className='flex items-center gap-3 w-full justify-center mt-5'>
                        <Image src={'/globe.svg'} alt='logo' width={40} height={40} />
                        <h2 className='font-medium text-2xl'>Video Gen</h2>
                    </div>
                    <h2 className='text-lg text-gray-400 text-center mt-3 '>Ai short video Generator</h2>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <div className='mx-5 mt-8'>
                        <Link href={'/create-new-video'}>
                        <Button className='w-full'>+ Create New Video</Button>
                        </Link>
                    </div>
                    <SidebarMenu>
                        {MenuItems.map((menu,index)=>(
                            <SidebarMenuItem className='mt-3 mx-1' key={index}>
                                <SidebarMenuButton isActive={path == menu.url} className='p-5'>
                                    <Link href={menu.url} className='flex items-center gap-4'>
                                    <menu.icon/>
                                    <span>{menu.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

            </SidebarContent>
            <SidebarFooter>
                <div className='p-5 border rounded-lg mb-6 bg-gray-400/50'>
                    <div className='flex items-center justify-between'>
                 <Zap/>
                 <h2>{user?.credits} Credits Left</h2>
                    </div>
                    <Button className='w-full mt-3' >
                        Buy More Credits
                    </Button>
                    </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar
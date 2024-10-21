"use client";

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import Explore from '~/assets/nav/Explore.svg'
import MyBets from '~/assets/nav/MyBets.svg'
import MakeABet from '~/assets/nav/MakeABet.svg'
import Rankings from '~/assets/nav/Rankings.svg'
import Notifications from '~/assets/nav/Notifications.svg'

const Navbar = () => {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const navItems = [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    { href: '/explore', icon: Explore as string, alt: 'Explore', width: 25, height: 25, label: 'Explore' },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    { href: '/my-bets', icon: MyBets as string, alt: 'My bets', width: 44, height: 44, label: 'My Bets' },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    { href: '/create-bet', icon: MakeABet as string, alt: 'Make a bet', width: 60, height: 60, label: 'Create Bet' },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // { href: '/rankings', icon: Rankings as string, alt: 'Rankings', width: 28, height: 28, label: 'Rankings' },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    { href: '/notifications', icon: Notifications as string, alt: 'Notifications', width: 25, height: 25, label: 'Notifications' },
  ]

  return (
    <div className='grid grid-cols-5 bg-[#121212] pb-4 z-50 fixed bottom-0 left-0 right-0'>
      {navItems.map((item) => (
        <Link 
          key={item.href}
          href={item.href} 
          className={`flex flex-col justify-center items-center transition-all duration-300 ease-in-out relative
            ${pathname === item.href ? 'text-[#8c7aff]' : 'text-gray-400'}
            ${hoveredItem === item.href ? 'scale-110' : 'scale-100'}
            ${item.href === '/create-bet' ? '-mt-4' : ''}`}
          onMouseEnter={() => setHoveredItem(item.href)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Image src={item.icon} alt={item.alt} width={item.width} height={item.height} />
          {hoveredItem === item.href && (
            <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded">
              {item.label}
            </div>
          )}
        </Link>
      ))}
    </div>
  )
}

export default Navbar

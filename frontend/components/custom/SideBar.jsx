"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import manageStore from '@/lib/store/store';
import { navItems, InstagramLogo, SettingsIcon } from '@/lib/helpers';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';


const SideBar = () => {

  const { setTheme } = useTheme()

  const { user, conversations } = manageStore();
  const pathname = usePathname();
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);


  useEffect(() => {
    const unreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);
    setTotalUnreadCount(unreadCount);
  }, [conversations]);


  
  return (
    <div>
      {/* left sidebar */}
      <div className='max-md:hidden fixed left-0 top-0 px-4 py-7 h-screen border border-input'>
        <div className='flex flex-col items-center justify-between h-full'>
          <Link href="/" className="rounded-lg p-2 hover:bg-input">
            <InstagramLogo />
          </Link>
          <div className='flex flex-col gap-7 items-center'>
            {navItems.map((item) => (
              <Link className='relative' href={item.href} key={item.href}>
                <div className='rounded-lg p-2 hover:bg-input'>
                  {pathname === item.href ? item.activeIcon : item.inactiveIcon}
                </div>
                {item.href === "#notify" && <div className="w-2 absolute top-[6px] right-[6px] h-2 bg-red-500 rounded-full "></div>}
                {item.href === "/messages" && totalUnreadCount > 0 && (
                  <span className="bg-red-500 absolute top-[-2px] right-0 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalUnreadCount}
                  </span>
                )}
              </Link>
            ))}

            <Link href={`/${user?.username}`}>
              {user?.profile_img ? (
                <Image
                  src={user.profile_img}
                  width={25}
                  height={25}
                  className='rounded-full'
                  alt='profile'
                />
              ) : (
                <div className='rounded-full w-6 h-6 bg-gray-300'></div>
              )}
            </Link>
          </div>
          <div onClick={() => setTheme("dark")} className='cursor-pointer rounded-lg p-2 hover:bg-input'>
            <SettingsIcon />
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className='md:hidden  fixed bottom-0 left-0 border border-input w-full'>
        <div className='flex justify-center items-center gap-16 max-[350px]:gap-6 max-[465px]:gap-9 px-3 py-2'>
          {navItems.map((item) => (
            item.href !== "#notify" && item.href !== "/messages" && (
              <Link className='' href={item.href} key={item.href}>
                <div className='rounded-lg p-2 hover:bg-input'>
                  {pathname === item.href ? item.activeIcon : item.inactiveIcon}
                </div>
              </Link>
            )
          ))}

          <Link href={`/${user?.username}`}>
            {user?.profile_img ? (
              <Image src={user.profile_img} width={25} height={25} className='rounded-full' alt='profile' />
            ) : (
              <div className='rounded-full w-6 h-6 bg-gray-300'></div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
'use client'
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

const Navbar = () => {
    const { data: session } = useSession()
    return (
        <>
            <nav className='my-10 flex flex-col sm:flex-row sm:justify-between sm:items-center sm:px-5 gap-2.5'>
                <div className='flex justify-center items-center gap-4'>
                    <div className="logo flex justify-center items-center">
                        <img src="/logo.svg" alt="style-lab" width={50} />
                        <h1 className='text-3xl font-bold'>Style Lab</h1>
                    </div>
                    <p className='text-lg self-baseline-last'>(Admin page)</p>
                </div>
                {session && <div className=' flex justify-center items-center gap-4'>
                    <div>{session.user.name}</div>
                    <button onClick={()=>signOut()} className='border-2 border-black sm:px-5 sm:py-2 px-3 py-2 sm:text-base text-sm'>Sign Out</button>
                </div>}
            </nav>
        </>
    )
}

export default Navbar

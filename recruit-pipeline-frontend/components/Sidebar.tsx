'use client'

import React, { useState } from 'react'
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"
import { LuLayoutDashboard } from "react-icons/lu"
import { MdLogout, MdWavingHand } from "react-icons/md"
import { FaBriefcase, FaUsers, FaUserTie, FaUserCheck, FaUserGroup } from "react-icons/fa6"
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { logout } from '@/lib/features/auth/authSlice'
import { RootState } from '@/lib/store'

// Define Link Item Interface
interface SidebarItem {
    name: string
    icon: React.ReactNode
    tab: string
}

// Define Role-Based Menus
const roleMenus: Record<string, SidebarItem[]> = {
    Recruiter: [
        { name: "Dashboard", icon: <LuLayoutDashboard />, tab: "dashboard" },
        { name: "Jobs", icon: <FaBriefcase />, tab: "jobs" },
        { name: "Candidates", icon: <FaUsers />, tab: "candidates" },
        { name: "HRs", icon: <FaUserTie />, tab: "hrs" },
    ],
    HR: [
        { name: "Dashboard", icon: <LuLayoutDashboard />, tab: "dashboard" },
        { name: "Jobs", icon: <FaBriefcase />, tab: "jobs" },
        { name: "Assign Candidate", icon: <FaUserCheck />, tab: "assign-candidate" },
        { name: "All Candidates", icon: <FaUserGroup />, tab: "all-candidates" },
    ],
    Candidate: [
        { name: "Dashboard", icon: <LuLayoutDashboard />, tab: "dashboard" },
    ]
}

function Sidebar() {
    const { user } = useSelector((state: RootState) => state.auth)
    const [isOpen, setIsOpen] = useState(false)

    const searchParams = useSearchParams()
    const activeTab = searchParams.get("tab") || "dashboard"

    const dispatch = useDispatch()
    const router = useRouter()

    const handleSignout = () => {
        dispatch(logout())
        router.push('/auth/login')
    }

    // Get menu items based on user role, default to empty if not found
    const menuItems = user?.role ? roleMenus[user.role] || [] : []

    return (
        <>
            {/* Sidebar for Desktop */}
            <div className="hidden md:flex flex-col justify-between w-full h-full bg-gray-800 text-white p-5">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Recruit Pipeline</h1>
                    
                    {user && (
                        <div className='flex items-center gap-1 text-gray-400 text-xs pt-3'>
                            <MdWavingHand />
                            <p>Hello, </p>
                            <p className='text-gray-300 font-semibold'>{user.fullName}</p>
                            <p className='text-xs text-violet-400'>({user.role})</p>
                        </div>
                    )}
                    
                    <ul className="space-y-2 mt-8">
                        {menuItems.map((item) => (
                             <li key={item.tab}>
                                <Link
                                    href={`/?tab=${item.tab}`}
                                    className={
                                        `flex items-center gap-2 px-3 py-2 rounded-md ${activeTab === item.tab ? "bg-gray-700 text-yellow-400 font-bold" : "hover:bg-gray-700"
                                        }`
                                    }
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    

                </div>

                <div className='flex flex-col items-center'>
                    <button onClick={handleSignout} className="w-full bg-transparent border-2 border-violet-700 text-white px-4 py-2 rounded-md flex justify-center items-center gap-2 hover:bg-violet-700 transition-colors">
                        <MdLogout />
                        <span>Log Out</span>
                    </button>
                    <p className='text-xs text-gray-600 pt-10 text-center'>
                        An application by: <span className='text-sm text-gray-500 font-semibold'>Sudip Ghara</span>
                    </p>
                     <p className='text-xs text-gray-400 text-center'>
                        Portfolio:
                        <a href='https://sudipghara19.github.io/Portfolio/'
                            className='text-sm text-blue-500 font-semibold ml-1'
                            target="_blank"
                            rel="noopener noreferrer">
                            Link
                        </a>
                    </p>
                </div>
            </div>

            {/* Mobile Navbar */}
             <div className="md:hidden fixed top-0 left-0 w-full bg-gray-800 text-white p-4 flex justify-between items-center z-50 shadow-md">
                <h1 className="text-xl font-bold">Recruit Pipeline</h1>
                <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl focus:outline-none">
                    {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
                </button>
            </div>

            {/* Mobile Sidebar (Slide-in) */}
            <div className={`md:hidden fixed top-0 left-0 w-3/4 h-screen bg-gray-800 text-white p-5 shadow-lg transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 z-50`}>
                
                {/* User Info */}
                <div className="pt-14">
                    {user && (
                        <div className='flex items-center gap-1 text-gray-400 text-sm pt-3'>
                            <MdWavingHand />
                            <p>Hello, </p>
                            <p className='text-gray-300 font-semibold'>{user.fullName}</p>
                            <p className='text-xs text-violet-400'>({user.role})</p>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <ul className="space-y-2 mt-8">
                     {menuItems.map((item) => (
                             <li key={item.tab}>
                                <Link
                                    href={`/?tab=${item.tab}`}
                                    onClick={() => setIsOpen(false)}
                                    className={
                                        `flex items-center gap-2 px-3 py-2 rounded-md ${activeTab === item.tab ? "bg-gray-700 text-yellow-400 font-bold" : "hover:bg-gray-700"
                                        }`
                                    }
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        ))}
                </ul>

                {/* Log Out Button */}
                <div className="mt-10">
                    <button onClick={handleSignout} className="w-full bg-transparent border-2 border-violet-700 text-white px-4 py-2 rounded-md flex justify-center items-center gap-2 hover:bg-violet-700 transition-colors">
                        <MdLogout />
                        <span>Log Out</span>
                    </button>
                </div>

                {/* Footer */}
                <div className="absolute bottom-10 w-full text-center left-0">
                     <p className='text-xs text-gray-600'>
                        An application by: <span className='text-sm text-gray-500 font-semibold'>Sudip Ghara</span>
                    </p>
                    <p className='text-xs text-gray-400'>
                        Portfolio:
                        <a href='https://sudipghara19.github.io/Portfolio/'
                            className='text-sm text-blue-500 font-semibold ml-1'
                            target="_blank"
                            rel="noopener noreferrer">
                            Link
                        </a>
                    </p>
                </div>
            </div>

            {/* Overlay when Mobile Sidebar is Open */}
            {isOpen && <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40" onClick={() => setIsOpen(false)}></div>}
        </>
    )
}

export default Sidebar

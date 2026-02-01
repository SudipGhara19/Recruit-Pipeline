'use client'

import React, { useState } from 'react'
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"
import { LuLayoutDashboard } from "react-icons/lu"
import { MdLogout, MdWavingHand } from "react-icons/md"
import { FaBriefcase, FaUsers, FaUserTie, FaUserCheck, FaUserGroup, FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa6"
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { logout } from '@/lib/features/auth/authSlice'
import { RootState } from '@/lib/store'
import logoIMG from "@/public/images/logo.png"
import Image from 'next/image'

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
                    <div className="flex justify-start mb-6">
                        <Image src={logoIMG} alt="Logo" width={200} height={100} className="object-contain" />
                    </div>
                    
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

                <div className='flex flex-col items-center border-t border-gray-700/50 pt-6'>
                    <button onClick={handleSignout} className="w-full bg-transparent border-2 border-violet-700 text-white px-4 py-2 rounded-xl flex justify-center items-center gap-2 hover:bg-violet-700 transition-all active:scale-95 mb-6">
                        <MdLogout />
                        <span className="font-bold uppercase tracking-widest text-xs">Log Out</span>
                    </button>
                    
                    <div className="space-y-3">
                        <p className='text-[10px] text-gray-500 uppercase tracking-[0.2em] text-center font-black'>
                            Developed By
                        </p>
                        <h4 className="text-sm font-bold text-gray-300 text-center tracking-tight">Sudip Ghara</h4>
                        
                        <div className="flex items-center justify-center gap-4 pt-2">
                            <a href='https://sudipghara19.github.io/Portfolio/' 
                               target="_blank" rel="noopener noreferrer"
                               className="text-gray-500 hover:text-violet-400 transition-colors"
                               title="Portfolio">
                                <FaGlobe className="text-lg" />
                            </a>
                            <a href='https://www.linkedin.com/in/sudip-ghara-b24865214/' 
                               target="_blank" rel="noopener noreferrer"
                               className="text-gray-500 hover:text-blue-400 transition-colors"
                               title="LinkedIn">
                                <FaLinkedin className="text-lg" />
                            </a>
                            <a href='https://github.com/SudipGhara19' 
                               target="_blank" rel="noopener noreferrer"
                               className="text-gray-500 hover:text-white transition-colors"
                               title="GitHub">
                                <FaGithub className="text-lg" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navbar */}
             <div className="md:hidden fixed top-0 left-0 w-full bg-gray-800 text-white p-3 flex justify-between items-center z-[60] shadow-md">
                <Image src={logoIMG} alt="Logo" width={80} height={48} className="object-contain" />
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
                <div className="absolute bottom-10 w-full px-5 left-0 border-t border-gray-700/50 pt-6">
                     <p className='text-[10px] text-gray-500 uppercase tracking-[0.2em] text-center font-black mb-2'>
                        Developed By
                    </p>
                    <h4 className="text-sm font-bold text-gray-300 text-center mb-4">Sudip Ghara</h4>
                    
                    <div className="flex items-center justify-center gap-6">
                        <a href='https://sudipghara19.github.io/Portfolio/' 
                           target="_blank" rel="noopener noreferrer"
                           className="text-gray-500 hover:text-violet-400 transition-colors">
                            <FaGlobe className="text-xl" />
                        </a>
                        <a href='https://www.linkedin.com/in/sudip-ghara-b24865214/' 
                           target="_blank" rel="noopener noreferrer"
                           className="text-gray-500 hover:text-blue-400 transition-colors">
                            <FaLinkedin className="text-xl" />
                        </a>
                        <a href='https://github.com/SudipGhara19' 
                           target="_blank" rel="noopener noreferrer"
                           className="text-gray-500 hover:text-white transition-colors">
                            <FaGithub className="text-xl" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Overlay when Mobile Sidebar is Open */}
            {isOpen && <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40" onClick={() => setIsOpen(false)}></div>}
        </>
    )
}

export default Sidebar

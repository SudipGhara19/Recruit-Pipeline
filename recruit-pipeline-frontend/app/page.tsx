'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import Sidebar from '@/components/Sidebar'
import { LuLayoutDashboard } from "react-icons/lu"
import { PiFoldersFill } from "react-icons/pi"
import { TbHexagon3D } from "react-icons/tb"
import { FaRegFolderOpen } from "react-icons/fa6"
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Define a mapping of tabs to icons and titles
const tabInfo: Record<string, { title: string; icon: React.ReactNode }> = {
    dashboard: { title: "Dashboard", icon: <LuLayoutDashboard className="inline-block mr-2 text-violet-600" /> },
    folders: { title: "Folders", icon: <PiFoldersFill className="inline-block mr-2 text-violet-600" /> },
    allModels: { title: "All Models", icon: <TbHexagon3D className="inline-block mr-2 text-violet-600" /> },
};

export default function Home() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "dashboard"

  if (!isAuthenticated) {
     return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
          <h1 className="text-4xl font-bold mb-8">Recruit Pipeline</h1>
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
             <h2 className="text-2xl font-semibold mb-6 text-red-500">Not Logged In</h2>
             <div className="flex gap-4 justify-center">
                <Link href="/auth/login" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                  Login
                </Link>
                <Link href="/auth/signup" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                  Signup
                </Link>
             </div>
          </div>
        </div>
     )
  }

  return (
    <div className='w-screen h-screen flex bg-gray-100'>
        {/* Sidebar - Fixed at 20% width on desktop, hidden on mobile */}
        {/* Note: Sidebar component handles the fixed positioning and structure */}
        <div className='w-[20%] h-screen bg-gray-800 md:block hidden fixed left-0 top-0'>
            <Sidebar />
        </div>

        {/* Sidebar for Mobile - handled inside Sidebar component but we need to include it in the DOM tree */}
         <div className='md:hidden'>
             <Sidebar />
         </div>


        {/* Main Content - Scrollable */}
        <div className='w-full md:w-[80%] ml-auto h-screen overflow-y-auto p-2 md:p-5 pt-20 md:pt-5'>
             <h1 className="fixed bg-white z-10 w-full md:w-[80%] text-center top-0 left-0 md:left-auto pt-20 md:pt-3 text-2xl font-bold flex items-center justify-center pb-3 border-b-[1px] border-gray-300 shadow-sm md:shadow-none">
                {tabInfo[activeTab] ? tabInfo[activeTab]?.icon :
                    <FaRegFolderOpen className="inline-block mr-2 text-violet-600" />
                }

                {tabInfo[activeTab] ? tabInfo[activeTab]?.title : activeTab}
            </h1>
            
            <div className="mt-32 md:mt-20">
                {/* Content placeholder based on tab */}
                {activeTab === 'dashboard' && <div className="p-4 bg-white rounded shadow">Dashboard Content</div>}
                {activeTab === 'folders' && <div className="p-4 bg-white rounded shadow">Folders Content</div>}
                {activeTab === 'allModels' && <div className="p-4 bg-white rounded shadow">All Models Content</div>}
            </div>
        </div>
    </div>
  )
}

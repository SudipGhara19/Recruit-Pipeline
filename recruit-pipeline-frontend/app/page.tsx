'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import Sidebar from '@/components/Sidebar'
import { useSearchParams, useRouter } from 'next/navigation'
import { LuLayoutDashboard } from "react-icons/lu"
import { useEffect } from 'react'


// Import Role Components
import RecruiterDashboard from '@/components/Recruiter/RecruiterDashboard'
import RecruiterJobs from '@/components/Recruiter/Jobs'
import RecruiterCandidates from '@/components/Recruiter/Candidates'
import RecruiterHRs from '@/components/Recruiter/HRs'

import HRDashboard from '@/components/HR/HRDashboard'
import HRJobs from '@/components/HR/Jobs'
import HRAssignCandidate from '@/components/HR/AssignCandidate'
import HRAllCandidates from '@/components/HR/AllCandidates'

import CandidateDashboard from '@/components/Candidate/CandidateDashboard'

export default function Home() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "dashboard"

  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
        router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
     return null // Don't render "Not Logged In" UI, just wait for redirect
  }

  // Get User Role
  const role = user?.role || 'Candidate'

  // Render Content Based on Role and Tab
  const renderContent = () => {
      switch (role) {
          case 'Recruiter':
              switch (activeTab) {
                  case 'dashboard': return <RecruiterDashboard />
                  case 'jobs': return <RecruiterJobs />
                  case 'candidates': return <RecruiterCandidates />
                  case 'hrs': return <RecruiterHRs />
                  default: return <RecruiterDashboard />
              }
          case 'HR':
              switch (activeTab) {
                  case 'dashboard': return <HRDashboard />
                  case 'jobs': return <HRJobs />
                  case 'assign-candidate': return <HRAssignCandidate />
                  case 'all-candidates': return <HRAllCandidates />
                  default: return <HRDashboard />
              }
          case 'Candidate':
               switch (activeTab) {
                  case 'dashboard': return <CandidateDashboard />
                  default: return <CandidateDashboard />
              }
          default:
              return <div>Unknown Role</div>
      }
  }

  // Helper to get tab title and icon (Optional, for header)
  const getHeaderInfo = () => {
       // Simple fallback for now, ideally specific headers per component
       return { title: activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' '), icon: <LuLayoutDashboard className="inline-block mr-2 text-violet-600" /> }
  }
  
  const { title, icon } = getHeaderInfo()

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
             <h1 className="fixed bg-white z-10 w-full md:w-[80%] text-center top-0 left-0 md:left-auto pt-20 md:pt-3 text-2xl font-bold flex items-center justify-center pb-3 border-b border-gray-300 shadow-sm md:shadow-none font-mono">
                {icon}
                {title}
            </h1>
            
            <div className="mt-32 md:mt-20">
                {renderContent()}
            </div>
        </div>
    </div>
  )
}


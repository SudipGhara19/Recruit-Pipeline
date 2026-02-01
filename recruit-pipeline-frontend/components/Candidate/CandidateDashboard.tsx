'use client'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/lib/store'
import { fetchUserProfile } from '@/lib/features/auth/authSlice'
import { motion } from 'framer-motion'
import { FaBriefcase, FaUserAstronaut, FaCheckCircle, FaClock, FaLayerGroup } from 'react-icons/fa'
import { BeatLoader } from 'react-spinners'

const STAGE_PROGRESS: Record<string, number> = {
    'Applied': 15,
    'Screening': 35,
    'Interview': 55,
    'Technical': 75,
    'HR': 90,
    'Selected': 100,
    'Rejected': 100
}

const STAGE_THEMES: Record<string, string> = {
    'Applied': 'from-blue-500 to-indigo-600',
    'Screening': 'from-purple-500 to-violet-600',
    'Interview': 'from-indigo-500 to-blue-600',
    'Technical': 'from-orange-500 to-amber-600',
    'HR': 'from-pink-500 to-rose-600',
    'Selected': 'from-green-500 to-emerald-600',
    'Rejected': 'from-red-500 to-rose-600'
}

export default function CandidateDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { profile, loading, user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(fetchUserProfile())
  }, [dispatch])

  if (loading && !profile) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <BeatLoader color="#8b5cf6" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Tracking your progress...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-8 text-center bg-white rounded-[2rem] shadow-xl border border-gray-100 max-w-2xl mx-auto mt-20">
        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
          <FaUserAstronaut className="text-4xl" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Welcome, {user?.fullName}!</h2>
        <p className="text-gray-500 font-medium">It looks like you haven&apos;t been assigned to any recruitment process yet. Hang tight!</p>
      </div>
    )
  }

  const progress = STAGE_PROGRESS[profile.stage] || 0
  const theme = STAGE_THEMES[profile.stage] || 'from-violet-500 to-purple-600'

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white text-3xl shadow-lg shadow-violet-200">
            <FaUserAstronaut />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Candidate Dashboard</h1>
            <p className="text-gray-500 font-medium font-serif">Hello, {profile.fullName}. Track your journey with us.</p>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Current Status</p>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse bg-${profile.stage === 'Rejected' ? 'red' : 'green'}-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]`}></span>
            <span className="text-sm font-black text-gray-700 uppercase tracking-widest">{profile.stage}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
            {/* Background Decoration */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${theme} opacity-5 blur-3xl -mr-10 -mt-10 group-hover:opacity-10 transition-opacity`}></div>
            
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-12 relative z-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-50 text-violet-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-violet-100">
                   Active Application
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{profile.jobRole?.postName || 'Position Not Specified'}</h2>
                <div className="flex items-center gap-4 text-gray-500">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <FaBriefcase className="text-violet-400" />
                    <span>Recruit Pipeline HR Team</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <FaClock className="text-violet-400" />
                    <span>Applied {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right flex flex-col justify-center">
                <p className="text-4xl font-black text-gray-900">{progress}%</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Completed</p>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="relative space-y-6 pt-6">
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-50">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${progress}%` }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className={`h-full bg-gradient-to-r ${theme} shadow-lg shadow-violet-200 relative`}
                >
                   <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </motion.div>
              </div>

              {/* Steps Labels */}
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                 {Object.keys(STAGE_PROGRESS).map((stage, i) => {
                    const isCompleted = STAGE_PROGRESS[stage] <= progress;
                    const isActive = profile.stage === stage;
                    return (
                      <div key={i} className={`flex flex-col items-center gap-2 overflow-hidden ${i > 3 ? 'hidden md:flex' : ''}`}>
                         <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                            isActive ? 'bg-violet-600 text-white shadow-lg' : 
                            isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-50 text-gray-300'
                         }`}>
                           {isCompleted && !isActive ? <FaCheckCircle /> : (i + 1)}
                         </div>
                         <p className={`text-[8px] font-black uppercase tracking-tighter text-center ${isActive ? 'text-violet-600' : 'text-gray-400'}`}>
                           {stage}
                         </p>
                      </div>
                    )
                 })}
              </div>
            </div>
          </div>

          {/* Details & Description */}
          {profile.jobRole?.description && (
             <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
                <h3 className="text-xl font-black text-gray-900 border-l-4 border-violet-500 pl-4 uppercase tracking-tighter">About the Role</h3>
                <div className="text-gray-600 font-medium leading-relaxed prose prose-sm max-w-none">
                   {profile.jobRole.description}
                </div>
             </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Profile Details</h3>
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-lg">
                       <FaLayerGroup />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience</p>
                       <p className="text-sm font-bold text-gray-900">{profile.experience || 'Not Mentioned'}</p>
                    </div>
                 </div>

                 {profile.skills && profile.skills.length > 0 && (
                    <div className="space-y-3">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Skills Recognized</p>
                       <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill: string, i: number) => (
                             <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-bold border border-gray-100 hover:border-violet-200 transition-colors">
                                {skill}
                             </span>
                          ))}
                       </div>
                    </div>
                 )}

                 <div className="pt-6 border-t border-gray-50">
                    <a 
                       href={profile.resume} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-lg active:scale-95"
                    >
                       View Submitted Resume
                    </a>
                 </div>
              </div>
           </div>

           {/* Need Help Card */}
           <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl shadow-violet-200">
              <h4 className="text-lg font-black tracking-tight">Need assistance?</h4>
              <p className="text-violet-100 text-xs font-medium leading-relaxed">If you have questions about your application or the interview process, feel free to contact our support team.</p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/20">
                 Contact Support
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}


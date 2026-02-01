import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/lib/store'
import { fetchJobs } from '@/lib/features/jobs/jobSlice'
import { fetchUsers } from '@/lib/features/users/userSlice'
import { motion, Variants } from 'framer-motion'
import { FaBriefcase, FaUsers, FaUserTie, FaArrowRight, FaClock } from 'react-icons/fa'
import { BeatLoader } from 'react-spinners'

export default function HRDashboard() {
    const dispatch = useDispatch<AppDispatch>()
    const { jobs, loading: jobsLoading } = useSelector((state: RootState) => state.jobs)
    const { users, loading: usersLoading } = useSelector((state: RootState) => state.users)

    useEffect(() => {
        dispatch(fetchJobs())
        dispatch(fetchUsers())
    }, [dispatch])

    const stats = useMemo(() => {
        const totalJobs = jobs.length
        const totalCandidates = users.filter(u => u.role === 'Candidate').length
        const totalRecruiters = users.filter(u => u.role === 'Recruiter').length
        const recentJobs = jobs.slice(0, 5)
        const recentCandidates = users.filter(u => u.role === 'Candidate').slice(0, 5)
        
        return {
            totalJobs,
            totalCandidates,
            totalRecruiters,
            recentJobs,
            recentCandidates
        }
    }, [jobs, users])

    if (jobsLoading || usersLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
                <BeatLoader color="#6D28D9" />
            </div>
        )
    }

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { 
                type: 'spring' as const, 
                stiffness: 100,
                damping: 20
            }
        }
    }

    return (
        <motion.div 
            className="p-4 md:p-8 space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">HR Dashboard</h1>
                    <p className="text-gray-500 font-medium">Monitoring recruitment activity and talent pipeline</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Jobs', value: stats.totalJobs, icon: FaBriefcase, color: 'bg-orange-500', shadow: 'shadow-orange-100' },
                    { label: 'Market Candidates', value: stats.totalCandidates, icon: FaUsers, color: 'bg-teal-500', shadow: 'shadow-teal-100' },
                    { label: 'Active Recruiters', value: stats.totalRecruiters, icon: FaUserTie, color: 'bg-pink-500', shadow: 'shadow-pink-100' },
                ].map((stat, idx) => (
                    <motion.div 
                        key={idx}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6"
                    >
                        <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg ${stat.shadow}`}>
                            <stat.icon className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-3xl font-black text-gray-800">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Candidates List */}
                <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">New Talent</h2>
                        <button className="text-violet-600 hover:text-violet-700 text-sm font-bold flex items-center gap-1 transition-all group">
                            View Pipeline <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {stats.recentCandidates.length > 0 ? (
                            stats.recentCandidates.map((candidate) => (
                                <div key={candidate._id} className="p-4 hover:bg-teal-50/20 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-lg shadow-inner">
                                            {candidate.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{candidate.fullName}</h4>
                                            <p className="text-xs text-gray-500 font-medium">{candidate.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                                        <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">New</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-400 font-medium">
                                <FaUsers className="text-4xl text-gray-100 mx-auto mb-3" />
                                <p>No candidates available.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Job Overviews */}
                <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Recent Postings</h2>
                        <button className="text-violet-600 hover:text-violet-700 text-sm font-bold flex items-center gap-1 transition-all group">
                            All Jobs <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {stats.recentJobs.length > 0 ? (
                            stats.recentJobs.map((job) => (
                                <div key={job._id} className="p-4 hover:bg-orange-50/20 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-400 group-hover:bg-orange-100 group-hover:text-orange-600 font-bold text-lg transition-all shadow-inner border border-gray-50 group-hover:border-orange-200">
                                            <FaBriefcase className="text-xl" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{job.postName}</h4>
                                            <p className="text-xs text-gray-500 font-medium">{job.salary}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <FaClock className="text-orange-300" />
                                            <span>Recent</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-black">{new Date(job.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-400 font-medium">
                                <FaBriefcase className="text-4xl text-gray-100 mx-auto mb-3" />
                                <p>No current job postings.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}


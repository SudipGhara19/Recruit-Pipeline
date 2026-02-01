import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/lib/store'
import { fetchJobs } from '@/lib/features/jobs/jobSlice'
import { fetchCandidates } from '@/lib/features/candidates/candidateSlice'
import { motion, Variants } from 'framer-motion'
import { FaBriefcase, FaUsers, FaClipboardList, FaArrowRight } from 'react-icons/fa'
import { BeatLoader } from 'react-spinners'
import { useRouter } from 'next/navigation'

export default function RecruiterDashboard() {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const { jobs, loading: jobsLoading } = useSelector((state: RootState) => state.jobs)
    const { candidates, loading: candidatesLoading } = useSelector((state: RootState) => state.candidates)

    useEffect(() => {
        dispatch(fetchJobs())
        dispatch(fetchCandidates())
    }, [dispatch])

    const stats = useMemo(() => {
        const activeJobs = jobs.length
        const totalCandidates = candidates.length
        const totalApplications = candidates.length // Basic proxy: each candidate record is an application
        const recentJobs = [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
        const recentCandidates = [...candidates].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
        
        return {
            activeJobs,
            totalCandidates,
            totalApplications,
            recentJobs,
            recentCandidates
        }
    }, [jobs, candidates])

    if (jobsLoading || candidatesLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
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
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Recruiter Dashboard</h1>
                    <p className="text-gray-500 font-medium">Overview of your recruitment pipeline</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Jobs', value: stats.activeJobs, icon: FaBriefcase, color: 'bg-blue-500' },
                    { label: 'Candidates', value: stats.totalCandidates, icon: FaUsers, color: 'bg-green-500' },
                    { label: 'Total Placements', value: stats.totalApplications, icon: FaClipboardList, color: 'bg-violet-500' },
                ].map((stat, idx) => (
                    <motion.div 
                        key={idx}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6"
                    >
                        <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg shadow-${stat.color.split('-')[1]}-100`}>
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
                {/* Candidates List */}
                <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Recent Candidates</h2>
                        <button 
                            onClick={() => router.push('?tab=candidates')}
                            className="text-violet-600 hover:text-violet-700 text-sm font-bold flex items-center gap-1 transition-all group"
                        >
                            View All <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {stats.recentCandidates.length > 0 ? (
                            stats.recentCandidates.map((candidate) => (
                                <div key={candidate._id} className="p-4 hover:bg-violet-50/30 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-lg shadow-inner">
                                            {candidate.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{candidate.fullName}</h4>
                                            <p className="text-xs text-gray-500 font-medium">{candidate.email}</p>
                                        </div>
                                    </div>
                                    <span className="bg-green-100 text-green-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest hidden sm:block">Active</span>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <FaUsers className="text-4xl text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-400 font-medium">No candidates registered yet.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Recent Jobs */}
                <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Latest Postings</h2>
                        <button 
                            onClick={() => router.push('?tab=jobs')}
                            className="text-violet-600 hover:text-violet-700 text-sm font-bold flex items-center gap-1 transition-all group"
                        >
                            View All <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {stats.recentJobs.length > 0 ? (
                            stats.recentJobs.map((job) => (
                                <div key={job._id} className="p-4 hover:bg-violet-50/30 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-violet-100 group-hover:text-violet-600 font-bold text-lg transition-all shadow-inner border border-gray-100 group-hover:border-violet-200">
                                            <FaBriefcase className="text-xl" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{job.postName}</h4>
                                            <p className="text-xs text-gray-500 font-medium">{job.salary}</p>
                                        </div>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Post Date</p>
                                        <p className="text-xs text-gray-600 font-bold">{new Date(job.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <FaBriefcase className="text-4xl text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-400 font-medium">No jobs posted yet.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}


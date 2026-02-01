import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/lib/store'
import { fetchJobs } from '@/lib/features/jobs/jobSlice'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { FaBriefcase, FaMoneyBillWave, FaCode, FaCalendarAlt, FaSearch } from 'react-icons/fa'
import { BeatLoader } from 'react-spinners'
import ViewJobModal from './ViewJobModal'
import { Job } from '@/lib/features/jobs/jobSlice'

export default function Jobs() {
    const dispatch = useDispatch<AppDispatch>()
    const { jobs, loading, error } = useSelector((state: RootState) => state.jobs)
    
    // Modal State
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)

    useEffect(() => {
        dispatch(fetchJobs())
    }, [dispatch])

    const sortedJobs = useMemo(() => {
        if (!jobs) return []
        return [...jobs].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return dateB - dateA
        })
    }, [jobs])

    const handleViewDetails = (job: Job) => {
        setSelectedJob(job)
        setIsViewModalOpen(true)
    }

    if (loading && jobs.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
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

    const cardVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring' as const,
                stiffness: 100
            }
        },
        hover: {
            scale: 1.01,
            y: -5,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: {
                type: 'spring' as const,
                stiffness: 400,
                damping: 10
            }
        }
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Job Inventory</h2>
                    <p className="text-gray-500 text-sm">Reviewing all active job postings across departments</p>
                </div>
                <div className="relative w-full md:w-64 group">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search positions..." 
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm">
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            <motion.div 
                className="grid grid-cols-1 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {sortedJobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <FaBriefcase className="text-4xl text-gray-300 mb-2" />
                        <p className="text-gray-500 font-medium">No job postings available for review.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {sortedJobs.map((job) => (
                            <motion.div 
                                key={job._id}
                                variants={cardVariants}
                                whileHover="hover"
                                layout
                                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row group transition-all"
                            >
                                <div className="w-full md:w-2 bg-orange-400 transition-all group-hover:bg-orange-500" />
                                <div className="p-6 flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors tracking-tight">
                                                    {job.postName}
                                                </h3>
                                            </div>
                                            <p className="text-gray-500 leading-relaxed text-sm line-clamp-2 md:line-clamp-none font-medium">
                                                {job.Description}
                                            </p>
                                        </div>
                                        <div className="shrink-0 mt-4 md:mt-0">
                                            <div className="flex items-center justify-center md:justify-start gap-2 text-orange-700 font-black text-lg md:text-xl bg-orange-50/50 px-4 md:px-5 py-2 rounded-2xl border border-orange-100/50 w-fit">
                                                <FaMoneyBillWave className="text-orange-400" />
                                                <span>{job.salary}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-2">
                                        <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-black uppercase tracking-widest mr-2">
                                            <FaCode className="text-orange-400" />
                                            <span>Tech Stack:</span>
                                        </div>
                                        {job.keySkills.map((skill, idx) => (
                                            <span key={idx} className="bg-gray-50 group-hover:bg-orange-50 text-gray-500 group-hover:text-orange-600 px-4 py-1.5 rounded-xl text-xs font-bold border border-gray-100 group-hover:border-orange-200 transition-all">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-5 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 text-[10px] sm:text-xs font-bold text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <FaCalendarAlt className="text-orange-300" />
                                                <span>Posted on: <span className="text-gray-600">{new Date(job.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span></span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleViewDetails(job)}
                                            className="text-orange-600 hover:bg-orange-50 px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all border border-orange-100 hover:border-orange-200 active:scale-95 shadow-sm w-full sm:w-auto text-center"
                                        >
                                            View Full Details
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </motion.div>

            {/* Details Modal */}
            <ViewJobModal 
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                job={selectedJob}
            />
        </div>
    )
}



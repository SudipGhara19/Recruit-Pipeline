import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/lib/store'
import { FaPlus, FaBriefcase, FaMoneyBillWave, FaCode, FaCalendarAlt } from 'react-icons/fa'
import { BeatLoader } from 'react-spinners'
import AddJobModal from './AddJobModal'
import EditJobModal from './EditJobModal'
import DeleteJobModal from './DeleteJobModal'
import { fetchJobs, Job } from '@/lib/features/jobs/jobSlice'
import { motion, AnimatePresence, Variants } from 'framer-motion'

export default function Jobs() {
    const { jobs, loading, error } = useSelector((state: RootState) => state.jobs)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(fetchJobs())
    }, [dispatch])

    // Sort jobs by createdAt descending (Latest first)
    const sortedJobs = useMemo(() => {
        if (!jobs) return []
        return [...jobs].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return dateB - dateA
        })
    }, [jobs])

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
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Available Jobs</h2>
                    <p className="text-gray-500 text-sm">Manage and track your job postings</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                    <FaPlus className="text-sm" />
                    <span className="font-semibold">Add Job</span>
                </button>
            </div>

            <AddJobModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <EditJobModal 
                key={selectedJob?._id} 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                job={selectedJob} 
            />
            <DeleteJobModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                jobId={selectedJob?._id || ''} 
                jobTitle={selectedJob?.postName || ''} 
            />

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            <motion.div 
                className="grid grid-cols-1 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {!sortedJobs || sortedJobs.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center h-64 bg-white rounded-xl border-2 border-dashed border-gray-200">
                        <FaBriefcase className="text-4xl text-gray-300 mb-2" />
                        <p className="text-gray-500">No jobs posted yet.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {sortedJobs.map((job) => job && (
                            <motion.div 
                                key={job._id}
                                variants={cardVariants}
                                whileHover="hover"
                                layout
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-colors overflow-hidden flex flex-col md:flex-row group cursor-pointer"
                            >
                                <div className="w-full md:w-1.5 bg-violet-500 transition-all group-hover:bg-violet-600" />
                                <div className="p-6 flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-violet-600 transition-colors">
                                                    {job?.postName || 'Untitled Position'}
                                                </h3>
                                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed text-sm line-clamp-2 md:line-clamp-none">
                                                {job?.Description || 'No description provided'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                            <div className="flex items-center gap-2 text-violet-700 font-extrabold text-xl bg-violet-50 px-4 py-1.5 rounded-xl border border-violet-100">
                                                <FaMoneyBillWave className="text-violet-400" />
                                                <span>{job?.salary || 'Unspecified'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-2">
                                        <div className="flex items-center gap-1.5 text-gray-500 text-sm mr-2 py-1">
                                            <FaCode className="text-violet-500" />
                                            <span className="font-bold">Key Skills:</span>
                                        </div>
                                        {job?.keySkills?.map((skill, idx) => (
                                            <span key={idx} className="bg-gray-50 group-hover:bg-violet-50 text-gray-600 group-hover:text-violet-700 px-4 py-1.5 rounded-xl text-xs font-bold border border-gray-100 group-hover:border-violet-200 transition-all shadow-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-5 border-t border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                                                <FaCalendarAlt className="text-violet-300" />
                                                <span>Posted: <span className="text-gray-500">{job?.createdAt ? new Date(job.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Unknown Date'}</span></span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 w-full sm:w-auto">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setSelectedJob(job)
                                                    setIsEditModalOpen(true)
                                                }}
                                                className="flex-1 sm:flex-none text-violet-600 hover:bg-violet-50 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-transparent hover:border-violet-200"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setSelectedJob(job)
                                                    setIsDeleteModalOpen(true)
                                                }}
                                                className="flex-1 sm:flex-none text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-transparent hover:border-red-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </motion.div>
        </div>
    )
}

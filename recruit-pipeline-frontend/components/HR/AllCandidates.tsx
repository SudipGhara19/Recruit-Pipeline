'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/lib/store'
import { fetchCandidates, deleteCandidate, Candidate } from '@/lib/features/candidates/candidateSlice'
import { fetchJobs } from '@/lib/features/jobs/jobSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    FaSearch, FaFilter, FaBriefcase, FaUserGraduate, 
    FaEnvelope, FaUserAlt, FaClock
} from 'react-icons/fa'
import { BeatLoader } from 'react-spinners'
import CandidateDetailsModal from './CandidateDetailsModal'
import UpdateStageModal from './UpdateStageModal'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { toast } from 'react-hot-toast'

const STAGES = ['Applied', 'Screening', 'Interview', 'Technical', 'HR', 'Selected', 'Rejected']

const STAGE_COLORS: Record<string, string> = {
    Applied: 'bg-blue-50 text-blue-600 border-blue-100',
    Screening: 'bg-purple-50 text-purple-600 border-purple-100',
    Interview: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    Technical: 'bg-orange-50 text-orange-600 border-orange-100',
    HR: 'bg-pink-50 text-pink-600 border-pink-100',
    Selected: 'bg-green-50 text-green-600 border-green-100',
    Rejected: 'bg-red-50 text-red-600 border-red-100',
}

export default function AllCandidates() {
    const dispatch = useDispatch<AppDispatch>()
    const { candidates, loading } = useSelector((state: RootState) => state.candidates)
    const { jobs } = useSelector((state: RootState) => state.jobs)

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [jobFilter, setJobFilter] = useState('All')

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

    // Update Stage Modal State
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [candidateToUpdate, setCandidateToUpdate] = useState<Candidate | null>(null)

    // Delete State
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null)

    useEffect(() => {
        dispatch(fetchCandidates())
        dispatch(fetchJobs())
    }, [dispatch])

    const filteredCandidates = useMemo(() => {
        return candidates.filter(candidate => {
            const matchesSearch = candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = statusFilter === 'All' || candidate.stage === statusFilter
            const matchesJob = jobFilter === 'All' || candidate.jobRole?._id === jobFilter
            return matchesSearch && matchesStatus && matchesJob
        })
    }, [candidates, searchTerm, statusFilter, jobFilter])

    const handleViewDetails = (candidate: Candidate) => {
        setSelectedCandidate(candidate)
        setIsModalOpen(true)
    }

    const handleOpenUpdateModal = (e: React.MouseEvent, candidate: Candidate) => {
        e.stopPropagation()
        setCandidateToUpdate(candidate)
        setIsUpdateModalOpen(true)
    }

    const handleDeleteCandidate = async (id: string) => {
        if (!id) return
        try {
            await dispatch(deleteCandidate(id)).unwrap()
            toast.success('Candidate deleted successfully')
            setCandidateToDelete(null)
        } catch (err) {
            toast.error(typeof err === 'string' ? err : 'Failed to delete candidate')
        } finally {
            setIsDeleting(null)
        }
    }

    if (loading && candidates.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <BeatLoader color="#8b5cf6" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading talent pool...</p>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <span className="bg-violet-100 p-3 rounded-2xl text-violet-600">
                            <FaUserGraduate />
                        </span>
                        Talent Inventory
                    </h1>
                    <p className="text-gray-500 font-medium font-serif">Manage and track all candidates in your recruitment pipeline</p>
                </div>
                <div className="flex items-center gap-2 bg-violet-50 px-4 py-2 rounded-2xl border border-violet-100 text-violet-700 font-black">
                    <span className="text-2xl">{candidates.length}</span>
                    <span className="text-xs uppercase tracking-widest mt-1">Total Candidates</span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/50 backdrop-blur-md p-4 rounded-[2.5rem] border border-white shadow-xl shadow-gray-200/50 sticky top-4 z-20">
                <div className="relative group">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 transition-all font-medium placeholder:text-gray-400 shadow-sm"
                    />
                </div>
                
                <div className="relative group">
                    <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-violet-500/10 transition-all font-medium appearance-none shadow-sm"
                    >
                        <option value="All">All Stages</option>
                        {STAGES.map(stage => (
                            <option key={stage} value={stage}>{stage}</option>
                        ))}
                    </select>
                </div>

                <div className="relative group">
                    <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                    <select
                        value={jobFilter}
                        onChange={(e) => setJobFilter(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-violet-500/10 transition-all font-medium appearance-none shadow-sm"
                    >
                        <option value="All">All Job Roles</option>
                        {jobs.map(job => (
                            <option key={job._id} value={job._id}>{job.postName}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Candidates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode='popLayout'>
                    {filteredCandidates.map((candidate, index) => (
                        <motion.div
                            layout
                            key={candidate._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="bg-white rounded-4xl border border-gray-100/80 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 transition-all group overflow-hidden flex flex-col h-full"
                        >
                            {/* Card Header with Stage Badge */}
                            <div className="p-6 pb-0 flex justify-between items-start">
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-violet-50 group-hover:text-violet-500 transition-colors shadow-inner">
                                    <FaUserAlt className="text-2xl" />
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${STAGE_COLORS[candidate.stage]} shadow-sm`}>
                                        {candidate.stage}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={(e) => handleOpenUpdateModal(e, candidate)}
                                            className="flex items-center gap-1.5 px-2 py-1 hover:bg-violet-50 rounded-lg text-violet-400 hover:text-violet-600 transition-all text-[9px] font-black uppercase tracking-widest border border-transparent hover:border-violet-100"
                                        >
                                            <FaEdit />
                                            Update
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setCandidateToDelete(candidate)
                                            }}
                                            className="flex items-center gap-1.5 px-2 py-1 hover:bg-red-50 rounded-lg text-red-300 hover:text-red-500 transition-all text-[9px] font-black uppercase tracking-widest border border-transparent hover:border-red-100"
                                        >
                                            <FaTrash />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="p-6 space-y-4 grow">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-gray-900 group-hover:text-violet-600 transition-colors truncate">
                                        {candidate.fullName}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-400 font-bold text-xs truncate">
                                        <FaEnvelope className="shrink-0" />
                                        <span>{candidate.email}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-50 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                            <FaBriefcase className="text-sm" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Applied For</p>
                                            <p className="text-xs font-bold text-gray-700 truncate">{candidate.jobRole?.postName || 'Not Assigned'}</p>
                                        </div>
                                    </div>

                                    {candidate.skills && candidate.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-2">
                                            {candidate.skills.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-bold border border-gray-100/50">
                                                    {skill}
                                                </span>
                                            ))}
                                            {candidate.skills.length > 3 && (
                                                <span className="px-2.5 py-1 bg-violet-50 text-violet-500 rounded-lg text-[10px] font-bold border border-violet-100/50">
                                                    +{candidate.skills.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between group-hover:bg-violet-50/30 transition-colors shrink-0">
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <FaClock className="text-[10px]" />
                                    <span className="text-[10px] font-bold">Added {new Date(candidate.createdAt).toLocaleDateString()}</span>
                                </div>
                                <button 
                                    onClick={() => handleViewDetails(candidate)}
                                    className="text-[10px] font-black uppercase tracking-widest text-violet-600 hover:text-violet-700 hover:underline underline-offset-4 decoration-2"
                                >
                                    View Details
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredCandidates.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                            <FaUserGraduate className="text-4xl" />
                        </div>
                        <div className="max-w-xs">
                            <h3 className="text-lg font-black text-gray-900">No candidates found</h3>
                            <p className="text-gray-500 font-medium text-sm">Try adjusting your filters or search term to find what you&apos;re looking for.</p>
                        </div>
                        <button 
                            onClick={() => { setSearchTerm(''); setStatusFilter('All'); setJobFilter('All'); }}
                            className="text-violet-600 font-black uppercase tracking-widest text-xs hover:text-violet-700"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            <CandidateDetailsModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                candidate={selectedCandidate}
            />

            <UpdateStageModal 
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                candidate={candidateToUpdate}
            />

            {/* Simple Delete Confirmation Modal */}
            <AnimatePresence>
                {candidateToDelete && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setCandidateToDelete(null)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 shadow-2xl relative z-10 max-w-sm w-full border border-gray-100"
                        >
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner text-3xl">
                                    <FaTrash />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-gray-900">Are you sure?</h3>
                                    <p className="text-gray-500 font-medium leading-relaxed">
                                        You are about to delete <span className="text-gray-900 font-bold underline decoration-red-200 decoration-2">{candidateToDelete.fullName}</span>. This action will also remove their resume from Cloudinary and is irreversible.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3 pt-4">
                                    <button 
                                        disabled={isDeleting === candidateToDelete._id}
                                        onClick={() => {
                                            setIsDeleting(candidateToDelete._id)
                                            handleDeleteCandidate(candidateToDelete._id)
                                        }}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-200 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isDeleting === candidateToDelete._id ? <BeatLoader size={8} color="white" /> : 'Yes, Delete Candidate'}
                                    </button>
                                    <button 
                                        onClick={() => setCandidateToDelete(null)}
                                        className="w-full bg-white hover:bg-gray-50 text-gray-400 font-bold py-4 rounded-2xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

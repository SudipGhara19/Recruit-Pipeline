'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    FaTimes, FaUserAlt, FaEnvelope, FaPhone, 
    FaBriefcase, FaGraduationCap, FaTools, 
    FaFileAlt, FaCalendarAlt, FaExternalLinkAlt,
    FaUserEdit
} from 'react-icons/fa'
import { Candidate } from '@/lib/features/candidates/candidateSlice'

interface CandidateDetailsModalProps {
    candidate: Candidate | null
    isOpen: boolean
    onClose: () => void
}

const STAGE_COLORS: Record<string, string> = {
    Applied: 'bg-blue-50 text-blue-600 border-blue-100',
    Screening: 'bg-purple-50 text-purple-600 border-purple-100',
    Interview: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    Technical: 'bg-orange-50 text-orange-600 border-orange-100',
    HR: 'bg-pink-50 text-pink-600 border-pink-100',
    Selected: 'bg-green-50 text-green-600 border-green-100',
    Rejected: 'bg-red-50 text-red-600 border-red-100',
}

export default function CandidateDetailsModal({ candidate, isOpen, onClose }: CandidateDetailsModalProps) {
    const [activeTab, setActiveTab] = React.useState<'info' | 'resume'>('info')

    if (!candidate) return null

    const isPdf = candidate.resume?.toLowerCase().endsWith('.pdf')

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 mb-10">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[85vh]"
                    >
                        {/* Header Image/Pattern */}
                        <div className="h-24 bg-linear-to-r from-violet-500 to-indigo-600 relative shrink-0">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors z-10"
                            >
                                <FaTimes />
                            </button>
                            <div className="absolute -bottom-10 left-8 p-1 bg-white rounded-3xl shadow-xl">
                                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                    <FaUserAlt className="text-3xl" />
                                </div>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="pt-12 flex flex-col grow overflow-hidden">
                            {/* Primary Info & Tabs */}
                            <div className="px-8 pb-4 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-gray-900 leading-tight">{candidate.fullName}</h2>
                                    <div className={`inline-flex px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${STAGE_COLORS[candidate.stage]} shadow-sm`}>
                                        {candidate.stage} Stage
                                    </div>
                                </div>
                                
                                {/* Tabs */}
                                <div className="flex bg-gray-100/50 p-1.5 rounded-2xl gap-1">
                                    <button
                                        onClick={() => setActiveTab('info')}
                                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'info' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Details
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('resume')}
                                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'resume' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Resume
                                    </button>
                                </div>
                            </div>

                            <div className="grow overflow-y-auto custom-scrollbar p-8">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'info' ? (
                                        <motion.div
                                            key="info"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="space-y-8"
                                        >
                                            {/* Info Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center shrink-0">
                                                            <FaEnvelope />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                                            <p className="text-sm font-bold text-gray-700 truncate">{candidate.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center shrink-0">
                                                            <FaPhone />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                                                            <p className="text-sm font-bold text-gray-700">{candidate.phone || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center shrink-0">
                                                            <FaBriefcase />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied Job</p>
                                                            <p className="text-sm font-bold text-gray-700">{candidate.jobRole?.postName || 'Not Assigned'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center shrink-0">
                                                            <FaGraduationCap />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience</p>
                                                            <p className="text-sm font-bold text-gray-700">{candidate.yearsOfExperience ? `${candidate.yearsOfExperience} Years` : 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center shrink-0">
                                                            <FaUserEdit />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Added By</p>
                                                            <p className="text-sm font-bold text-gray-700">{candidate.addedBy?.fullName || 'System'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center shrink-0">
                                                            <FaCalendarAlt />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Added On</p>
                                                            <p className="text-sm font-bold text-gray-700">{new Date(candidate.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Skills Section */}
                                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                                <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                                    <FaTools className="text-violet-500" />
                                                    Technical Skills
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {candidate.skills && candidate.skills.length > 0 ? (
                                                        candidate.skills.map((skill, i) => (
                                                            <span key={i} className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold border border-gray-100 shadow-sm">
                                                                {skill}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-gray-500 italic">No skills listed</p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="resume"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="h-full flex flex-col gap-4"
                                        >
                                            <div className="flex justify-between items-center bg-violet-50 p-4 rounded-2xl border border-violet-100 shrink-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white text-violet-500 flex items-center justify-center shadow-sm">
                                                        <FaFileAlt />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-violet-900 uppercase tracking-widest">Document Viewer</p>
                                                        <p className="text-[10px] font-bold text-violet-600">Reviewing candidate resume</p>
                                                    </div>
                                                </div>
                                                {candidate.resume && (
                                                    <a 
                                                        href={candidate.resume} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 bg-white text-violet-600 px-4 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-sm border border-violet-100 hover:bg-violet-50 transition-all"
                                                    >
                                                        Open in New Tab
                                                        <FaExternalLinkAlt className="text-[8px]" />
                                                    </a>
                                                )}
                                            </div>

                                            <div className="grow bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 relative min-h-[400px]">
                                                {candidate.resume ? (
                                                    isPdf ? (
                                                        <iframe 
                                                            src={`https://docs.google.com/viewer?url=${encodeURIComponent(candidate.resume)}&embedded=true`}
                                                            className="w-full h-full border-none"
                                                            title="Resume Preview"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-sm">
                                                                <FaFileAlt className="text-2xl" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-black text-gray-900 uppercase tracking-widest text-sm">Preview Unavailable</h4>
                                                                <p className="text-gray-500 text-xs font-medium max-w-xs mt-1">This document format cannot be previewed directly. Please open it in a new tab to view or download.</p>
                                                            </div>
                                                            <a 
                                                                href={candidate.resume} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="bg-violet-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-violet-200"
                                                            >
                                                                View Document
                                                            </a>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 italic">
                                                        No resume uploaded
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
                            <button
                                onClick={onClose}
                                className="bg-white border border-gray-200 text-gray-700 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-sm hover:bg-gray-50 transition-all active:scale-95"
                            >
                                Close Details
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}


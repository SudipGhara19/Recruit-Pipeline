'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaBriefcase, FaMoneyBillWave, FaCode, FaCalendarAlt, FaIdBadge } from 'react-icons/fa'
import { Job } from '@/lib/features/jobs/jobSlice'

interface ViewJobModalProps {
    isOpen: boolean
    onClose: () => void
    job: Job | null
}

export default function ViewJobModal({ isOpen, onClose, job }: ViewJobModalProps) {
    if (!job) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header Image/Pattern */}
                        <div className="h-32 bg-linear-to-r from-orange-400 to-pink-500 relative shrink-0">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all backdrop-blur-md z-10"
                            >
                                <FaTimes />
                            </button>
                            <div className="absolute -bottom-10 left-8">
                                <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center text-orange-500 text-3xl">
                                    <FaBriefcase />
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="pt-14 p-6 sm:p-8 space-y-8 overflow-y-auto custom-scrollbar">
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">{job.postName}</h2>
                                    <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-2 rounded-xl font-black text-base sm:text-lg border border-orange-100 shrink-0">
                                        <FaMoneyBillWave className="shrink-0" />
                                        <span>{job.salary}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-gray-400 text-sm font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5">
                                        <FaCalendarAlt />
                                        <span>{new Date(job.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 border-l pl-4 border-gray-100">
                                        <FaIdBadge />
                                        <span>ID: {job._id.slice(-6)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Job Description</h3>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                                        {job.Description}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 pb-4">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <FaCode className="text-orange-400" /> Key Skills Required
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.keySkills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-white border-2 border-orange-100 text-orange-600 px-4 py-2 rounded-xl text-sm font-black shadow-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 p-4 sm:p-6 flex justify-end px-6 sm:px-8 border-t border-gray-100 shrink-0">
                            <button
                                onClick={onClose}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 shadow-orange-200 w-full sm:w-auto text-center text-xs sm:text-sm"
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

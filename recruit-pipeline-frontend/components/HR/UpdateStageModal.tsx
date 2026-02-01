'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/lib/store'
import { updateCandidateStage, Candidate } from '@/lib/features/candidates/candidateSlice'
import { BeatLoader } from 'react-spinners'

interface UpdateStageModalProps {
    candidate: Candidate | null
    isOpen: boolean
    onClose: () => void
}

const STAGES = ['Applied', 'Screening', 'Interview', 'Technical', 'HR', 'Selected', 'Rejected']

const STAGE_DESCRIPTIONS: Record<string, string> = {
    Applied: 'Initial application received and logged.',
    Screening: 'Reviewing resume and initial profile fit.',
    Interview: 'Scheduled for behavioral or initial call.',
    Technical: 'Evaluating technical skills and assessment.',
    HR: 'Final cultural fit and salary discussion.',
    Selected: 'Hiring decision confirmed. Proceeding to offer.',
    Rejected: 'Candidate is not a fit for this specific role.',
}

export default function UpdateStageModal({ candidate, isOpen, onClose }: UpdateStageModalProps) {
    const dispatch = useDispatch<AppDispatch>()
    const [selectedStage, setSelectedStage] = useState(candidate?.stage || '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Reset selection when modal opens with a new candidate
    React.useEffect(() => {
        if (candidate) {
            setSelectedStage(candidate.stage)
            setError(null)
        }
    }, [candidate])

    if (!candidate) return null

    const handleUpdate = async () => {
        if (selectedStage === candidate.stage) {
            onClose()
            return
        }

        setLoading(true)
        setError(null)

        try {
            await dispatch(updateCandidateStage({ id: candidate._id, stage: selectedStage })).unwrap()
            onClose()
        } catch (err: unknown) {
            const errorMessage = err as string
            setError(errorMessage || 'Failed to update stage')
        } finally {
            setLoading(false)
        }
    }

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
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-lg bg-white rounded-4xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 space-y-6">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Update Pipeline Stage</h2>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Candidate: {candidate.fullName}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold"
                                >
                                    <FaExclamationCircle className="shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            {/* Stage Selector */}
                            <div className="space-y-3">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Select New Stage</p>
                                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {STAGES.map((stage) => (
                                        <button
                                            key={stage}
                                            onClick={() => setSelectedStage(stage)}
                                            className={`w-full p-4 rounded-2xl border-2 text-left transition-all group flex items-center justify-between ${
                                                selectedStage === stage 
                                                ? 'border-violet-500 bg-violet-50/50 shadow-sm' 
                                                : 'border-gray-100 hover:border-violet-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="space-y-0.5">
                                                <p className={`text-sm font-black ${selectedStage === stage ? 'text-violet-700' : 'text-gray-700'}`}>
                                                    {stage}
                                                </p>
                                                <p className="text-[10px] font-medium text-gray-400 leading-tight">
                                                    {STAGE_DESCRIPTIONS[stage]}
                                                </p>
                                            </div>
                                            {selectedStage === stage && (
                                                <FaCheckCircle className="text-violet-500 shadow-sm rounded-full" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-4 px-6 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all font-serif"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={loading || selectedStage === candidate.stage}
                                    className="flex-2 py-4 px-6 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {loading ? <BeatLoader color="#ffffff" size={6} /> : 'Confirm Update'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

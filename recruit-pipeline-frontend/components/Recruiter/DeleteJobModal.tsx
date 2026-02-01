'use client'

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/lib/store'
import { deleteJob } from '@/lib/features/jobs/jobSlice'
import { AiOutlineClose, AiOutlineExclamationCircle } from 'react-icons/ai'
import { BeatLoader } from 'react-spinners'

interface DeleteJobModalProps {
    isOpen: boolean
    onClose: () => void
    jobId: string
    jobTitle: string
}

export default function DeleteJobModal({ isOpen, onClose, jobId, jobTitle }: DeleteJobModalProps) {
    const dispatch = useDispatch<AppDispatch>()
    const { loading, error } = useSelector((state: RootState) => state.jobs)

    const handleDelete = async () => {
        const resultAction = await dispatch(deleteJob(jobId))
        if (deleteJob.fulfilled.match(resultAction)) {
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div className="bg-red-100 p-3 rounded-full">
                            <AiOutlineExclamationCircle className="text-3xl text-red-600" />
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <AiOutlineClose className="text-xl text-gray-400" />
                        </button>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-xl font-bold text-gray-800">Delete Job Posting?</h3>
                        <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                            Are you sure you want to delete <span className="font-bold text-gray-800">&quot;{jobTitle}&quot;</span>? This action cannot be undone and all data associated with this job will be permanently removed.
                        </p>
                    </div>

                    {error && (
                        <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-xs font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="mt-8 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 p-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="flex-1 p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-lg shadow-red-100 hover:shadow-red-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <BeatLoader size={8} color="#ffffff" />
                            ) : (
                                "Delete Job"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

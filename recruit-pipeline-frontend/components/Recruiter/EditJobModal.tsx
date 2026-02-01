'use client'

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/lib/store'
import { updateJob, Job } from '@/lib/features/jobs/jobSlice'
import { AiOutlineClose } from 'react-icons/ai'
import { FaBriefcase, FaMoneyBillWave, FaCode, FaAlignLeft } from 'react-icons/fa'
import { BeatLoader } from 'react-spinners'

interface EditJobModalProps {
    isOpen: boolean
    onClose: () => void
    job: Job | null
}

export default function EditJobModal({ isOpen, onClose, job }: EditJobModalProps) {
    const [formData, setFormData] = useState({
        postName: job?.postName || '',
        Description: job?.Description || '',
        salary: job?.salary || '',
        keySkills: Array.isArray(job?.keySkills) ? job.keySkills.join(', ') : '',
    })
    const [success, setSuccess] = useState(false)
    const dispatch = useDispatch<AppDispatch>()
    const { loading, error } = useSelector((state: RootState) => state.jobs)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!job) return

        const skillsArray = formData.keySkills.split(',').map(s => s.trim()).filter(s => s !== '')
        
        const resultAction = await dispatch(updateJob({
            id: job._id,
            jobData: {
                ...formData,
                keySkills: skillsArray
            }
        }))

        if (updateJob.fulfilled.match(resultAction)) {
            setSuccess(true)
            setTimeout(() => {
                setSuccess(false)
                onClose()
            }, 2000)
        }
    }

    if (!isOpen || !job) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <FaBriefcase className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Edit Job Details</h2>
                            <p className="text-indigo-100 text-xs mt-0.5">Update information for this posting</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <AiOutlineClose className="text-2xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 px-4">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm font-bold border border-green-100 px-4 text-center animate-bounce">
                            Changes Saved Successfully!
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <FaBriefcase className="text-indigo-500" />
                                Post Name
                            </label>
                            <input
                                required
                                name="postName"
                                value={formData.postName}
                                onChange={handleChange}
                                placeholder="e.g. Senior Frontend Developer"
                                className="w-full p-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-900"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <FaAlignLeft className="text-indigo-500" />
                                Description
                            </label>
                            <textarea
                                required
                                name="Description"
                                value={formData.Description}
                                onChange={handleChange}
                                placeholder="Describe the role and responsibilities..."
                                rows={4}
                                className="w-full p-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400 font-medium resize-none text-gray-900"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <FaMoneyBillWave className="text-indigo-500" />
                                    Salary
                                </label>
                                <input
                                    required
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    placeholder="e.g. $80k - $120k"
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-900"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <FaCode className="text-indigo-500" />
                                    Key Skills
                                </label>
                                <input
                                    required
                                    name="keySkills"
                                    value={formData.keySkills}
                                    onChange={handleChange}
                                    placeholder="e.g. React, Node.js, Tailwind"
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-900"
                                />
                                <p className="text-[10px] text-gray-400 ml-1 italic">Separate skills with commas</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 p-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-100 hover:shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <BeatLoader size={8} color="#ffffff" />
                                    <span>Updating...</span>
                                </>
                            ) : (
                                "Update Job"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

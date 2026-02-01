import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/lib/store'
import { fetchJobs } from '@/lib/features/jobs/jobSlice'
import { addCandidate, clearCandidateState } from '@/lib/features/candidates/candidateSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    FaUserPlus, FaEnvelope, FaPhone, FaTools, 
    FaBriefcase, FaFileUpload, FaCheckCircle, 
    FaExclamationCircle, FaUserTie, FaMagic 
} from 'react-icons/fa'
import api from '@/lib/axios'
import { BeatLoader } from 'react-spinners'

export default function AssignCandidate() {
    const dispatch = useDispatch<AppDispatch>()
    const { jobs } = useSelector((state: RootState) => state.jobs)
    const { loading, error, success } = useSelector((state: RootState) => state.candidates)
    const { user } = useSelector((state: RootState) => state.auth)

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        skills: '',
        yearsOfExperience: '',
        jobRole: '',
        stage: 'Applied'
    })
    const [resume, setResume] = useState<File | null>(null)
    const [fileName, setFileName] = useState('')
    const [loadingAI, setLoadingAI] = useState(false)

    useEffect(() => {
        dispatch(fetchJobs())
    }, [dispatch])

    useEffect(() => {
        if (success) {
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                skills: '',
                yearsOfExperience: '',
                jobRole: '',
                stage: 'Applied'
            })
            setResume(null)
            setFileName('')
            const timer = setTimeout(() => dispatch(clearCandidateState()), 3000)
            return () => clearTimeout(timer)
        }
    }, [success, dispatch])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setResume(file)
            setFileName(file.name)
        }
    }

    const analyzeResume = async () => {
        if (!resume) return
        
        setLoadingAI(true)
        const data = new FormData()
        data.append('resume', resume)

        try {
            const response = await api.post('/ai/parse-resume', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            
            const extracted = response.data.data
            setFormData(prev => ({
                ...prev,
                fullName: extracted.fullName || prev.fullName,
                email: extracted.email || prev.email,
                phone: extracted.phone || prev.phone,
                skills: extracted.skills || prev.skills,
                yearsOfExperience: extracted.yearsOfExperience || prev.yearsOfExperience
            }))
        } catch (err: unknown) {
            console.error("AI Analysis failed:", err)
        } finally {
            setLoadingAI(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const data = new FormData()
        data.append('fullName', formData.fullName)
        data.append('email', formData.email)
        data.append('phone', formData.phone)
        data.append('skills', formData.skills)
        data.append('yearsOfExperience', formData.yearsOfExperience)
        data.append('jobRole', formData.jobRole)
        data.append('stage', formData.stage)
        data.append('addedBy', user?._id || '')
        
        if (resume) {
            data.append('resume', resume)
        }

        dispatch(addCandidate(data))
    }

    const inputClasses = "w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all font-medium"
    const labelClasses = "text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block"

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <span className="bg-violet-100 p-3 rounded-2xl text-violet-600">
                            <FaUserPlus />
                        </span>
                        Assign New Candidate
                    </h1>
                    <p className="text-gray-500 font-medium">Add a new talent profile to the recruitment pipeline</p>
                </div>
                <div className="bg-teal-50 px-5 py-2.5 rounded-2xl border border-teal-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-100">
                        <FaUserTie />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest leading-none">Adding as HR</p>
                        <p className="text-sm font-bold text-gray-800 leading-tight">{user?.fullName}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Essential Info */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-4 flex items-center justify-gap-2 justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-pink-500 rounded-full" />
                                Document Upload
                            </div>
                            {resume && (
                                <button
                                    type="button"
                                    onClick={analyzeResume}
                                    disabled={loadingAI}
                                    className="bg-linear-to-r from-pink-500 to-rose-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-pink-100 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                >
                                    {loadingAI ? <BeatLoader size={4} color="#fff" /> : <><FaMagic /> AI Auto-fill</>}
                                </button>
                            )}
                        </h2>
                        <div>
                            <label className={labelClasses}>Resume (PDF, DOC, DOCX)</label>
                            <div className="mt-2 text-center">
                                <label className="flex flex-col items-center justify-center w-full h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl hover:bg-pink-50 hover:border-pink-300 transition-all cursor-pointer group">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FaFileUpload className={`text-4xl mb-3 transition-colors ${fileName ? 'text-pink-500' : 'text-gray-300 group-hover:text-pink-400'}`} />
                                        <p className="mb-2 text-sm text-gray-500 font-bold px-4">
                                            {fileName ? <span className="text-pink-600 font-black">{fileName}</span> : 'Click to upload resume'}
                                        </p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">PDF or Word docs only</p>
                                    </div>
                                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                                </label>
                                {resume && !loadingAI && (
                                    <p className="mt-2 text-[10px] text-pink-500 font-black uppercase tracking-widest">
                                        Click &quot;AI Auto-fill&quot; above to extract details
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-violet-500 rounded-full" />
                            Personal Details
                        </h2>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className={labelClasses}>Full Name</label>
                                <div className="relative group">
                                    <FaUserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                    <input 
                                        type="text" name="fullName" value={formData.fullName} 
                                        onChange={handleInputChange} required
                                        placeholder="Enter full name" className={inputClasses} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>Email Address</label>
                                <div className="relative group">
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                    <input 
                                        type="email" name="email" value={formData.email} 
                                        onChange={handleInputChange} required
                                        placeholder="name@company.com" className={inputClasses} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>Phone Number</label>
                                <div className="relative group">
                                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                                    <input 
                                        type="tel" name="phone" value={formData.phone} 
                                        onChange={handleInputChange}
                                        placeholder="+1 (555) 000-0000" className={inputClasses} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-teal-500 rounded-full" />
                            Professional Profile
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className={labelClasses}>Technical Skills (Comma separated)</label>
                                <div className="relative group">
                                    <FaTools className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                    <input 
                                        type="text" name="skills" value={formData.skills} 
                                        onChange={handleInputChange}
                                        placeholder="React, Node.js, TypeScript" className={inputClasses} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>Years of Experience</label>
                                <div className="relative group">
                                    <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                    <input 
                                        type="number" name="yearsOfExperience" value={formData.yearsOfExperience} 
                                        onChange={handleInputChange}
                                        placeholder="e.g. 5" className={inputClasses} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Role & Resume */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-orange-500 rounded-full" />
                            Assignment & Stage
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className={labelClasses}>Target Job Role</label>
                                <div className="relative group">
                                    <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    <select 
                                        name="jobRole" value={formData.jobRole} 
                                        onChange={handleInputChange} required
                                        className={inputClasses}
                                    >
                                        <option value="">Select a job role</option>
                                        {jobs.map(job => (
                                            <option key={job._id} value={job._id}>{job.postName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>Current Pipeline Stage</label>
                                <div className="relative group">
                                    <FaTools className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                                    <select 
                                        name="stage" value={formData.stage} 
                                        onChange={handleInputChange}
                                        className={inputClasses}
                                    >
                                        <option value="Applied">Applied</option>
                                        <option value="Screening">Screening</option>
                                        <option value="Interview">Interview</option>
                                        <option value="Technical">Technical</option>
                                        <option value="HR">HR</option>
                                        <option value="Selected">Selected</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>




                    {/* Status Messages */}
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600"
                            >
                                <FaExclamationCircle className="shrink-0" />
                                <p className="text-sm font-bold">{error}</p>
                            </motion.div>
                        )}
                        {success && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center gap-3 text-green-600"
                            >
                                <FaCheckCircle className="shrink-0" />
                                <p className="text-sm font-bold">Candidate assigned successfully!</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-linear-to-r from-violet-600 to-indigo-700 hover:from-violet-700 hover:to-indigo-800 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-violet-100 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
                    >
                        {loading ? <BeatLoader size={8} color="#fff" /> : (
                            <>
                                <FaUserPlus />
                                Assign Candidate
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}


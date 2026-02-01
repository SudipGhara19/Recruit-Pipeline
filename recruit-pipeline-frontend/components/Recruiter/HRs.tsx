import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/lib/store'
import { fetchUsers } from '@/lib/features/users/userSlice'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { FaUserTie, FaEnvelope, FaCheckCircle, FaUsers } from 'react-icons/fa'
import { BeatLoader } from 'react-spinners'

export default function HRs() {
    const dispatch = useDispatch<AppDispatch>()
    const { users, loading, error } = useSelector((state: RootState) => state.users)

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    const hrTeam = useMemo(() => {
        return users.filter(user => user.role === 'HR')
    }, [users])

    if (loading && users.length === 0) {
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
            transition: { type: 'spring' as const, stiffness: 100 }
        },
        hover: {
            y: -5,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: { type: 'spring' as const, stiffness: 400, damping: 10 }
        }
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">HR Team</h2>
                    <p className="text-gray-500 text-sm">Coordinate with human resources for candidate processing</p>
                </div>
                <div className="bg-violet-50 p-3 rounded-xl">
                    <FaUserTie className="text-2xl text-violet-600" />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm">
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {hrTeam.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center h-64 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <FaUsers className="text-4xl text-gray-300 mb-2" />
                        <p className="text-gray-500 font-medium">No HR team members found.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {hrTeam.map((hr) => (
                            <motion.div 
                                key={hr._id}
                                variants={cardVariants}
                                whileHover="hover"
                                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group transition-all"
                            >
                                <div className="h-24 bg-linear-to-r from-violet-500 to-indigo-600 relative">
                                    <div className="absolute -bottom-10 left-6">
                                        <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-xl">
                                            <div className="w-full h-full rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 text-3xl font-black shadow-inner">
                                                {hr.fullName.charAt(0)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                                            Team HR
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-12 p-6 pt-2">
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-violet-600 transition-colors">
                                        {hr.fullName}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                                        <FaEnvelope className="text-violet-400" />
                                        <span className="font-medium">{hr.email}</span>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Candidates Processed</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-black text-gray-800">24</span>
                                                <FaCheckCircle className="text-green-500" />
                                            </div>
                                        </div>
                                        <button className="bg-gray-50 hover:bg-violet-600 text-gray-400 hover:text-white p-3 rounded-xl transition-all shadow-inner hover:shadow-lg active:scale-95 group/btn">
                                            <FaEnvelope className="group-hover/btn:animate-bounce" />
                                        </button>
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


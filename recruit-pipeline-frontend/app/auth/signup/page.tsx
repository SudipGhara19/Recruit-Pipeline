'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import Link from 'next/link'
import Image from "next/image";
import authBG from "@/public/images/authBG.png";
import logoIMG from "@/public/images/logo.png"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BeatLoader } from "react-spinners";

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('Candidate') // Default role
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/signup', { fullName, email, password, role })
      router.push('/auth/login') // Redirect to login after signup
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Signup failed'
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="relative w-screen h-screen flex justify-center items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={authBG}
          alt="Authentication Background"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          priority
        />
      </div>

      <div className='w-[95%] sm:w-[70%] md:w-[40%] h-auto py-10 bg-black/15 bg-opacity-30 rounded-lg backdrop-blur-md flex flex-col items-center shadow-lg'>
        <div className='flex justify-center items-center gap-2 mt-3'>
            <Image
              src={logoIMG}
              alt="Recruit Pipeline Logo"
              width={200}
              height={50}
              quality={100}
              priority
            />
        </div>
        
        <h2 className="text-white text-lg font-semibold mt-2">Sign Up</h2>

        <form className='w-[80%] mt-5 flex flex-col gap-4 text-zinc-800' onSubmit={handleSubmit}>
          
            <div className='flex flex-col'>
                <label className='text-gray-900 font-semibold text-sm mb-1' htmlFor='fullName'>Full Name:</label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className="w-full p-2 rounded-lg bg-white bg-opacity-60 outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
            </div>
            
            <div className='flex flex-col'>
                <label className='text-gray-900 font-semibold text-sm mb-1' htmlFor='email-address'>Email:</label>
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full p-2 rounded-lg bg-white bg-opacity-60 outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className='flex flex-col'>
                <label className='text-gray-900 font-semibold text-sm mb-1' htmlFor='password'>Password:</label>
                <div className="relative w-full">
                  <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="w-full p-2 rounded-lg bg-white bg-opacity-60 outline-none focus:ring-2 focus:ring-violet-500 pr-10"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className='absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2'>
                        {showPassword ? (
                            <AiOutlineEyeInvisible className='cursor-pointer text-gray-600' onClick={() => setShowPassword(false)} />
                        ) : (
                            <AiOutlineEye className='cursor-pointer text-gray-600' onClick={() => setShowPassword(true)} />
                        )}
                  </div>
                </div>
            </div>

            <div className='flex flex-col'>
                <label className='text-gray-900 font-semibold text-sm mb-1' htmlFor='role'>Role:</label>
                <select
                    id="role"
                    name="role"
                    required
                    className="w-full p-2 rounded-lg bg-white bg-opacity-60 outline-none focus:ring-2 focus:ring-violet-500"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="Recruiter">Recruiter</option>
                    <option value="HR">HR</option>
                </select>
            </div>

          {error && (
            <div className="text-red-600 bg-red-100 p-2 rounded text-sm text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition-colors font-semibold mt-2 flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
                <>
                    <BeatLoader color="#ffffff" size={8} />
                    <span>Signing Up...</span>
                </>
            ) : "Sign Up"}
          </button>
        </form>
        
        <p className='mt-4 text-gray-900 text-sm font-medium'>Already have an account?
            <Link href="/auth/login" className='text-violet-900 text-sm font-bold ml-1 hover:underline'> Sign In</Link>
        </p>
      </div>
    </div>
  )
}

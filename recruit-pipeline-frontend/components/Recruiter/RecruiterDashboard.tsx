import React from 'react'

export default function RecruiterDashboard() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
       <h2 className="text-2xl font-bold mb-4 text-violet-700">Recruiter Dashboard</h2>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded shadow border-l-4 border-blue-500">
             <h3 className="text-lg font-semibold text-blue-700">Active Jobs</h3>
             <p className="text-3xl font-bold">12</p>
          </div>
           <div className="p-4 bg-green-50 rounded shadow border-l-4 border-green-500">
             <h3 className="text-lg font-semibold text-green-700">New Candidates</h3>
             <p className="text-3xl font-bold">45</p>
          </div>
           <div className="p-4 bg-purple-50 rounded shadow border-l-4 border-purple-500">
             <h3 className="text-lg font-semibold text-purple-700">Interviews</h3>
             <p className="text-3xl font-bold">8</p>
          </div>
       </div>
    </div>
  )
}

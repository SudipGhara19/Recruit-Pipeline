import React from 'react'

export default function HRDashboard() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
       <h2 className="text-2xl font-bold mb-4 text-violet-700">HR Dashboard</h2>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-orange-50 rounded shadow border-l-4 border-orange-500">
             <h3 className="text-lg font-semibold text-orange-700">Pending Approvals</h3>
             <p className="text-3xl font-bold">5</p>
          </div>
           <div className="p-4 bg-teal-50 rounded shadow border-l-4 border-teal-500">
             <h3 className="text-lg font-semibold text-teal-700">Active Recruiters</h3>
             <p className="text-3xl font-bold">8</p>
          </div>
           <div className="p-4 bg-pink-50 rounded shadow border-l-4 border-pink-500">
             <h3 className="text-lg font-semibold text-pink-700">Total Hires</h3>
             <p className="text-3xl font-bold">120</p>
          </div>
       </div>
    </div>
  )
}

import React from 'react'

export default function CandidateDashboard() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
       <h2 className="text-2xl font-bold mb-4 text-violet-700">My Applications</h2>
       <div className="space-y-4">
          {/* Placeholder for progress timeline */}
          <div className="p-4 border rounded hover:shadow-lg transition">
             <h3 className="font-semibold text-lg">Senior Developer Role</h3>
             <p className="text-gray-500 text-sm">TechCorp Inc.</p>
             <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
             </div>
             <p className="text-xs text-right mt-1 text-gray-500">Interview Scheduled</p>
          </div>
       </div>
    </div>
  )
}

import { CallTable } from "@/components/dashboard/call-table"
import { LeadScoreChart } from "@/components/dashboard/lead-score-chart"
import SignOutButton from "@/components/auth/sign-out-button"

// Force dynamic rendering so we get fresh data on page load
export const dynamic = "force-dynamic"

export default function DashboardPage() {
    return (
        <div className="container mx-auto py-10 px-4 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Live Call Dashboard</h1>
                    <p className="text-slate-500 mt-1">Real-time supervision of "Isabelle" agents.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">System Online</span>
                    </div>
                    <SignOutButton />
                </div>
            </div>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <LeadScoreChart />
                </div>

                {/* Reserved for Future Metrics or Quick Actions */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col justify-center items-center text-center">
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">Pipedrive Sync</h3>
                    <p className="text-sm text-slate-500 mb-4">CRM integration status</p>
                    <div className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                        Pending Configuration
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Inbound Calls</h2>
                <CallTable />
            </div>

            {/* SMS Dashboard Section */}
            <div className="pt-8 border-t border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <span>Recent SMS Interactions</span>
                    <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Live</span>
                </h2>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[600px]">
                    <MessageStream />
                </div>
            </div>
        </div>
    )
}

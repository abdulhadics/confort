import { Navbar } from "@/components/navbar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50 text-slate-900">
            <Navbar />
            <div className="relative z-10 pt-4">
                {children}
            </div>
        </div>
    )
}

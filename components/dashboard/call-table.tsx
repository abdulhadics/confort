"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { Call } from "@/types/database"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatDistanceToNow } from "date-fns"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CallTable({ initialCalls }: { initialCalls: Call[] }) {
    const [calls, setCalls] = useState<Call[]>(initialCalls)
    const router = useRouter()

    useEffect(() => {
        const channel = supabase
            .channel('realtime calls')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'calls'
            }, (payload) => {
                console.log('Realtime Event:', payload)

                if (payload.eventType === 'INSERT') {
                    setCalls((current) => [payload.new as Call, ...current])
                }
                else if (payload.eventType === 'UPDATE') {
                    setCalls((current) => current.map(call =>
                        call.id === (payload.new as Call).id ? (payload.new as Call) : call
                    ))
                }
                else if (payload.eventType === 'DELETE') {
                    setCalls((current) => current.filter(call =>
                        call.id !== (payload.old as { id: number }).id
                    ))
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/login')
    }

    const simulateCall = async () => {
        const { error } = await supabase.from('calls').insert({
            caller_number: '+1 (555) 019-' + Math.floor(Math.random() * 1000),
            status: 'New',
            lead_score: Math.floor(Math.random() * 100),
            summary: 'Test Call: Client asking about HVAC maintenance prices.',
            recording_url: null,
            call_id: 'test_' + Date.now()
        })

        if (error) {
            console.error('Error simulating call:', error)
            alert('Failed to insert test call. Check console. Is RLS enabling inserts?')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Recent Inbound Calls</h2>
                    <p className="text-sm text-slate-500">Monitoring all incoming leads.</p>
                </div>

                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={simulateCall} className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                        + Demo Call
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="border-slate-200 hover:bg-slate-50">
                        Sign Out
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-700">Status</TableHead>
                            <TableHead className="font-semibold text-slate-700">Score</TableHead>
                            <TableHead className="font-semibold text-slate-700">Phone</TableHead>
                            <TableHead className="font-semibold text-slate-700">Summary</TableHead>
                            <TableHead className="font-semibold text-slate-700">Time</TableHead>
                            <TableHead className="font-semibold text-slate-700">Audio</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {calls.map((call) => (
                            <TableRow key={call.id} className="hover:bg-slate-50/50">
                                <TableCell>
                                    <Badge variant={
                                        call.status === 'Urgent' ? 'destructive' :
                                            call.status === 'Qualified' ? 'default' : 'secondary'
                                    }>
                                        {call.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium w-6">{call.lead_score}</span>
                                        <Progress value={call.lead_score || 0} className="w-16 h-2 bg-slate-100" />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-slate-900">{call.caller_number}</TableCell>
                                <TableCell className="max-w-md truncate text-slate-500" title={call.summary || ""}>
                                    {call.summary || "Processing..."}
                                </TableCell>
                                <TableCell className="text-slate-500 whitespace-nowrap text-sm">
                                    {formatDistanceToNow(new Date(call.created_at), { addSuffix: true })}
                                </TableCell>
                                <TableCell>
                                    {call.recording_url ? (
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-primary" onClick={() => window.open(call.recording_url || "", "_blank")}>
                                            <Play className="h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <span className="text-xs text-slate-400">...</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {calls.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-slate-400">
                                    No calls yet. Waiting for Isabelle...
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

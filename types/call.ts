export interface CallLog {
    id?: number
    call_id: string
    caller_number: string
    transcript: string | null
    created_at: string
    status: 'New' | 'Viewing' | 'Qualified' | 'Urgent'
    summary?: string
    lead_score?: number
    duration_seconds?: number
    cost?: number
    sentiment?: string
    disconnection_reason?: string
}

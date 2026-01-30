export interface Call {
    id: number
    created_at: string
    call_id: string | null
    caller_number: string | null
    transcript: string | null
    summary: string | null
    lead_score: number | null
    status: 'New' | 'Urgent' | 'Qualified' | 'Spam'
    recording_url: string | null
}

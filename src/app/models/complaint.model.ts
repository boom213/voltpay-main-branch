export interface ComplaintModel { complaint_id: string; user_id: number; type: string; status: 'Open' | 'Resolved' | 'In Progress'; description?: string; }

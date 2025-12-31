
export interface Email {
  id: string;
  sender: string;
  subject: string;
  content: string;
  category: 'URGENT' | 'ACTION' | 'FYI' | 'IGNORE';
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; 
  end: string;
  hasAgenda: boolean;
  type: 'meeting' | 'work' | 'buffer';
}

export interface Task {
  id: string;
  name: string;
  dueDate: string;
  percentComplete: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'overdue' | 'at-risk' | 'on-track' | 'completed';
}

// NEW: Procurement Specific Types
export interface Quote {
  id: string;
  vendorName: string;
  itemName: string;
  status: 'received' | 'pending' | 'declined' | 'negotiating';
  value?: string;
  lastUpdate: string;
}

export interface Risk {
  id: string;
  type: 'overload' | 'missing-prep' | 'email-backlog' | 'task-risk' | 'quote-delay';
  title: string;
  impact: string;
  action: string;
  severity: 'high' | 'medium' | 'low';
}

export interface TimeBlock {
  id: string;
  timeRange: string;
  activity: string;
  notes?: string[];
  type: 'focus' | 'meeting' | 'email' | 'buffer' | 'work';
  alert?: string;
}

export interface Action {
  id: string;
  type: 'reply' | 'reschedule' | 'find-info' | 'task' | 'follow-up' | 'sync-db';
  title: string;
  draftOrDetail: string;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'skipped' | 'completed';
}

export interface Brief {
  glance: string[];
  risks: Risk[];
  plan: TimeBlock[];
  actions: Action[];
  reasoning: string[];
}

export interface HistoryEntry {
  id: string;
  date: string;
  vendor: string;
  product: string;
  price: string;
  status: 'completed' | 'negotiated' | 'cancelled';
  notes: string;
}

export interface UserPreferences {
  focusHoursStart: number;
  focusHoursEnd: number;
  maxMeetingsHours: number;
  theme: 'dark' | 'light';
}

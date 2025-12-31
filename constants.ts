
import { Email, CalendarEvent, Task, Brief, Quote, HistoryEntry } from './types';

export const DEMO_EMAILS: Email[] = [
  {
    id: 'e1',
    sender: 'sales@siemens.com',
    subject: 'Re: RFQ-2024-88 (Hydraulic Pumps)',
    content: 'We regret to inform you that we cannot quote for this specific spec. Declined.',
    category: 'URGENT'
  },
  {
    id: 'e2',
    sender: 'david@abb.com',
    subject: 'Quotation Submission: Project Alpha',
    content: 'Attached is our commercial offer. Lead time is 14 weeks. Please review.',
    category: 'ACTION'
  },
  {
    id: 'e3',
    sender: 'logistics@shipping.com',
    subject: 'Shipment Delayed - PO #4402',
    content: 'Customs clearance is taking longer than expected. ETA pushed +3 days.',
    category: 'URGENT'
  },
  {
    id: 'e4',
    sender: 'sales@fairviewmicrowave.com',
    subject: 'Quote: 2.92mm Connectors',
    content: 'Please find attached the quote for 2.92mm Female Field Receptacle Connectors as requested.',
    category: 'ACTION'
  }
];

export const DEMO_CALENDAR: CalendarEvent[] = [
  { id: 'c1', title: 'Vendor Negotiation: Schneider', start: '09:00', end: '10:00', hasAgenda: true, type: 'meeting' },
  { id: 'c2', title: 'Internal Spec Review', start: '10:00', end: '11:30', hasAgenda: true, type: 'work' },
  { id: 'c3', title: 'Site Visit: Warehouse', start: '13:00', end: '14:30', hasAgenda: false, type: 'meeting' },
  { id: 'c4', title: 'Procurement Team Standup', start: '16:00', end: '16:30', hasAgenda: true, type: 'meeting' }
];

export const DEMO_TASKS: Task[] = [
  { id: 't1', name: 'Compare Pump Quotes (3 Vendors)', dueDate: 'TODAY 4pm', percentComplete: 20, priority: 'critical', status: 'at-risk' },
  { id: 't2', name: 'Release PO for Steel', dueDate: 'Tomorrow', percentComplete: 80, priority: 'high', status: 'on-track' },
  { id: 't3', name: 'Update Vendor Database', dueDate: 'Friday', percentComplete: 0, priority: 'low', status: 'on-track' },
  { id: 't4', name: 'Source 2.92mm Connectors', dueDate: 'Next Week', percentComplete: 10, priority: 'medium', status: 'on-track' }
];

export const DEMO_QUOTES: Quote[] = [
  // Existing
  { id: 'q1', vendorName: 'Siemens', itemName: 'Hydraulic Pumps', status: 'declined', lastUpdate: '10 mins ago' },
  { id: 'q2', vendorName: 'ABB', itemName: 'Control Panels', status: 'received', value: '$45,000', lastUpdate: '1 hour ago' },
  { id: 'q3', vendorName: 'Schneider', itemName: 'Switchgears', status: 'negotiating', value: '$48,500', lastUpdate: 'Yesterday' },
  { id: 'q4', vendorName: 'Local Steel Co', itemName: 'Raw Material Batch', status: 'pending', lastUpdate: '3 days ago' },
  
  // New from Spreadsheet (2.92mm Female Field Receptacle Connector)
  { id: 'q5', vendorName: 'Molex', itemName: '2.92mm Female Receptacle', status: 'pending', lastUpdate: 'Just now', value: 'info@spectra.in' },
  { id: 'q6', vendorName: 'Samtech', itemName: '2.92mm Female Receptacle', status: 'pending', lastUpdate: 'Just now', value: 'asg@samtec.com' },
  { id: 'q7', vendorName: 'Würth Elektronik', itemName: '2.92mm Female Receptacle', status: 'received', lastUpdate: '2 hours ago', value: '$12.50 / unit' },
  { id: 'q8', vendorName: 'SWINGTEL COMM.', itemName: '2.92mm Female Receptacle', status: 'pending', lastUpdate: 'Yesterday', value: 'info@swingtel.com' },
  { id: 'q9', vendorName: 'SM Electronic Tech', itemName: '2.92mm Female Receptacle', status: 'declined', lastUpdate: 'Today' },
  { id: 'q10', vendorName: 'Pomona Electronics', itemName: '2.92mm Female Receptacle', status: 'negotiating', lastUpdate: '1 day ago', value: 'info.asean@fluke.com' },
  { id: 'q11', vendorName: 'Pamir Electronics', itemName: '2.92mm Female Receptacle', status: 'pending', lastUpdate: 'Just now', value: 'marketing@pamir.com' },
  { id: 'q12', vendorName: 'Delta', itemName: '2.92mm Female Receptacle', status: 'received', lastUpdate: '4 hours ago', value: 'mkt-serv@deltaww.com' },
  { id: 'q13', vendorName: 'Fairview Microwave', itemName: '2.92mm Female Receptacle', status: 'received', lastUpdate: 'Just now', value: 'See Email' },
];

export const DEMO_HISTORY: HistoryEntry[] = [
  { id: 'h1', date: '2023-11-15', vendor: 'Bosch Rexroth', product: 'Hydraulic Pumps', price: '$12,500', status: 'completed', notes: 'PO #4401 - On time' },
  { id: 'h2', date: '2023-10-22', vendor: 'Local Steel Co', product: 'Raw Material Batch', price: '$8,200', status: 'completed', notes: 'Quality verified' },
  { id: 'h3', date: '2023-09-10', vendor: 'Siemens', product: 'Control Panels', price: '$42,000', status: 'negotiated', notes: 'Saved 5% via bulk' },
  { id: 'h4', date: '2023-08-05', vendor: 'Danfoss', product: 'Hydraulic Pumps', price: '$13,100', status: 'cancelled', notes: 'Lead time too long' },
  { id: 'h5', date: '2023-12-01', vendor: 'Schneider', product: 'Switchgears', price: '$47,000', status: 'completed', notes: 'Yearly contract' },
];

// Pre-calculated brief for demo purposes
export const DEMO_BRIEF: Brief = {
  glance: [
    '3 RFQs active: 1 Declined (Siemens), 1 Received, 1 Pending',
    'Critical delay warning: Shipment PO #4402 stuck in customs',
    'Negotiation with Schneider at 9:00 AM requires preparation',
    'New Vendors added for 2.92mm Connectors (Molex, Samtech, etc.)'
  ],
  risks: [
    {
      id: 'r1',
      type: 'quote-delay',
      title: 'VENDOR DECLINE',
      impact: 'Siemens declined Pump RFQ. Need alternate vendor ASAP.',
      action: 'Source 2 new vendors for hydraulic pumps',
      severity: 'high'
    },
    {
      id: 'r2',
      type: 'overload',
      title: 'CUSTOMS DELAY',
      impact: 'PO #4402 delayed 3 days. Production line risk.',
      action: 'Notify Project Manager & Expedite Logistics',
      severity: 'high'
    },
    {
      id: 'r3',
      type: 'missing-prep',
      title: 'MISSING DOCS',
      impact: 'Warehouse visit (1pm) has no inspection checklist.',
      action: 'Print checklist before leaving',
      severity: 'medium'
    }
  ],
  plan: [
    { id: 'p1', timeRange: '08:00-09:00', activity: 'QUOTE ANALYSIS', type: 'focus', notes: ['Review ABB offer', 'Find alternate for Siemens'] },
    { id: 'p2', timeRange: '09:00-10:00', activity: 'NEGOTIATION: SCHNEIDER', type: 'meeting', notes: ['Target: $46,000', 'Terms: 60 days'] },
    { id: 'p3', timeRange: '10:00-11:30', activity: 'INTERNAL SPEC REVIEW', type: 'work', notes: ['Engineering alignment'] },
    { id: 'p4', timeRange: '13:00-14:30', activity: 'SITE VISIT', type: 'meeting', alert: 'CHECKLIST NEEDED' },
    { id: 'p5', timeRange: '15:00-16:00', activity: 'VENDOR FOLLOW-UPS', type: 'email', notes: ['Call Local Steel Co', 'Email Molex/Samtech'] },
    { id: 'p6', timeRange: '16:00-16:30', activity: 'TEAM STANDUP', type: 'meeting' }
  ],
  actions: [
    {
      id: 'a1',
      type: 'find-info',
      title: 'Source New Pump Vendor',
      draftOrDetail: 'Siemens declined. Search approved vendor list for "Hydraulic Pumps".',
      reason: 'Critical path item. Need 3 quotes by Friday.',
      confidence: 'high',
      status: 'pending'
    },
    {
      id: 'a2',
      type: 'reply',
      title: 'Follow-up Local Steel Co',
      draftOrDetail: 'Draft: "Hi, we are still waiting for your quote on the Raw Material Batch. Deadline was yesterday."',
      reason: 'Pending for 3 days. Production needs cost est.',
      confidence: 'high',
      status: 'pending'
    },
    {
      id: 'a3',
      type: 'reschedule',
      title: 'Notify PM of Delay',
      draftOrDetail: 'Email Project Manager: "PO #4402 delayed at customs. +3 days ETA."',
      reason: 'Impacts production schedule.',
      confidence: 'medium',
      status: 'pending'
    },
    {
        id: 'a4',
        type: 'task',
        title: 'Review Connector Quotes',
        draftOrDetail: 'Review received quotes from Würth and Fairview for 2.92mm Connectors.',
        reason: 'New quotes arrived.',
        confidence: 'high',
        status: 'pending'
    }
  ],
  reasoning: [
    'URGENT RFQ ISSUE: Siemens declined, creating a sourcing gap.',
    'LOGISTICS RISK: Customs delay needs immediate stakeholder notification.',
    'NEGOTIATION PREP: Schneider meeting is high value ($48k).',
    'NEW DATA: Added 9 potential vendors for 2.92mm Connectors.'
  ]
};

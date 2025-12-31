import { useState, useCallback, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Email, CalendarEvent, Task, Quote, Brief, Action } from '../types';
import { DEMO_EMAILS, DEMO_CALENDAR, DEMO_TASKS, DEMO_QUOTES, DEMO_BRIEF } from '../constants';

interface DataProcessorResult {
  isProcessing: boolean;
  processData: (type: string, payload: any) => Promise<void>;
  emails: Email[];
  calendar: CalendarEvent[];
  tasks: Task[];
  quotes: Quote[];
  brief: Brief | null;
  aiResponse: string | null;
  apiKey: string;
  setApiKey: (key: string) => void;
  validateKey: (key: string) => Promise<boolean>;
  updateActionStatus: (id: string, status: 'approved' | 'skipped') => void;
  approvalStats: { count: number; total: number };
}

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const useDataProcessor = (): DataProcessorResult => {
  // Initialize with env var if available (Permanent Key)
  const [apiKey, setApiKey] = useState<string>(process.env.API_KEY || '');
  
  const [emails, setEmails] = useState<Email[]>(DEMO_EMAILS);
  const [calendar, setCalendar] = useState<CalendarEvent[]>(DEMO_CALENDAR);
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);
  const [quotes, setQuotes] = useState<Quote[]>(DEMO_QUOTES);
  const [brief, setBrief] = useState<Brief | null>(DEMO_BRIEF);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  
  // Chat history state to maintain context
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Rate Limiting Ref
  const lastCallTimeRef = useRef<number>(0);
  const RATE_LIMIT_MS = 3000; // 3 seconds between calls to prevent spam/cost

  const validateKey = useCallback(async (key: string): Promise<boolean> => {
    try {
      if (!key) return false;
      const ai = new GoogleGenAI({ apiKey: key });
      await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: { parts: [{ text: 'ping' }] }
      });
      return true;
    } catch (e) {
      console.error("API Key Validation Failed", e);
      return false;
    }
  }, []);

  const processData = useCallback(async (type: string, payload: any) => {
    // 1. Rate Limit Check
    const now = Date.now();
    if (now - lastCallTimeRef.current < RATE_LIMIT_MS) {
        setAiResponse("Please wait a moment before sending another request.");
        return;
    }
    lastCallTimeRef.current = now;

    setIsProcessing(true);
    setAiResponse(null);

    // If no API key, use legacy/fallback parser
    if (!apiKey) {
       setTimeout(() => {
         const legacyResponse = processInputLegacy(payload);
         setAiResponse(legacyResponse.response);
         setIsProcessing(false);
       }, 800);
       return;
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        
        // Contextualize the data for the AI so it knows about specific vendors/items
        const quoteSummary = quotes.map(q => `${q.vendorName} (${q.itemName}): ${q.status}`).join(', ');
        const emailSummary = emails.map(e => `From ${e.sender}: ${e.subject}`).join(', ');
        const taskSummary = tasks.map(t => `${t.name} (Due: ${t.dueDate}, Status: ${t.status})`).join(', ');
        
        const systemInstruction = `You are a Personal COO Assistant for a procurement professional.
        Current Data Context:
        - Emails: ${emailSummary}
        - Quotes: ${quoteSummary}
        - Calendar: ${calendar.length} events
        - Tasks: ${taskSummary}

        Instructions:
        1. Answer questions based on the Current Data Context. If the user refers to "they" or "it", use the conversation history to resolve the reference.
        2. If the user asks about vendors, products, or status (e.g. "who supplies connectors?"), use the Quotes context to provide specific vendor names.
        3. If the user input implies updating the plan, risks, or actions (e.g., "generate brief", "update plan"), return a JSON object with a "brief" property containing the full Brief object structure.
        4. If the user input is a conversational question or command (e.g., "hello", "who declined?"), return a JSON object with a "response" property containing the text answer.
        
        Always return JSON.
        `;

        const userMessage = { role: 'user' as const, parts: [{ text: `User Input: ${payload}` }] };

        // 2. Token Optimization: Limit history to last 6 turns (12 messages)
        const recentHistory = chatHistory.slice(-12);

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: [...recentHistory, userMessage],
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json'
            }
        });
        
        const text = response.text;
        
        if (text) {
             let responseText = "";
             try {
                const data = JSON.parse(text);
                
                if (data.brief) {
                    setBrief(prev => ({ ...prev, ...data.brief }));
                    responseText = data.response || "I've updated your daily brief based on the latest analysis.";
                } else if (data.response) {
                    responseText = data.response;
                } else {
                    responseText = "I processed that but didn't have a specific update.";
                }
                setAiResponse(responseText);
             } catch (e) {
                 responseText = text;
                 setAiResponse(text);
             }

             // Update history
             setChatHistory(prev => {
                const newHistory = [
                    ...prev, 
                    userMessage, 
                    { role: 'model' as const, parts: [{ text: text }] }
                ];
                // Keep only last 20 messages globally to prevent memory leaks/bloat
                return newHistory.slice(-20);
             });
        } else {
             setAiResponse("No response generated.");
        }

    } catch (error) {
        console.error("Gemini processing error:", error);
        setAiResponse("I encountered an error processing that request with the AI engine.");
    } finally {
        setIsProcessing(false);
    }
  }, [apiKey, emails, calendar, tasks, quotes, chatHistory]);

  const updateActionStatus = useCallback((id: string, status: 'approved' | 'skipped') => {
    if (!brief) return;
    const newActions = brief.actions.map(a => 
        a.id === id ? { ...a, status } : a
    );
    setBrief({ ...brief, actions: newActions });
  }, [brief]);

  const approvalStats = {
      count: brief?.actions.filter(a => a.status === 'approved').length || 0,
      total: brief?.actions.length || 0
  };

  return {
    isProcessing,
    processData,
    emails,
    calendar,
    tasks,
    quotes,
    brief,
    aiResponse,
    apiKey,
    setApiKey,
    validateKey,
    updateActionStatus,
    approvalStats
  };
};

// --- LEGACY PARSER (Fallback) ---
const processInputLegacy = (text: string): any => {
  const lower = text.toLowerCase();
  
  // 1. Actions first (Priority over greetings)
  if (lower.match(/(who|which vendor) (declined|refused|said no)/i)) {
    return {
      action: 'NONE',
      response: "Siemens declined the Hydraulic Pump RFQ. They can't meet the spec."
    };
  }
  if (lower.match(/(report|pdf|summary|month)/i)) {
    return {
      action: 'GENERATE_REPORT',
      response: "Certainly. I'm compiling the monthly performance report for you now."
    };
  }
  
  // Enhanced Demo Data Search (Connectors)
  if (lower.match(/(who|where|list|find) (supply|supplies|buy|bought|sell|vendor|quote|connect)/i)) {
    // Specific demo data case
    if (lower.includes('connector') || lower.includes('2.92')) {
        return {
            action: 'SEARCH_PRODUCT',
            response: "For 2.92mm Female Receptacle Connectors, we have identified: Molex, Samtech, Würth Elektronik, and Fairview Microwave. Check the Vendors tab for details."
        };
    }

    const product = lower.includes('pump') ? 'Hydraulic Pumps' : 
                    lower.includes('steel') ? 'Raw Material' : 'Equipment';
    return {
      action: 'SEARCH_PRODUCT',
      searchPayload: { productQuery: product },
      response: `Checking records for ${product}...`
    };
  }
  
  if (lower.match(/(sync|save|update) (database|team|target)/i)) {
    return {
      action: 'SYNC_DB',
      response: "Synchronizing today's procurement data with the central team database... Done."
    };
  }

  // 2. Greetings (if no action matched)
  if (lower.match(/(hello|hi|hey|greetings|morning|afternoon|evening|darling)/i)) {
    return {
      action: 'NONE',
      response: "Good morning, Engineer. I am online and ready to assist with your procurement tasks."
    };
  }

  // 3. Fallback - More helpful for demo purposes
  return {
    action: 'NONE',
    response: "I'm listening. Try asking 'Who supplies 2.92mm connectors?' or 'Who declined quotes?'"
  };
};
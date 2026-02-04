# System Architecture & Code Walkthrough (Viva Preparation)

## 1. Core Technology
*   **Frontend**: Next.js 16 (React Framework) - *Why? Security, SEO, Vercel native.*
*   **Database**: Supabase (PostgreSQL) - *Why? Real-time subscriptions for the dashboard.*
*   **Voice AI**: Retell AI - *Why? Latency < 800ms, best-in-class conversation flow.*
*   **Automation**: N8N - *Why? Decouples business logic (CRM sync) from the app code.*

## 2. Key Code Files & Responsibilities

### **A. Voice Connection (The "Brain")**
*   **File:** `hooks/use-retell.ts`
*   **Location:** `d:\PRESTIGE\prestigevoice\hooks\use-retell.ts`
*   **What it does:**
    *   Manages the WebSocket connection to Retell.
    *   Handles Microphone permissions.
    *   **Logic:** `toggleCall()` fetches a token, then `retellClient.startCall()`.
    *   **Trick:** It adds a "ping" to keep the AudioContext alive on Chrome.

### **B. Authentication Security (The "Bouncer")**
*   **File:** `app/api/voice-token-v2/route.ts`
*   **Location:** `d:\PRESTIGE\prestigevoice\app\api\voice-token-v2\route.ts`
*   **What it does:**
    *   Generates ephemeral keys for "Isabelle".
    *   **Security:** Uses `POST` method + `no-store` headers to prevent "Ghost Calls" (caching old keys).
    *   **Validation:** Trims whitespace from API keys (`process.env.RETELL_API_KEY.trim()`).

### **C. The Dashboard (The "Eyes")**
*   **File:** `components/dashboard/call-table.tsx`
*   **Location:** `d:\PRESTIGE\prestigevoice\components\dashboard\call-table.tsx`
*   **What it does:**
    *    displays the list of calls.
    *   **Cool Tech:** Uses `supabase.channel().on('postgres_changes')` to auto-update the table WITHOUT refreshing the page when a new call comes in.

### **D. Data Flow (The "Pipeline")**
*   **Workflow:** `workflows/n8n_retell_supabase.json`
*   **Path:** Call Ends -> Retell Webhook -> N8N -> Supabase Table (`calls`).
*   **Why Not Direct?** We use N8N so we can easily add Pipedrive/Slack later without touching the React code.

## 3. Common "Viva" Questions & Answers

### Q1: "Where do you add functions for Retell?"
**Script:**
> "Sir, function calling is configured directly in the **Retell Cloud Dashboard**, not in the local code. This allows the AI model to be updated without redeploying the application.
> I have defined the JSON Schemas (like `extract_lead_info`) in my documentation file `documents/RETELL_ADVANCED_SETUP.md`. I copy these definitions into the Retell 'LLM' settings."

### Q2: "Where is the Supabase code located?"
**Script:**
> "The database logic is organized into three layers for clean architecture:
> 1. **Configuration:** `lib/supabase.ts` initializes the connection using environment variables.
> 2. **Service Layer:** `services/db-service.ts` contains the actual SQL queries (like selecting calls). This isolates raw data access from the UI.
> 3. **Real-time Hooks:** `hooks/use-calls.ts` manages the live data subscriptions for the frontend."

### Q3: "What kind of Login did you implement and where is it?"
**Script:**
> "I implemented **Supabase Authentication** using Email and Password. It is secured via Server-Side Middleware.
> *   **The UI:** is in `app/login/page.tsx` (using Shadcn UI components).
> *   **The Logic:** is handled by Next.js Server Actions in `app/login/actions.ts` which calls `supabase.auth.signInWithPassword`.
> *   **The Security:** is enforced in `middleware.ts`. It intercepts every request to `/dashboard` and redirects unauthenticated users back to login instantly."

### Q4: "Why does the Dashboard update instantly?"
**Script:**
> "I leveraged **Supabase Realtime**. The client opens a WebSocket connection to the database. When N8N inserts a new call record, the database pushes an event to the browser immediately. This avoids the need for the user to refresh the page."

---

## 4. Retell Configuration Appendix (Reference)

### A. Function Calling Schema (`extract_lead_info`)
Paste this JSON into the **Retell Dashboard -> Agent -> LLM -> Tools**:

```json
{
  "type": "object",
  "properties": {
    "customer_name": {
      "type": "string",
      "description": "The name of the customer, if provided."
    },
    "service_type": {
      "type": "string",
      "enum": ["Heat Pump", "Furnace", "AC", "Windows", "Maintenance", "Other"],
      "description": "The type of service the customer is interested in."
    },
    "budget_range": {
      "type": "string",
      "description": "The customer's estimated budget or price sensitivity."
    },
    "urgency": {
      "type": "string",
      "enum": ["High", "Medium", "Low"],
      "description": "How urgent the request is (e.g., 'no heat' is High)."
    }
  },
  "required": ["service_type"]
}
```

### B. System Prompt Addition
> "You have a tool called 'extract_lead_info'. ALWAYS call this tool when the user mentions their name, the service they need, or their budget. Do not ask for all fields at once, but extract them as they come up naturally."



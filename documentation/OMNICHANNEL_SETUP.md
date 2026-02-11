# SMS & Voice - Omnichannel Setup

Your project now uses a **Unified N8N Workflow** (`n8n_unified_omnichannel.json`).
This handles **BOTH** incoming calls (after they end) and incoming SMS texts in one dashboard.

## 1. How to Import
1.  Open N8N.
2.  Click **Workflow** -> **Import from File**.
3.  Select `prestigevoice/workflows/n8n_unified_omnichannel.json`.

## 2. The Logic Flow
The workflow has two parallel "Swimlanes":

### **Lane 1: Voice (Retell)**
*   **Trigger:** `Retell Webhook` (When a call ends).
*   **Action:**
    1.  Calculates Lead Score (using `process-voice` script).
    2.  Inserts row into Supabase `calls` table.
    3.  Pushed to Dashboard (Real-time).

### **Lane 2: SMS (Twilio)**
*   **Trigger:** `Twilio Trigger` (When SMS received).
*   **Action:**
    1.  Sends text to `OpenAI Agent`.
    2.  **System Prompt:** Uses the EXACT SAME logic as voice (Isabelle).
    3.  Sends reply back via `Twilio Send`.

## 3. Configuration Needed
After importing, you must double-click the nodes to set your credentials:
*   **Twilio Trigger:** Select your Twilio Credential.
*   **OpenAI Agent:** Select your OpenAI API Key.
*   **Supabase:** Select your Supabase Credential.

# N8N Unified Configuration Guide (Voice + SMS)

Follow these exact steps to make the single workflow handle EVERYTHING.

## Step 1: Import the Clean Workflow (V2)
1.  In N8N, click the top-right menu (three dots) -> **Import from File**.
2.  Upload `prestigevoice/workflows/n8n_unified_omnichannel_v2.json`.
3.  *Result:* You should see a clean 2-branch design (Top: Voice, Bottom: SMS).

## Step 2: Configure Credentials (The Red Triangles)
Double-click each node with a red triangle to fix it.

### A. Top Branch (Voice)
1.  **Retell Webhook (Node):**
    *   Authentication: None (usually fine) or Header Auth.
    *   **Action:** Copy the "Production URL" (e.g., `https://n8n.../webhook/voice-webhook`).
    *   **Go to:** Retell Dashboard -> Agents -> Your Agent -> Webhook. **Paste this URL.**
2.  **Save to Supabase (Node):**
    *   Credential: Select your `Supabase account`.
    *   Table: ensure it says `calls`.

### B. Bottom Branch (SMS)
1.  **Twilio Trigger (Node):**
    *   Credential: Select your `Twilio account`.
    *   **Action:** Copy the "Production URL" (e.g., `https://n8n.../webhook/message-received`).
    *   **Go to:** Twilio Console -> Phone Numbers -> Active Numbers -> Click your number.
    *   Scroll to **Messaging** -> **A Message Comes In** -> Webhook. **Paste this URL.**
2.  **Isabelle AI (OpenAI Node):**
    *   Credential: Select your `OpenAI account`.
    *   Model: `gpt-4` or `gpt-3.5-turbo`.
3.  **Send SMS Reply (Twilio Node):**
    *   Credential: Select `Twilio account`.
    *   From: Type your Twilio Number (`+18707298115`).

## Step 3: Activate
1.  Click **Save**.
2.  Toggle the "Active" switch to **ON** (Green).

## Step 4: Test It
1.  **Voice:** Make a test call to your Retell number. Hang up. -> Check N8N "Executions". It should pass.
2.  **SMS:** Text "Hello" to your Twilio number from your cell phone. -> You should get a reply from Isabelle.

**Done!** One workflow rules them all.

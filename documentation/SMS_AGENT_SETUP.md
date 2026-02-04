# SMS Agent Implementation Guide (Twilio + OpenAI + N8N)

Since the "Final Tech Document" states the **SMS Agent** must strictly follow the **Voice Agent** logic, we will build a clone using N8N.

## 1. Prerequisites
*   **Twilio Number:** +1 (870) 729-8115 (Active)
*   **OpenAI API Key:** (Required for N8N "OpenAI" Node)
*   **N8N Workflow:** You need to create a **NEW** workflow in N8N.

---

## 2. N8N Workflow Structure
**Name:** `Confort Prestige - SMS Agent`
**Trigger:** `Twilio Trigger` (On Message Received)

### **The Flow:**
1.  **Twilio Trigger:** Receives the SMS (`{{$json.Body}}`, `{{$json.From}}`).
2.  **Supabase Select:** Check if `caller_number` exists in a `conversations` table to get his "Thread ID".
    *   *If New:* Create new Thread.
    *   *If Existing:* Retrieve Thread ID.
3.  **OpenAI Assistant (Node):**
    *   **Prompt:** Paste the **EXACT** content from `documents/ISABELLE_FINAL_SYSTEM_PROMPT.md`.
    *   **User Message:** `{{$json.Body}}` (The SMS content).
4.  **Send SMS (Twilio Node):**
    *   **To:** `{{$json.From}}`
    *   **From:** `+18707298115`
    *   **Message:** `{{$json.output.text}}` (The AI's response).

---

## 3. Important Configuration Logic

### **Constraint 1: The "Opening Message"**
The logic says the agent must start with *"Hello, this is Isabelle..."*.
*   **SMS Context:** Since the USER usually starts the SMS conversation (e.g. from an ad), the AI will reply to *their* first message.
*   **System Prompt instruction:** "If this is the first message, ignore their text and send the mandatory opening: 'Hello, this is Isabelle...'"

### **Constraint 2: "2-Minute" Consent**
The OpenAI model will naturally follow your prompt instructions (`ISABELLE_FINAL_SYSTEM_PROMPT.md`) to ask for consent ("It will take about two minutes. Is that okay?").
*   **Action:** No special code needed. The Prompt enforces this.

### **Constraint 3: Sending "Email" instructions**
If the user fails qualification (Repair/Outside Area), the prompt says: *"Please send us an email..."*.
*   **Action:** Ensure the Twilio Node sends this final text correctly.

---

## 4. How to Activate
1.  Go to **N8N**.
2.  Create the workflow described above.
3.  Copy the `ISABELLE_FINAL_SYSTEM_PROMPT.md` text into the OpenAI System Message field.
4.  **Activate** the workflow.
5.  Text your Twilio number to test!

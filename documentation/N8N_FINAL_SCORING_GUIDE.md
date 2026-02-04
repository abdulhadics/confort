# N8N Logic - Final Scoring Implementation

## Database Update Required
The `calls` table in Supabase needs new columns to store the data points defined in the Final Tech Document.

### SQL to Run:
```sql
ALTER TABLE calls 
ADD COLUMN IF NOT EXISTS service_branch TEXT, -- 'HVAC' or 'PF' (Portes & Fenêtres)
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS is_owner BOOLEAN,
ADD COLUMN IF NOT EXISTS timeframe TEXT, -- '<1 month', '1-3 months', '>3 months'
ADD COLUMN IF NOT EXISTS budget_confirmed BOOLEAN, -- True if they said 'Yes' to price anchor
ADD COLUMN IF NOT EXISTS nb_openings INT; -- For P&F
```

## Logic for N8N "Code" Node

### HVAC Scoring Formula
```javascript
let score = 0;

// 1. City (Service Area)
// (Assumed valid if call reached this stage, otherwise filtered by Agent)
score += 25; 

// 2. Budget Validation
if (budget_response === "Yes") score += 30;
else if (budget_response === "Maybe/More or less") score += 15;
else score += 0;

// 3. Owner
if (is_owner === true) score += 25;

// 4. Timing
if (timeframe === "< 1 month") score += 20;
else if (timeframe === "1-3 months") score += 12;
else if (timeframe === "> 3 months") score += 5;
else score += 0; // Info only

// Max Score: 100
```

### Doors & Windows (P&F) Scoring Formula
```javascript
let score = 0;

// 1. City
score += 25;

// 2. Quantity (Openings)
if (nb_openings >= 7) score += 25;
else if (nb_openings >= 4) score += 15;
else score += 5;

// 3. Owner
if (is_owner === true) score += 25;

// 4. Timing
if (timeframe === "< 1 month") score += 25; // Note: P&F timing scoring is slightly different in spec? Checked: "Same scoring as French version" -> implies same as HVAC? Spec says "+25 / +15 / +5".
else if (timeframe === "1-3 months") score += 15;
else if (timeframe === "> 3 months") score += 5;
```

### Classification
- **Green (Gold):** 70 - 100
- **Yellow (Medium):** 40 - 69
- **Red (Low):** 0 - 39

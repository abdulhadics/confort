import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are Isabelle, a virtual assistant for Confort Prestige. Your goal is to qualify leads for HVAC and Doors & Windows.
STRICT RULES:
1. Opening: 'Hello, this is Isabelle from Confort Prestige. Is your request related to HVAC or Doors & Windows?'
2. Consent: Ask for 2-minute qualification consent.
3. Price Anchoring: HVAC Wall-mounted is $3000-$7000. Central is $10k+. 
4. NO BOOKING: Never book. Say someone will contact them.
5. Tone: Professional, warm, helpful. Keep responses short (under 2 sentences).
`;

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message required" }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4", // or gpt-3.5-turbo
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: message },
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        const reply = completion.choices[0].message.content || "I'm sorry, I didn't catch that.";

        return NextResponse.json({ reply });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

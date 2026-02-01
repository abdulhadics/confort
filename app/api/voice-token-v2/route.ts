import { NextResponse } from "next/server"
import Retell from "retell-sdk"

export const dynamic = "force-dynamic" // Prevent caching of the token
export const runtime = "nodejs" // Ensure robust crypto availability

const retell = new Retell({
    apiKey: process.env.RETELL_API_KEY || "key_placeholder",
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { agent_id } = body

        if (!agent_id) {
            return NextResponse.json(
                { error: "Missing agent_id in request body" },
                { status: 400 }
            )
        }

        const registerCallResponse = await retell.call.createWebCall({
            agent_id: agent_id,
        })

        return NextResponse.json(registerCallResponse, {
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
            }
        })
    } catch (error) {
        console.error("Error registering call:", error)
        return NextResponse.json(
            { error: "Failed to register call" },
            { status: 500 }
        )
    }
}

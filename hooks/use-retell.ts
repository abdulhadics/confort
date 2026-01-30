"use client"

import { useEffect, useRef, useState } from "react"
import { RetellWebClient } from "retell-client-js-sdk"

const agentId = "YOUR_AGENT_ID_HERE" // TODO: Replace with env var or client asset

export function useRetell() {
    const [isCalling, setIsCalling] = useState(false)
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false)
    const retellWebClient = useRef<RetellWebClient | null>(null)

    useEffect(() => {
        // Initialize client on mount
        retellWebClient.current = new RetellWebClient()

        // Event Listeners
        retellWebClient.current.on("call_started", () => {
            console.log("Call started")
            setIsCalling(true)
        })

        retellWebClient.current.on("call_ended", () => {
            console.log("Call ended")
            setIsCalling(false)
            setIsAgentSpeaking(false)
        })

        retellWebClient.current.on("agent_start_talking", () => {
            setIsAgentSpeaking(true)
        })

        retellWebClient.current.on("agent_stop_talking", () => {
            setIsAgentSpeaking(false)
        })

        retellWebClient.current.on("error", (error) => {
            console.error("Retell Error:", error)
            setIsCalling(false)
        })

        return () => {
            if (retellWebClient.current) {
                retellWebClient.current.stopCall()
            }
        }
    }, [])

    const toggleCall = async () => {
        if (isCalling) {
            retellWebClient.current?.stopCall()
        } else {
            try {
                // 1. Get Access Token from our secure backend
                // For local demo without backend, we might need a direct call or a simple mock
                const response = await fetch("/api/register-call")
                const data = await response.json()

                if (!data.access_token) throw new Error("No access token")

                // 2. Start Call
                await retellWebClient.current?.startCall({
                    accessToken: data.access_token,
                })
            } catch (err) {
                console.error("Failed to start call:", err)
            }
        }
    }

    return {
        isCalling,
        isAgentSpeaking,
        toggleCall,
    }
}

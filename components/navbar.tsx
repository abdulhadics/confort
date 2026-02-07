"use client"

import Link from "next/link"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRetell } from "@/hooks/use-retell"

export function Navbar() {
    const { isCalling, toggleCall, isAgentSpeaking } = useRetell()
    return (
        <nav className="border-b border-primary/10 bg-background/80 backdrop-blur-md fixed top-0 w-full z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">C</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden sm:block">Confort Prestige</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors">
                        Home
                    </Link>
                    <Link href="/dashboard/messages" className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors">
                        Messages
                    </Link>
                    <Link href="/#hvac" className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors">
                        HVAC
                    </Link>
                    <Link href="/#windows" className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors">
                        Windows
                    </Link>
                </div>

                <Button
                    onClick={toggleCall}
                    className={`gap-2 transition-all ${isCalling ? "bg-destructive hover:bg-destructive/90 animate-pulse" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}
                >
                    <Phone className="w-4 h-4" />
                    <span>
                        {isCalling
                            ? (isAgentSpeaking ? "Isabelle Speaking..." : "Listening...")
                            : "Call Isabelle"}
                    </span>
                </Button>
            </div>
        </nav>
    )
}


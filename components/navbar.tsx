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
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-foreground tracking-tight">Confort Prestige</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <Link href="#hvac" className="hover:text-primary transition-colors">HVAC</Link>
                    <Link href="#windows" className="hover:text-primary transition-colors">Windows</Link>
                    <Link href="#about" className="hover:text-primary transition-colors">About Us</Link>
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


"use client"

import Link from "next/link"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRetell } from "@/hooks/use-retell"

export function Navbar() {
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
                    <Link href="/#hvac" className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors">
                        HVAC
                    </Link>
                    <Link href="/#windows" className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors">
                        Windows
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <a href="sms:+18707298115" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                        <span>Text Us: (870) 729-8115</span>
                    </a>
                </div>
            </div>
        </nav>
    )
}


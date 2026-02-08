"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Phone } from "lucide-react"
import Link from "next/link"
import { useRetell } from "@/hooks/use-retell"

export function Hero() {
    const { isCalling, toggleCall, isAgentSpeaking } = useRetell()

    return (
        <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-primary/20 to-white">
            <div className="container mx-auto text-center max-w-4xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary-foreground text-sm font-medium mb-6">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-primary-foreground font-semibold">Serving Montreal, Laval & Longueuil</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
                    Upgrade Your Home Comfort with <span className="text-primary">Confort Prestige</span>
                </h1>

                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Premium Heat Pumps, Furnaces, and Windows.
                    Get an instant quote today from Isabelle, our AI specialist.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        size="lg"
                        onClick={toggleCall}
                        className={`h-12 px-8 text-lg w-full sm:w-auto transition-all ${isCalling ? "bg-destructive hover:bg-destructive/90 animate-pulse" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}
                    >
                        {isCalling ? (
                            <>
                                <Phone className="mr-2 w-5 h-5" />
                                {"End Voice Session"}
                            </>
                        ) : (
                            <>
                                {"Call Isabelle (Voice)"}
                                <Phone className="ml-2 w-5 h-5" />
                            </>
                        )}
                    </Button>

                    <Button size="lg" variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto text-primary border-primary hover:bg-primary/5" asChild>
                        <Link href="#services">
                            View Services
                        </Link>
                    </Button>
                </div>

                <div className="mt-4 flex justify-center">
                    <a href="sms:+18707298115" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors hover:underline underline-offset-4">
                        <span className="bg-primary/10 p-1.5 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        </span>
                        Or Text Us: (870) 729-8115
                    </a>
                </div>

                <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Available 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span>Instant Pricing</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

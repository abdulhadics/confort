import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Services />

      <footer className="bg-slate-900 py-8 text-center text-slate-400 text-sm">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Confort Prestige. All rights reserved.</p>
          <div className="mt-4">
            <a href="/login" className="hover:text-white transition-colors">
              Admin Login
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}

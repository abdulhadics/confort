"use client"

import { Wind, ThermometerSun, Maximize2, ShieldCheck } from "lucide-react"

const services = [
    {
        title: "Heat Pumps",
        description: "High-efficiency wall-mounted and central systems. Prices typically range from $3k to $7k depending on the unit.",
        icon: Wind,
        price: "$3,000 - $7,000"
    },
    {
        title: "Furnaces",
        description: "Reliable heating solutions for harsh winters. Top-tier efficiency ratings and professional installation included.",
        icon: ThermometerSun,
        price: "Custom Quote"
    },
    {
        title: "Windows & Doors",
        description: "Energy-efficient openings. We calculate quotes based on the number of openings and material selection.",
        icon: Maximize2,
        price: "Per Opening"
    }
]

export function Services() {
    return (
        <section id="services" className="py-20 px-4 bg-white">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Services</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Specializing in premium HVAC solutions and exterior renovations.
                        Quality installation guaranteed.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div key={service.title} className="group p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <service.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">{service.title}</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                {service.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                <ShieldCheck className="w-4 h-4" />
                                <span>{service.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

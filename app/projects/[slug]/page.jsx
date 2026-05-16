"use client";

import { useState } from "react";

const projects = {
  "crypto-trading-bot": {
    title: "Crypto Trading Bot",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
    description:
      "Advanced crypto trading system with AI signals, Telegram alerts, analytics dashboard and automated trading features.",
  },

  "telegram-dashboard": {
    title: "Telegram Dashboard",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200&auto=format&fit=crop",
    description:
      "Premium automation dashboard with Telegram integrations and real-time monitoring tools.",
  },

  "ecommerce-website": {
    title: "Ecommerce Website",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200&auto=format&fit=crop",
    description:
      "Modern ecommerce platform with payment systems, admin dashboard and responsive UI.",
  },

  "automation-platform": {
    title: "Automation Platform",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    description:
      "Business automation platform with API integrations and workflow systems.",
  },

  "forex-signal-bot": {
    title: "Forex Signal Bot",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
    description:
      "Forex signal automation bot with Telegram alerts and smart analytics.",
  },

  "modern-saas-ui": {
    title: "Modern SaaS UI",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    description:
      "Modern premium SaaS interface with responsive layouts and dashboard systems.",
  },
};

export default function ProjectDetails({ params }) {

  const [menuOpen, setMenuOpen] = useState(false);

  const project = projects[params.slug];

  if (!project) {
    return (
      <main className="bg-[#050816] text-white min-h-screen flex items-center justify-center">
        <h1 className="text-5xl font-black">
          Project Not Found
        </h1>
      </main>
    );
  }

  return (
    <main className="bg-[#050816] text-white min-h-screen overflow-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#050816]/90 backdrop-blur-xl border-b border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-black font-black">
              U
            </div>

            <h1 className="text-2xl font-black">
              UpNorth Tech
            </h1>

          </div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-8 text-sm text-gray-300">

            <a href="/" className="hover:text-orange-400 transition">
              Home
            </a>

            <a href="/about" className="hover:text-orange-400 transition">
              About
            </a>

            <a href="/services" className="hover:text-orange-400 transition">
              Services
            </a>

            <a href="/projects" className="text-orange-400">
              Projects
            </a>

            <a href="/blog" className="hover:text-orange-400 transition">
              Blog
            </a>

            <a href="/contact" className="hover:text-orange-400 transition">
              Contact
            </a>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            <a
              href="/request"
              className="hidden md:flex bg-orange-500 text-black px-5 py-3 rounded-xl font-bold hover:scale-105 transition"
            >
              Let's Work Together
            </a>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-2xl"
            >
              ☰
            </button>

          </div>

        </div>

        {/* MOBILE MENU */}
        {menuOpen && (

          <div className="lg:hidden border-t border-white/10 bg-[#050816] animate-in slide-in-from-top duration-300">

            <div className="flex flex-col px-6 py-6 space-y-5 text-gray-300">

              <a href="/" className="hover:text-orange-400">
                Home
              </a>

              <a href="/about" className="hover:text-orange-400">
                About
              </a>

              <a href="/services" className="hover:text-orange-400">
                Services
              </a>

              <a href="/projects" className="text-orange-400">
                Projects
              </a>

              <a href="/blog" className="hover:text-orange-400">
                Blog
              </a>

              <a href="/contact" className="hover:text-orange-400">
                Contact
              </a>

              <a
                href="/request"
                className="bg-orange-500 text-black px-5 py-4 rounded-xl font-bold text-center"
              >
                Start Project
              </a>

            </div>

          </div>

        )}

      </nav>

      {/* HERO */}
      <section className="pt-40 pb-20 px-6 border-b border-white/10 relative">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,115,0,0.15),transparent_40%)]"></div>

        <div className="max-w-6xl mx-auto relative z-10">

          <a
            href="/projects"
            className="inline-flex items-center gap-2 text-orange-400 mb-10 text-lg hover:translate-x-1 transition"
          >
            ← Back To Projects
          </a>

          <img
            src={project.image}
            className="w-full h-[500px] object-cover rounded-[40px] mb-14 border border-white/10"
          />

          <p className="text-orange-400 uppercase tracking-[5px] mb-5">
            Premium Project
          </p>

          <h1 className="text-5xl md:text-7xl font-black mb-10 leading-tight">
            {project.title}
          </h1>

          <p className="text-gray-400 text-xl md:text-2xl leading-10 max-w-4xl mb-16">
            {project.description}
          </p>

          {/* PROJECT INFO */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-orange-500 transition">
              <h3 className="text-orange-400 font-bold text-xl mb-4">
                Frontend
              </h3>

              <p className="text-gray-400 leading-8">
                Next.js, TailwindCSS, Responsive UI, Modern Components
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-orange-500 transition">
              <h3 className="text-orange-400 font-bold text-xl mb-4">
                Backend
              </h3>

              <p className="text-gray-400 leading-8">
                Node.js, Express, MongoDB, APIs & Authentication
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-orange-500 transition">
              <h3 className="text-orange-400 font-bold text-xl mb-4">
                Features
              </h3>

              <p className="text-gray-400 leading-8">
                Automation, Dashboards, Analytics, Real-Time Systems
              </p>
            </div>

          </div>

          {/* CTA */}
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-12 text-center">

            <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
              Start Your Own
            </p>

            <h2 className="text-5xl font-black mb-8">
              Need A Similar Project?
            </h2>

            <p className="text-gray-400 text-xl leading-9 max-w-3xl mx-auto mb-10">
              Let’s build a premium scalable system tailored specifically
              for your business goals and automation needs.
            </p>

            <a
              href="/request"
              className="inline-block bg-orange-500 text-black px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition"
            >
              Start Similar Project
            </a>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 px-6">

        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">

          <div>
            <h2 className="text-3xl font-black mb-4">
              UpNorth Tech
            </h2>

            <p className="text-gray-400">
              Building premium digital solutions for modern businesses.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-5">
              Quick Links
            </h3>

            <div className="space-y-3 text-gray-400">
              <p>Home</p>
              <p>About</p>
              <p>Services</p>
              <p>Projects</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-5">
              Services
            </h3>

            <div className="space-y-3 text-gray-400">
              <p>Web Development</p>
              <p>Trading Bots</p>
              <p>Telegram Bots</p>
              <p>Automation</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-5">
              Newsletter
            </h3>

            <input
              type="text"
              placeholder="Enter your email"
              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-4 mb-4"
            />

            <button className="w-full bg-orange-500 py-4 rounded-2xl text-black font-bold">
              Subscribe
            </button>
          </div>

        </div>
      </footer>
    </main>
  );
}
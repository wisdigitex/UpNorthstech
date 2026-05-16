"use client";

import { useState } from "react";

export default function ProjectsPage() {

  const [menuOpen, setMenuOpen] = useState(false);

  const projects = [
    {
      title: "Crypto Trading Bot",
      slug: "crypto-trading-bot",
      category: "Trading System",
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
    },

    {
      title: "Telegram Dashboard",
      slug: "telegram-dashboard",
      category: "Automation",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200&auto=format&fit=crop",
    },

    {
      title: "Ecommerce Website",
      slug: "ecommerce-website",
      category: "Web Development",
      image:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200&auto=format&fit=crop",
    },

    {
      title: "Automation Platform",
      slug: "automation-platform",
      category: "Business System",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    },

    {
      title: "Forex Signal Bot",
      slug: "forex-signal-bot",
      category: "Trading Bot",
      image:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
    },

    {
      title: "Modern SaaS UI",
      slug: "modern-saas-ui",
      category: "UI/UX Design",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    },
  ];

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
      <section className="pt-40 pb-24 px-6 border-b border-white/10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,115,0,0.15),transparent_40%)]"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-6">
            My Portfolio
          </p>

          <h1 className="text-7xl md:text-8xl font-black leading-tight mb-8">
            Featured Projects.
          </h1>

          <p className="text-gray-400 text-xl leading-9 max-w-4xl mx-auto mb-12">
            Explore premium websites, dashboards, trading bots and automation
            systems built for startups and businesses worldwide.
          </p>
        </div>
      </section>

      {/* FILTER BUTTONS */}
      <section className="py-16 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-5 justify-center">
          {[
            "All",
            "Web Development",
            "Trading Bots",
            "Automation",
            "Dashboards",
            "UI/UX",
          ].map((filter, index) => (
            <button
              key={index}
              className={`px-8 py-4 rounded-2xl border transition font-bold ${
                index === 0
                  ? "bg-orange-500 text-black border-orange-500"
                  : "border-white/10 text-gray-300 hover:border-orange-500 hover:text-orange-400"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* PROJECT GRID */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-[32px] border border-white/10 bg-white/5 hover:border-orange-500 transition"
              >
                <div className="overflow-hidden relative">
                  <img
                    src={project.image}
                    className="h-72 w-full object-cover group-hover:scale-110 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <a
                      href={`/projects/${project.slug}`}
                      className="bg-orange-500 text-black px-6 py-3 rounded-2xl font-black hover:scale-105 transition"
                    >
                      View Project
                    </a>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-orange-400 text-sm uppercase tracking-[4px] mb-4">
                    {project.category}
                  </p>

                  <h3 className="text-3xl font-bold mb-5 leading-tight">
                    {project.title}
                  </h3>

                  <p className="text-gray-400 leading-8 mb-6">
                    Modern scalable digital solution with premium UI design,
                    automation and optimized performance.
                  </p>

                  <a
                    href="/request"
                    className="text-orange-400 font-bold text-lg"
                  >
                    Start Similar Project →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDY */}
      <section className="py-28 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200&auto=format&fit=crop"
              className="rounded-[40px] border border-white/10"
            />
          </div>

          <div>
            <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
              Featured Case Study
            </p>

            <h2 className="text-6xl font-black leading-tight mb-8">
              Crypto Trading Dashboard.
            </h2>

            <p className="text-gray-400 text-lg leading-9 mb-10">
              A modern trading platform built with real-time analytics,
              automation systems, Telegram integrations and premium responsive
              UI/UX design.
            </p>

            <div className="grid sm:grid-cols-2 gap-5 mb-10">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <h3 className="text-orange-400 font-bold mb-3">Tech Stack</h3>
                <p className="text-gray-400">Next.js, Node.js, MongoDB</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <h3 className="text-orange-400 font-bold mb-3">Category</h3>
                <p className="text-gray-400">Trading Automation</p>
              </div>
            </div>

            <a
              href="/request"
              className="inline-block bg-orange-500 text-black px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition"
            >
              Build Similar Project
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          {[
            ["100+", "Projects Completed"],
            ["50+", "Happy Clients"],
            ["5+", "Years Experience"],
            ["24/7", "Support Available"],
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-[32px] p-10 text-center"
            >
              <h3 className="text-6xl font-black text-orange-400 mb-4">
                {stat[0]}
              </h3>

              <p className="text-gray-400 text-lg">
                {stat[1]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto text-center bg-white/5 border border-white/10 rounded-[40px] p-16">
          <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
            Start Your Project
          </p>

          <h2 className="text-6xl font-black leading-tight mb-8">
            Need A Custom Digital Product?
          </h2>

          <p className="text-gray-400 text-xl leading-9 max-w-3xl mx-auto mb-10">
            Let’s build premium systems and digital experiences tailored to your
            business goals.
          </p>

          <a
            href="/request"
            className="inline-block bg-orange-500 text-black px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition"
          >
            Request A Project
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <h2 className="text-3xl font-black mb-4">UpNorth Tech</h2>
            <p className="text-gray-400">
              Building premium digital solutions for modern businesses.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-5">Quick Links</h3>
            <div className="space-y-3 text-gray-400">
              <p>Home</p>
              <p>About</p>
              <p>Services</p>
              <p>Projects</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-5">Services</h3>
            <div className="space-y-3 text-gray-400">
              <p>Web Development</p>
              <p>Trading Bots</p>
              <p>Telegram Bots</p>
              <p>Automation</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-5">Newsletter</h3>

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

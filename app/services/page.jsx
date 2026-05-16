"use client";

import { useState } from "react";

export default function ServicesPage() {

  const [menuOpen, setMenuOpen] = useState(false);

  const services = [
    {
      title: "Web Development",
      description:
        "Modern high-performance websites built with scalable frontend and backend technologies.",
      icon: "💻",
    },
    {
      title: "Trading Bots",
      description:
        "Advanced crypto and forex trading bots with automation and smart strategies.",
      icon: "📈",
    },
    {
      title: "Telegram Bots",
      description:
        "Custom Telegram automation systems, alerts, dashboards and premium integrations.",
      icon: "🤖",
    },
    {
      title: "Web Applications",
      description:
        "Scalable SaaS platforms and business systems with modern architecture.",
      icon: "⚡",
    },
    {
      title: "UI/UX Design",
      description:
        "Premium modern user interfaces focused on conversions and user experience.",
      icon: "🎨",
    },
    {
      title: "Automation & API",
      description:
        "Workflow automation, API integrations and smart business systems.",
      icon: "🔗",
    },
  ];

  const process = [
    "Discovery & Planning",
    "UI/UX Design",
    "Development & Integration",
    "Testing & Optimization",
    "Deployment & Support",
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

            <a href="/services" className="text-orange-400">
              Services
            </a>

            <a href="/projects" className="hover:text-orange-400 transition">
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

        {/* MOBILE DROPDOWN */}
        {menuOpen && (

          <div className="lg:hidden border-t border-white/10 bg-[#050816] animate-in slide-in-from-top duration-300">

            <div className="flex flex-col px-6 py-6 space-y-5 text-gray-300">

              <a href="/" className="hover:text-orange-400">
                Home
              </a>

              <a href="/about" className="hover:text-orange-400">
                About
              </a>

              <a href="/services" className="text-orange-400">
                Services
              </a>

              <a href="/projects" className="hover:text-orange-400">
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
            Premium Services
          </p>

          <h1 className="text-7xl md:text-8xl font-black leading-tight mb-8">
            Digital Solutions That Scale.
          </h1>

          <p className="text-gray-400 text-xl leading-9 max-w-4xl mx-auto mb-12">
            I help startups, businesses and creators build premium digital
            products, automation systems and scalable online solutions.
          </p>

          <a
            href="/request"
            className="inline-block bg-orange-500 text-black px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition"
          >
            Start Your Project
          </a>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-[32px] p-10 hover:border-orange-500 transition"
              >
                <div className="w-20 h-20 rounded-3xl bg-orange-500/20 flex items-center justify-center text-4xl mb-8">
                  {service.icon}
                </div>

                <h3 className="text-3xl font-bold mb-6">
                  {service.title}
                </h3>

                <p className="text-gray-400 leading-9 text-lg mb-8">
                  {service.description}
                </p>

                <a
                  href="/request"
                  className="text-orange-400 font-bold text-lg"
                >
                  Get Started →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
              Work Process
            </p>

            <h2 className="text-6xl font-black">
              How I Build Projects.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {process.map((step, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-[32px] p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-orange-500 text-black font-black text-2xl flex items-center justify-center mx-auto mb-6">
                  {index + 1}
                </div>

                <h3 className="text-2xl font-bold leading-tight">
                  {step}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
              Pricing Plans
            </p>

            <h2 className="text-6xl font-black">
              Flexible Pricing.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-10">
              <p className="text-orange-400 font-bold mb-5">Starter</p>

              <h3 className="text-6xl font-black mb-8">
                $300+
              </h3>

              <div className="space-y-5 text-gray-400 mb-10 text-lg">
                <p>✔ Landing Page</p>
                <p>✔ Responsive Design</p>
                <p>✔ Basic SEO</p>
                <p>✔ Fast Delivery</p>
              </div>

              <a
                href="/request"
                className="block w-full bg-orange-500 text-black py-5 rounded-2xl font-black text-center"
              >
                Choose Plan
              </a>
            </div>

            <div className="bg-orange-500 rounded-[40px] p-10 text-black scale-105 shadow-2xl shadow-orange-500/20">
              <p className="font-bold mb-5">Professional</p>

              <h3 className="text-6xl font-black mb-8">
                $1000+
              </h3>

              <div className="space-y-5 mb-10 text-lg">
                <p>✔ Full Website</p>
                <p>✔ Dashboard System</p>
                <p>✔ Automation Features</p>
                <p>✔ Premium UI/UX</p>
              </div>

              <a
                href="/request"
                className="block w-full bg-black text-white py-5 rounded-2xl font-black text-center"
              >
                Choose Plan
              </a>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[40px] p-10">
              <p className="text-orange-400 font-bold mb-5">Enterprise</p>

              <h3 className="text-6xl font-black mb-8">
                Custom
              </h3>

              <div className="space-y-5 text-gray-400 mb-10 text-lg">
                <p>✔ SaaS Platforms</p>
                <p>✔ Trading Systems</p>
                <p>✔ Full Automation</p>
                <p>✔ Long-Term Support</p>
              </div>

              <a
                href="/request"
                className="block w-full bg-orange-500 text-black py-5 rounded-2xl font-black text-center"
              >
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
              FAQ
            </p>

            <h2 className="text-6xl font-black">
              Frequently Asked Questions.
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                q: "How long does a project take?",
                a: "Project timelines depend on complexity, but most websites and systems take between 1-4 weeks.",
              },
              {
                q: "Do you provide long-term support?",
                a: "Yes. I provide maintenance, upgrades and long-term support contracts for clients.",
              },
              {
                q: "Can you build custom automation systems?",
                a: "Absolutely. I specialize in business automation, API integrations and scalable systems.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-[32px] p-8"
              >
                <h3 className="text-3xl font-bold mb-5">
                  {faq.q}
                </h3>

                <p className="text-gray-400 text-lg leading-9">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto text-center bg-white/5 border border-white/10 rounded-[40px] p-16">
          <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
            Start Your Project
          </p>

          <h2 className="text-6xl font-black leading-tight mb-8">
            Need A Premium Digital Solution?
          </h2>

          <p className="text-gray-400 text-xl leading-9 max-w-3xl mx-auto mb-10">
            Let’s create modern systems and experiences that help your business
            scale faster.
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

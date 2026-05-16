"use client";

import { useState } from "react";

export default function AboutPage() {

  const [menuOpen, setMenuOpen] = useState(false);

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

            <a href="/about" className="text-orange-400">
              About
            </a>

            <a href="/services" className="hover:text-orange-400 transition">
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

        {/* MOBILE MENU */}
        {menuOpen && (

          <div className="lg:hidden border-t border-white/10 bg-[#050816] animate-in slide-in-from-top duration-300">

            <div className="flex flex-col px-6 py-6 space-y-5 text-gray-300">

              <a href="/" className="hover:text-orange-400">
                Home
              </a>

              <a href="/about" className="text-orange-400">
                About
              </a>

              <a href="/services" className="hover:text-orange-400">
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

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">

          <div>

            <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-6">
              About Me
            </p>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
              Building Digital Solutions With Passion.
            </h1>

            <p className="text-gray-400 text-lg md:text-xl leading-9 mb-10 max-w-2xl">
              I’m a full-stack developer focused on building modern websites,
              automation systems, Telegram bots, trading dashboards and scalable
              applications for businesses worldwide.
            </p>

            <div className="flex flex-wrap gap-5">

              <div className="bg-white/5 border border-white/10 rounded-3xl px-8 py-6 min-w-[180px]">

                <h3 className="text-4xl font-black text-orange-400 mb-2">
                  5+
                </h3>

                <p className="text-gray-400">
                  Years Experience
                </p>

              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl px-8 py-6 min-w-[180px]">

                <h3 className="text-4xl font-black text-orange-400 mb-2">
                  100+
                </h3>

                <p className="text-gray-400">
                  Projects Completed
                </p>

              </div>

            </div>

          </div>

            <div className="relative">

              <div className="absolute w-[400px] h-[400px] bg-orange-500/20 blur-3xl rounded-full"></div>

              <img
                src="/images/profile.png"
                alt="Profile"
                className="relative z-10 rounded-[40px] border border-white/10 object-cover w-full h-[750px]"
              />

            </div>

        </div>

      </section>

      {/* EXPERIENCE */}
      <section className="py-24 px-6 border-b border-white/10">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">

          <div>

            <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
              My Story
            </p>

            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              Creating Premium Digital Experiences.
            </h2>

            <div className="space-y-8 text-gray-400 text-lg leading-9">

              <p>
                I specialize in modern frontend and backend development,
                creating high-performance digital products that combine clean
                design with scalable architecture.
              </p>

              <p>
                Over the years, I’ve worked on trading bots, Telegram systems,
                automation tools, business dashboards, SaaS platforms and modern
                websites for startups and companies.
              </p>

              <p>
                My goal is always to help businesses automate workflows,
                increase conversions and create premium digital experiences.
              </p>

            </div>

          </div>

          <div className="grid gap-8">

            {[
              [
                "2024",
                "Senior Full Stack Developer",
                "Developing premium automation systems, modern web apps and scalable trading platforms.",
              ],

              [
                "2022",
                "Web & Automation Engineer",
                "Built business automation systems, dashboards and custom APIs for clients worldwide.",
              ],

              [
                "2020",
                "Freelance Developer",
                "Started building websites and premium UI systems for startups and online businesses.",
              ],

            ].map((item, index) => (

              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-[32px] p-8"
              >

                <p className="text-orange-400 text-sm uppercase tracking-[5px] mb-4">
                  {item[0]}
                </p>

                <h3 className="text-3xl font-bold mb-4">
                  {item[1]}
                </h3>

                <p className="text-gray-400 leading-8">
                  {item[2]}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* SKILLS */}
      <section className="py-24 px-6 border-b border-white/10">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">

            <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
              Skills & Technologies
            </p>

            <h2 className="text-4xl md:text-6xl font-black">
              Tools I Work With.
            </h2>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">

            {[
              ["JavaScript", "98%"],
              ["TypeScript", "95%"],
              ["React.js", "96%"],
              ["Next.js", "93%"],
              ["Node.js", "90%"],
              ["Python", "95%"],
            ].map((skill, index) => (

              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-full aspect-square flex flex-col items-center justify-center"
              >

                <h3 className="text-3xl md:text-4xl font-black text-orange-400 mb-2">
                  {skill[1]}
                </h3>

                <p className="text-gray-300 text-center text-sm md:text-base">
                  {skill[0]}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* TRUSTED */}
      <section className="py-20 px-6 border-b border-white/10">

        <div className="max-w-7xl mx-auto">

          <div className="bg-white/5 border border-white/10 rounded-[30px] px-10 py-8 flex flex-wrap items-center justify-center gap-12 text-gray-300 text-lg">

            <span>Airbnb</span>
            <span>PayPal</span>
            <span>Binance</span>
            <span>Coinbase</span>
            <span>GitHub</span>
            <span>Vercel</span>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="py-28 px-6">

        <div className="max-w-5xl mx-auto text-center bg-white/5 border border-white/10 rounded-[40px] p-16">

          <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
            Let’s Build Together
          </p>

          <h2 className="text-4xl md:text-6xl font-black leading-tight mb-8">
            Ready To Start Your Next Project?
          </h2>

          <p className="text-gray-400 text-xl leading-9 max-w-3xl mx-auto mb-10">
            Let’s create modern digital experiences that help your business grow
            and scale.
          </p>

          <a
            href="/request"
            className="inline-block bg-orange-500 text-black px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition"
          >
            Start Project Request
          </a>

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
"use client";

import { useState } from "react";

export default function BlogPage() {

  const [menuOpen, setMenuOpen] = useState(false);

  const posts = [
    {
      title: "How To Build A Profitable Trading Bot",
      category: "Trading Bots",
      date: "May 15, 2026",
      image:
        "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1200&auto=format&fit=crop",
    },

    {
      title: "Top JavaScript Libraries Every Developer Should Know",
      category: "Web Development",
      date: "May 10, 2026",
      image:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
    },

    {
      title: "Web Automation With Python & Playwright",
      category: "Automation",
      date: "May 5, 2026",
      image:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1200&auto=format&fit=crop",
    },

    {
      title: "Building Modern SaaS Dashboards",
      category: "UI/UX Design",
      date: "April 29, 2026",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    },

    {
      title: "Best API Integrations For Startups",
      category: "API & Automation",
      date: "April 20, 2026",
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop",
    },

    {
      title: "Why Businesses Need Automation Systems",
      category: "Business Automation",
      date: "April 12, 2026",
      image:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1200&auto=format&fit=crop",
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

            <a href="/projects" className="hover:text-orange-400 transition">
              Projects
            </a>

            <a href="/blog" className="text-orange-400">
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

              <a href="/projects" className="hover:text-orange-400">
                Projects
              </a>

              <a href="/blog" className="text-orange-400">
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
            Latest Insights
          </p>

          <h1 className="text-7xl md:text-8xl font-black leading-tight mb-8">
            From My Blog.
          </h1>

          <p className="text-gray-400 text-xl leading-9 max-w-4xl mx-auto mb-12">
            Explore modern development strategies, automation insights,
            trading systems and premium UI/UX tutorials.
          </p>
        </div>
      </section>

      {/* FEATURED POST */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1200&auto=format&fit=crop"
              className="rounded-[40px] border border-white/10"
            />
          </div>

          <div>
            <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
              Featured Article
            </p>

            <h2 className="text-6xl font-black leading-tight mb-8">
              How To Build Modern Trading Systems.
            </h2>

            <p className="text-gray-400 text-lg leading-9 mb-10">
              Learn how modern trading bots and automation systems are built
              using APIs, dashboards, AI signals and scalable backend systems.
            </p>

            <div className="flex items-center gap-5 mb-10">
              <span className="bg-orange-500/20 text-orange-400 px-5 py-2 rounded-full text-sm font-bold">
                Trading Bots
              </span>

              <span className="text-gray-400">8 min read</span>
            </div>

            <a
              href="#"
              className="inline-block bg-orange-500 text-black px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition"
            >
              Read Article
            </a>
          </div>
        </div>
      </section>

      {/* SEARCH + CATEGORIES */}
      <section className="py-16 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-center justify-between">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full lg:w-[400px] bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5"
          />

          <div className="flex flex-wrap gap-5 justify-center">
            {[
              "All",
              "Automation",
              "Trading Bots",
              "Web Development",
              "UI/UX",
              "APIs",
            ].map((category, index) => (
              <button
                key={index}
                className={`px-6 py-3 rounded-2xl border font-bold transition ${
                  index === 0
                    ? "bg-orange-500 text-black border-orange-500"
                    : "border-white/10 text-gray-300 hover:border-orange-500 hover:text-orange-400"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-[32px] border border-white/10 bg-white/5 hover:border-orange-500 transition"
              >
                <div className="overflow-hidden">
                  <img
                    src={post.image}
                    className="h-64 w-full object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>

                <div className="p-8">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-orange-400 text-sm uppercase tracking-[3px]">
                      {post.category}
                    </span>

                    <span className="text-gray-500 text-sm">
                      {post.date}
                    </span>
                  </div>

                  <h3 className="text-3xl font-bold leading-tight mb-6">
                    {post.title}
                  </h3>

                  <p className="text-gray-400 leading-8 mb-6">
                    Premium development insights and modern strategies for
                    building scalable digital products.
                  </p>

                  <a
                    href="#"
                    className="text-orange-400 font-bold text-lg"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-28 px-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto text-center bg-white/5 border border-white/10 rounded-[40px] p-16">
          <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
            Newsletter
          </p>

          <h2 className="text-6xl font-black leading-tight mb-8">
            Stay Updated With New Insights.
          </h2>

          <p className="text-gray-400 text-xl leading-9 max-w-3xl mx-auto mb-10">
            Subscribe to get updates on automation systems, development tips,
            premium UI design and modern digital products.
          </p>

          <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-5">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5"
            />

            <button className="bg-orange-500 text-black px-10 py-5 rounded-2xl font-black hover:scale-105 transition">
              Subscribe
            </button>
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
            Let’s build scalable systems, automation tools and premium digital
            experiences for your business.
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

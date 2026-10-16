"use client";

import { useState } from "react";

export default function RequestPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    service: "",
    budget: "",
    timeframe: "",
    contract: "",
    details: "",
  });

  // SUBMIT PROJECT REQUEST BY EMAIL
  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch("/api/send-message-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Your project request could not be sent. Please try again."
        );
      }

      alert("Project Request Sent Successfully ✅");

      setForm({
        fullname: "",
        email: "",
        service: "",
        budget: "",
        timeframe: "",
        contract: "",
        details: "",
      });
    } catch (error) {
      console.error("Project request submission failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-[#050816] text-white min-h-screen overflow-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#050816]/90 backdrop-blur-xl border-b border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          {/* LOGO */}
          <a href="/" className="flex items-center h-14 overflow-visible">
            <img
              src="/images/logo.png"
              alt="UpNorth Tech Logo"
              className="h-14 w-auto object-contain"
            />
          </a>

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
              Start Project
            </a>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-2xl"
            >
              {menuOpen ? "×" : "☰"}
            </button>

          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#050816]">
            <div className="flex flex-col px-6 py-6 space-y-5 text-gray-300">

              <a
                href="/"
                onClick={() => setMenuOpen(false)}
                className="hover:text-orange-400"
              >
                Home
              </a>

              <a
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="hover:text-orange-400"
              >
                About
              </a>

              <a
                href="/services"
                onClick={() => setMenuOpen(false)}
                className="hover:text-orange-400"
              >
                Services
              </a>

              <a
                href="/projects"
                onClick={() => setMenuOpen(false)}
                className="hover:text-orange-400"
              >
                Projects
              </a>

              <a
                href="/blog"
                onClick={() => setMenuOpen(false)}
                className="hover:text-orange-400"
              >
                Blog
              </a>

              <a
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="hover:text-orange-400"
              >
                Contact
              </a>

            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-40 pb-20 px-6 border-b border-white/10 relative">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,115,0,0.15),transparent_40%)]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">

          <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
            Project Request
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8">
            Start Your Project.
          </h1>

          <p className="text-gray-400 text-lg md:text-xl leading-9 max-w-3xl mx-auto">
            Fill out the form below and let&apos;s build a premium digital
            solution tailored for your business.
          </p>

        </div>
      </section>

      {/* PROJECT REQUEST FORM */}
      <section className="py-24 px-6">

        <div className="max-w-4xl mx-auto">

          <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/10 rounded-[40px] p-6 sm:p-10 md:p-14 space-y-8"
          >

            <div className="grid md:grid-cols-2 gap-6">

              {/* FULL NAME */}
              <input
                type="text"
                name="fullname"
                value={form.fullname}
                placeholder="Full Name"
                autoComplete="name"
                maxLength={120}
                required
                className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-orange-400"
                onChange={(e) =>
                  setForm({ ...form, fullname: e.target.value })
                }
              />

              {/* EMAIL */}
              <input
                type="email"
                name="email"
                value={form.email}
                placeholder="Gmail Address"
                autoComplete="email"
                maxLength={254}
                required
                className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-orange-400"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

            </div>

            {/* SERVICE */}
            <select
              name="service"
              required
              value={form.service}
              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-orange-400"
              onChange={(e) =>
                setForm({ ...form, service: e.target.value })
              }
            >
              <option value="">Choose Service</option>
              <option value="Website Development">Web Development</option>
              <option value="Web App Development">Web App Development</option>
              <option value="Trading Bot Development">Trading Bot</option>
              <option value="Telegram Bot Automation">Telegram Bot</option>
              <option value="Business Automation">Automation</option>
              <option value="Dashboard">Dashboard</option>
              <option value="UI/UX & Brand Design">UI/UX Design</option>
              <option value="Blockchain / Web3 Development">
                Blockchain / Web3 Development
              </option>
              <option value="Bug Fixing / Existing Project">
                Bug Fixing / Existing Project
              </option>
              <option value="Other">Other</option>
            </select>

            {/* BUDGET AND TIMELINE */}
            <div className="grid md:grid-cols-2 gap-6">

              <select
                name="budget"
                required
                value={form.budget}
                className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-orange-400"
                onChange={(e) =>
                  setForm({ ...form, budget: e.target.value })
                }
              >
                <option value="">Select Budget</option>
                <option value="Under $500">Under $500</option>
                <option value="$500 - $1,000">$500 - $1,000</option>
                <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                <option value="$10,000 - $20,000">$10,000 - $20,000</option>
                <option value="$20,000+">$20,000+</option>
                <option value="Need a quote">Need a quote</option>
              </select>

              <select
                name="timeframe"
                required
                value={form.timeframe}
                className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-orange-400"
                onChange={(e) =>
                  setForm({ ...form, timeframe: e.target.value })
                }
              >
                <option value="">Select Timeline</option>
                <option value="As soon as possible">As soon as possible</option>
                <option value="1-2 Weeks">1-2 Weeks</option>
                <option value="2-4 Weeks">2-4 Weeks</option>
                <option value="1-2 Months">1-2 Months</option>
                <option value="2-4 Months">2-4 Months</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Flexible">Flexible</option>
              </select>

            </div>

            {/* CONTRACT TYPE */}
            <select
              name="contract"
              required
              value={form.contract}
              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-orange-400"
              onChange={(e) =>
                setForm({ ...form, contract: e.target.value })
              }
            >
              <option value="">Choose Contract Type</option>
              <option value="Long Time Contract">Long Time Contract</option>
              <option value="Project Based">Project Based</option>
              <option value="Hourly Work">Hourly Work</option>
              <option value="Not Sure Yet">Not Sure Yet</option>
            </select>

            {/* PROJECT DETAILS */}
            <textarea
              name="details"
              rows={8}
              minLength={10}
              maxLength={10000}
              value={form.details}
              placeholder="Tell me about your project..."
              required
              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-orange-400"
              onChange={(e) =>
                setForm({ ...form, details: e.target.value })
              }
            />

            <p className="-mt-6 text-right text-xs text-gray-500">
              {form.details.length}/10000 characters
            </p>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-black py-6 rounded-2xl font-black text-lg hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Project Request"}
            </button>

            <p className="text-center text-sm text-gray-400">
              Your project details will be sent securely to our team. Please do
              not include passwords, private keys, or other sensitive
              credentials.
            </p>

          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 px-6">

        <div className="max-w-7xl mx-auto text-center">

          <h2 className="text-3xl font-black mb-4">
            UpNorth Tech
          </h2>

          <p className="text-gray-400">
            Building premium digital solutions for modern businesses.
          </p>

        </div>
      </footer>

    </main>
  );
}
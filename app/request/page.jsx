"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function RequestPage() {

  const [menuOpen, setMenuOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    service: "",
    budget: "",
    timeframe: "",
    contract: "",
    details: "",
  });

  // CHECK USER
  useEffect(() => {

    async function getUser() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // REDIRECT IF NOT LOGGED IN
      if (!user) {

        window.location.href = "/login";

        return;

      }

      setUser(user);

      // AUTO FILL USER INFO
      setForm((prev) => ({
        ...prev,
        fullname: user.user_metadata?.full_name || "",
        email: user.email || "",
      }));

    }

    getUser();

  }, []);

  // LOGOUT
  async function handleLogout() {

    await supabase.auth.signOut();

    window.location.href = "/";

  }

  // SUBMIT PROJECT
  async function handleSubmit(e) {

    e.preventDefault();

    setLoading(true);

    try {

      // SAVE TO SUPABASE DATABASE
      const { error } = await supabase
        .from("project_requests")
        .insert([
          {
            user_id: user.id,
            fullname: form.fullname,
            email: form.email,
            service: form.service,
            budget: form.budget,
            timeframe: form.timeframe,
            contract: form.contract,
            details: form.details,
            status: "Pending",
          },
        ]);

      await fetch(
      "/api/send-message-email",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({

          to:
            "sulaimonganiyu315@gmail.com",

          subject:
            "New Project Request",

          message: `
        New project request received.

        Client: ${form.fullname}

        Email: ${form.email}

        Service: ${form.service}

        Budget: ${form.budget}

        Timeframe: ${form.timeframe}

        Contract: ${form.contract}

        Details: ${form.details}
        `,
        }),
      }
    );

      if (error) {

        console.log(error);

        alert("Something went wrong ❌");

      } else {

        alert("Project Request Sent Successfully ✅");

        // GO TO DASHBOARD
        window.location.href = "/dashboard";

      }

    } catch (error) {

      console.log(error);

      alert("Server Error ❌");

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

            <a href="/blog" className="hover:text-orange-400 transition">
              Blog
            </a>

            <a href="/contact" className="hover:text-orange-400 transition">
              Contact
            </a>

            {user ? (

              <>

                <a
                  href="/dashboard"
                  className="hover:text-orange-400 transition"
                >
                  Dashboard
                </a>

                <button
                  onClick={handleLogout}
                  className="border border-white/10 px-5 py-3 rounded-xl hover:border-red-500 transition"
                >
                  Logout
                </button>

              </>

            ) : (

              <>

                <a
                  href="/login"
                  className="border border-white/10 px-5 py-3 rounded-xl hover:border-orange-500 transition"
                >
                  Login
                </a>

                <a
                  href="/signup"
                  className="bg-orange-500 text-black px-5 py-3 rounded-xl font-bold"
                >
                  Sign Up
                </a>

              </>

            )}

          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            <a
              href="/request"
              className="hidden md:flex bg-orange-500 text-black px-5 py-3 rounded-xl font-bold hover:scale-105 transition"
            >
              Start Project
            </a>

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

          <div className="lg:hidden border-t border-white/10 bg-[#050816]">

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

              <a href="/blog" className="hover:text-orange-400">
                Blog
              </a>

              <a href="/contact" className="hover:text-orange-400">
                Contact
              </a>

              {user ? (

                <>

                  <a
                    href="/dashboard"
                    className="hover:text-orange-400"
                  >
                    Dashboard
                  </a>

                  <button
                    onClick={handleLogout}
                    className="border border-white/10 px-5 py-3 rounded-xl hover:border-red-500 transition"
                  >
                    Logout
                  </button>

                </>

              ) : (

                <>

                  <a
                    href="/login"
                    className="border border-white/10 px-5 py-3 rounded-xl hover:border-orange-500 transition"
                  >
                    Login
                  </a>

                  <a
                    href="/signup"
                    className="bg-orange-500 text-black px-5 py-3 rounded-xl font-bold"
                  >
                    Sign Up
                  </a>

                </>

              )}

            </div>

          </div>

        )}

      </nav>

      {/* HERO */}
      <section className="pt-40 pb-20 px-6 border-b border-white/10 relative">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,115,0,0.15),transparent_40%)]"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">

          <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
            Project Request
          </p>

          <h1 className="text-7xl md:text-8xl font-black leading-tight mb-8">
            Start Your Project.
          </h1>

          <p className="text-gray-400 text-xl leading-9 max-w-3xl mx-auto">
            Fill out the form below and let's build a premium digital solution
            tailored for your business.
          </p>

        </div>

      </section>

      {/* FORM */}
      <section className="py-24 px-6">

        <div className="max-w-4xl mx-auto">

          <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/10 rounded-[40px] p-10 md:p-14 space-y-8"
          >

            <div className="grid md:grid-cols-2 gap-6">

              <input
                type="text"
                value={form.fullname}
                placeholder="Full Name"
                required
                className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 outline-none"
                onChange={(e) =>
                  setForm({ ...form, fullname: e.target.value })
                }
              />

              <input
                type="email"
                value={form.email}
                placeholder="Gmail Address"
                required
                className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 outline-none"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

            </div>

            <select
              required
              value={form.service}
              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 text-white"
              onChange={(e) =>
                setForm({ ...form, service: e.target.value })
              }
            >

              <option value="">Choose Service</option>

              <option>Web Development</option>

              <option>Trading Bot</option>

              <option>Telegram Bot</option>

              <option>Automation</option>

              <option>Dashboard</option>

              <option>UI/UX Design</option>

            </select>

            <div className="grid md:grid-cols-2 gap-6">

              <select
                required
                value={form.budget}
                className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 text-white"
                onChange={(e) =>
                  setForm({ ...form, budget: e.target.value })
                }
              >

                <option value="">Select Budget</option>

                <option>$500 - $1,000</option>

                <option>$1,000 - $3,000</option>

                <option>$3,000 - $5,000</option>

                <option>$5,000 - $10,000</option>

                <option>$10,000 - $20,000</option>

                <option>$20,000+</option>

              </select>

              <select
                required
                value={form.timeframe}
                className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 text-white"
                onChange={(e) =>
                  setForm({ ...form, timeframe: e.target.value })
                }
              >

                <option value="">Select Timeline</option>

                <option>1-2 Weeks</option>

                <option>2-4 Weeks</option>

                <option>1-2 Months</option>

                <option>2-4 Months</option>

                <option>Ongoing</option>

              </select>

            </div>

            <select
              required
              value={form.contract}
              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 text-white"
              onChange={(e) =>
                setForm({ ...form, contract: e.target.value })
              }
            >

              <option value="">Choose Contract Type</option>

              <option>Long Time Contract</option>

              <option>Project Based</option>

            </select>

            <textarea
              rows="8"
              value={form.details}
              placeholder="Tell me about your project..."
              required
              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5 outline-none"
              onChange={(e) =>
                setForm({ ...form, details: e.target.value })
              }
            ></textarea>

            <button
              disabled={loading}
              className="w-full bg-orange-500 text-black py-6 rounded-2xl font-black text-lg hover:scale-[1.02] transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Project Request"}
            </button>

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
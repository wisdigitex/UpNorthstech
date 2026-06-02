"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const services = [
  "Website Development",
  "Web App Development",
  "Trading Bot Development",
  "Telegram Bot Automation",
  "Business Automation",
  "UI/UX & Brand Design",
];

const skills = [
  ["JavaScript", "98%"],
  ["TypeScript", "95%"],
  ["React.js", "96%"],
  ["Next.js", "93%"],
  ["Node.js", "90%"],
  ["Python", "95%"],
];

const projects = [
  {
    title: "Crypto Trading Bot",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
    link: "/projects/crypto-trading-bot",
  },

  {
    title: "Crypto Dashboard",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200&auto=format&fit=crop",
    link: "/projects/crypto-dashboard",
  },

  {
    title: "Ecommerce Website",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200&auto=format&fit=crop",
    link: "/projects/ecommerce-website",
  },

  {
    title: "Telegram Auto Bot",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    link: "/projects/telegram-auto-bot",
  },
];

export default function Home() {

  const [menuOpen, setMenuOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cms, setCms] = useState(null);

  // CHECK LOGGED IN USER
  useEffect(() => {

    async function getUser() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      if (user?.email === "sulaimonganiyu315@gmail.com") {
  setIsAdmin(true);
}

    }

    getUser();

  }, []);

useEffect(() => {
  async function loadCMS() {
    const { data } = await supabase
      .from("site_content")
      .select("*")
      .eq("section", "home")
      .single();

    if (data) setCms(data.content);
  }

  loadCMS();
}, []);

  // LOGOUT
  async function handleLogout() {

    await supabase.auth.signOut();

    window.location.href = "/";

  }

  async function handleSubmit(e) {    
    
    e.preventDefault();

    setLoading(true);

    const formData = {
      fullname: e.target.fullname.value,
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Project Request Sent Successfully ✅");

        e.target.reset();
      } else {
        alert("Something went wrong ❌");
      }
    } catch (error) {
      console.log(error);

      alert("Server Error ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-[#050816] text-white overflow-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#050816]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-0 py-5 flex items-center justify-between">
          {/* LOGO */}
            <a href="/" className="flex items-center">
              <img
                src={cms?.logo || "/images/logo.png"}
                alt={cms?.brandName || "UpNorth Tech"}
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

            {/* AUTH BUTTONS */}

            {user ? (

              <>

                <a
                  href="/dashboard"
                  className="hover:text-orange-400 transition"
                >
                  Dashboard
                </a>
                {isAdmin && (
                  <a
                    href="/admin"
                    className="hover:text-orange-400 transition"
                  >
                    Admin
                  </a>
                )}

                <button
                  onClick={handleLogout}
                  className="border border-white/10 px-5 py-2 rounded-xl hover:border-red-500 transition"
                >
                  Logout
                </button>

              </>

            ) : (

              <>

                <a
                  href="/login"
                  className="border border-white/10 px-5 py-2 rounded-xl hover:border-orange-500 transition"
                >
                  Login
                </a>

                <a
                  href="/signup"
                  className="bg-orange-500 text-black px-5 py-2 rounded-xl font-bold hover:scale-105 transition"
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
              Let's Work Together
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
              {/* AUTH BUTTONS */}

              {user ? (

                <>

                  <a
                    href="/dashboard"
                    className="hover:text-orange-400 transition"
                  >
                    Dashboard
                  </a>
                  {isAdmin && (
                    <a
                      href="/admin"
                      className="hover:text-orange-400 transition"
                    >
                      Admin
                    </a>
                  )}

                  <button
                    onClick={handleLogout}
                    className="border border-white/10 px-5 py-2 rounded-xl hover:border-red-500 transition"
                  >
                    Logout
                  </button>

                </>

              ) : (

                <>

                  <a
                    href="/login"
                    className="border border-white/10 px-5 py-2 rounded-xl hover:border-orange-500 transition"
                  >
                    Login
                  </a>

                  <a
                    href="/signup"
                    className="bg-orange-500 text-black px-5 py-2 rounded-xl font-bold hover:scale-105 transition"
                  >
                    Sign Up
                  </a>

                </>

              )}

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

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
          <p className="text-orange-400 text-lg mb-5">
            {cms?.heroSmall || "Digital Agency �"}
          </p>

          <h1 className="text-7xl md:text-8xl font-black leading-tight mb-8">
            {cms?.heroTitle || "We Build Digital Solutions That Scale."}
          </h1>

          <p className="text-gray-400 text-xl leading-9 max-w-xl mb-10">
            {cms?.heroDescription ||
              "We help businesses build premium websites, web apps, trading bots, automation systems and scalable digital platforms."}
          </p>

            <div className="flex gap-5 flex-wrap mb-10">
              <a
                href="/request"
                className="bg-orange-500 px-8 py-5 rounded-2xl text-black font-bold"
              >
                Start A Project
              </a>

              <a
                href="/projects"
                className="border border-white/10 px-8 py-5 rounded-2xl"
              >
                View Our Work
              </a>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex -space-x-4">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  className="w-14 h-14 rounded-full border-2 border-[#050816]"
                />

                <img
                  src="https://randomuser.me/api/portraits/women/45.jpg"
                  className="w-14 h-14 rounded-full border-2 border-[#050816]"
                />

                <img
                  src="https://randomuser.me/api/portraits/men/64.jpg"
                  className="w-14 h-14 rounded-full border-2 border-[#050816]"
                />
              </div>

              <div>
                <h3 className="text-orange-400 font-bold text-lg">
                  50+ Happy Clients
                </h3>

                <p className="text-gray-400">Worldwide Customers</p>
              </div>
            </div>
          </div>
              <div className="relative flex justify-center items-center px-4">

                <div className="absolute w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-orange-500/20 blur-3xl rounded-full"></div>

                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
                  alt="UpNorth Tech"
                  className="
                    relative z-10
                    rounded-[40px]
                    border border-white/10
                    w-full
                    max-w-[320px]
                    sm:max-w-[360px]
                    md:max-w-[500px]
                    h-[500px]
                    md:h-[650px]
                    object-cover
                    mx-auto
                  "
                />

              </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
              Our Services
            </p>

            <h2 className="text-6xl font-black">
              Digital Services For Your Business.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-orange-500 transition"
              >
                <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center text-2xl mb-6">
                  ⚡
                </div>

                <h3 className="text-2xl font-bold mb-5">{service}</h3>

                <p className="text-gray-400 leading-8 mb-6">
                  Premium scalable solutions with modern architecture and design
                  systems.
                </p>

                <a href="/services" className="text-orange-400 font-bold">
                  Learn More →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
              Our Capabilities
            </p>

            <h2 className="text-6xl font-black">
              Trusted Skills & Results
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-full aspect-square flex flex-col items-center justify-center"
              >
                <h3 className="text-3xl font-black text-orange-400 mb-2">
                  {skill[1]}
                </h3>

                <p className="text-gray-300 text-center">{skill[0]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16 flex-wrap gap-5">
            <div>
              <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
                Our Portfolio
              </p>

              <h2 className="text-6xl font-black">
                Featured Projects.
              </h2>
            </div>

            <a href="/projects" className="text-orange-400 font-bold">
              View All Projects →
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5"
              >
                <img
                  src={project.image}
                  className="h-80 w-full object-cover hover:scale-110 transition duration-700"
                />

                <div className="p-8">
                  <h3 className="text-3xl font-bold mb-4">
                    {project.title}
                  </h3>

                  <p className="text-gray-400 mb-6">
                    Modern scalable system with premium UI and backend.
                  </p>

                  {/* FIXED BUTTON */}
                  <a
                    href={project.link}
                    className="inline-block bg-orange-500 px-6 py-3 rounded-xl text-black font-bold hover:scale-105 transition"
                  >
                    View Project
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          {/* LEFT SIDE */}
          <div>
            <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
              Let's Work Together
            </p>

            <h2 className="text-6xl font-black leading-tight mb-8">
              Let’s Build Something Great Together.
            </h2>

            <p className="text-gray-400 text-lg leading-9 mb-10">
              Tell us what you want to build. Our team will review your request and reply quickly.
            </p>

            <div className="space-y-5 text-lg">
              <p>📧 info@upnorthstech.com</p>
              <p>📞 +2347035001858</p>
              <p>📍 Remote Worldwide</p>
            </div>
          </div>
{/* FORM */}
<div className="bg-white/5 border border-white/10 rounded-[40px] p-10">

  <form
    onSubmit={handleSubmit}
    className="space-y-6"
  >

    <input
      name="fullname"
      type="text"
      placeholder="Full Name"
      required
      className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-5 outline-none focus:border-orange-500"
    />

    <input
      name="email"
      type="email"
      placeholder="Email Address"
      required
      className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-5 outline-none focus:border-orange-500"
    />

    <input
      name="subject"
      type="text"
      placeholder="Subject"
      required
      className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-5 outline-none focus:border-orange-500"
    />

    <textarea
      name="message"
      rows="7"
      placeholder="Tell me about your project..."
      required
      className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-5 outline-none focus:border-orange-500 resize-none"
    ></textarea>

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-orange-500 py-5 rounded-2xl text-black font-black hover:scale-[1.02] transition disabled:opacity-50"
    >
      {loading ? "Sending..." : "Send Message"}
    </button>

  </form>

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
              A premium digital agency building websites, apps, bots and automation systems.
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
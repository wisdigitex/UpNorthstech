"use client";

import { useState } from "react";

export default function ContactPage() {

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

            <a href="/contact" className="text-orange-400">
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

              <a href="/blog" className="hover:text-orange-400">
                Blog
              </a>

              <a href="/contact" className="text-orange-400">
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
            Contact Me
          </p>

          <h1 className="text-7xl md:text-8xl font-black leading-tight mb-8">
            Let’s Build Something Amazing.
          </h1>

          <p className="text-gray-400 text-xl leading-9 max-w-4xl mx-auto mb-12">
            Have a project in mind? Let’s discuss your ideas and create premium
            digital solutions that help your business grow.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          {/* LEFT SIDE */}
          <div>
            <p className="text-orange-400 uppercase tracking-[5px] text-sm mb-5">
              Get In Touch
            </p>

            <h2 className="text-6xl font-black leading-tight mb-8">
              Ready To Start Your Next Project?
            </h2>

            <p className="text-gray-400 text-lg leading-9 mb-12">
              I help startups, creators and businesses build premium websites,
              automation systems, dashboards and scalable digital products.
            </p>

            <div className="space-y-8 mb-12">
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                <h3 className="text-2xl font-bold mb-3 text-orange-400">
                  Email
                </h3>
                <p className="text-gray-400 text-lg">
                  upnorthtech@gmail.com
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                <h3 className="text-2xl font-bold mb-3 text-orange-400">
                  Phone
                </h3>
                <p className="text-gray-400 text-lg">
                  +1 451 356 888
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                <h3 className="text-2xl font-bold mb-3 text-orange-400">
                  Location
                </h3>
                <p className="text-gray-400 text-lg">
                  Remote Worldwide
                </p>
              </div>
            </div>

            {/* SOCIALS */}
            <div className="flex gap-5 flex-wrap">
              {[
                "Instagram",
                "Twitter",
                "LinkedIn",
                "GitHub",
              ].map((social, index) => (
                <button
                  key={index}
                  className="px-6 py-4 border border-white/10 rounded-2xl hover:border-orange-500 hover:text-orange-400 transition"
                >
                  {social}
                </button>
              ))}
            </div>
          </div>

          {/* FORM */}
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-10">
<form
  onSubmit={async (e) => {

    e.preventDefault();

    const formData = {
      fullname: e.target.fullname.value,
      email: e.target.email.value,
      subject: e.target.subject.value,
      service: e.target.service.value,
      budget: e.target.budget.value,
      timeframe: e.target.timeframe.value,
      details: e.target.details.value,
    };

    const response = await fetch("/api/contact", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if(data.success){
      alert("Message Sent Successfully ✅");
      e.target.reset();
    }else{
      alert("Something went wrong ❌");
    }

  }}

  className="space-y-6"
>

  {/* NAME + EMAIL */}
  <div className="grid md:grid-cols-2 gap-5">

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
      placeholder="Gmail Address"
      required
      className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-5 outline-none focus:border-orange-500"
    />

  </div>

  {/* SUBJECT */}
  <input
    name="subject"
    type="text"
    placeholder="Subject"
    required
    className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-5 outline-none focus:border-orange-500"
  />

  {/* SERVICE */}
  <div>
    <p className="text-gray-400 text-sm mb-3">
      Service
    </p>

    <select
      name="service"
      required
      className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-5 outline-none focus:border-orange-500 text-white"
    >

      <option value="">Choose Service</option>

      <option>Web Development</option>

      <option>Trading Bot</option>

      <option>Telegram Bot</option>

      <option>Automation</option>

      <option>Dashboard</option>

      <option>UI/UX Design</option>

    </select>
  </div>

  {/* BUDGET + TIMELINE */}
  <div className="grid md:grid-cols-2 gap-6">

    <div>
      <p className="text-gray-400 text-sm mb-3">
        Budget Range
      </p>

      <select
        name="budget"
        required
        className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-5 outline-none focus:border-orange-500 text-white"
      >

        <option value="">Select Budget</option>

        <option>$500 - $1,000</option>

        <option>$1,000 - $3,000</option>

        <option>$3,000 - $5,000</option>

        <option>$5,000 - $10,000</option>

        <option>$10,000 - $20,000</option>

        <option>$20,000+</option>

      </select>
    </div>

    <div>
      <p className="text-gray-400 text-sm mb-3">
        Expected Timeline
      </p>

      <select
        name="timeframe"
        required
        className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-5 outline-none focus:border-orange-500 text-white"
      >

        <option value="">Select Timeline</option>

        <option>1-2 Weeks</option>

        <option>2-4 Weeks</option>

        <option>1-2 Months</option>

        <option>2-4 Months</option>

        <option>Ongoing</option>

      </select>
    </div>

  </div>

  {/* MESSAGE */}
  <textarea
    name="details"
    rows="7"
    placeholder="Tell me about your project"
    required
    className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-5 outline-none focus:border-orange-500"
  ></textarea>

  {/* BUTTON */}
  <button
    type="submit"
    className="w-full bg-orange-500 py-5 rounded-2xl text-black font-black text-lg hover:scale-[1.02] transition"
  >
    Send Message
  </button>

</form>
          </div>
        </div>
      </section>

      {/* MAP / STATS */}
      <section className="py-24 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          {[
            ["100+", "Projects Completed"],
            ["50+", "Happy Clients"],
            ["24/7", "Support Available"],
            ["5+", "Years Experience"],
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-[32px] p-10 text-center"
            >
              <h3 className="text-6xl font-black text-orange-400 mb-4">
                {item[0]}
              </h3>

              <p className="text-gray-400 text-lg">
                {item[1]}
              </p>
            </div>
          ))}
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
                q: "How fast can you deliver projects?",
                a: "Most projects are delivered within 1-4 weeks depending on complexity and requirements.",
              },
              {
                q: "Do you work with international clients?",
                a: "Yes. I work remotely with clients and businesses worldwide.",
              },
              {
                q: "Can I request long-term development support?",
                a: "Absolutely. Long-term contracts and maintenance plans are available.",
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
            Let’s create modern systems, automation tools and scalable digital
            products tailored to your business goals.
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

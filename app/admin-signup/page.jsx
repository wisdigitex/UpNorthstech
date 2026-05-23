"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminSignupPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e) {

    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {

      alert(error.message);

    } else {

      alert("Admin account created");

      window.location.href = "/admin-login";

    }

  }

  return (

    <main className="min-h-screen bg-[#050816] flex items-center justify-center p-6 text-white">

      <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-[40px] p-10">

        <h1 className="text-5xl font-black mb-10">
          Create Admin
        </h1>

        <form onSubmit={handleSignup} className="space-y-6">

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-6 py-5"
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-black py-5 rounded-2xl font-black"
          >
            Create Admin
          </button>

        </form>

      </div>

    </main>

  );

}
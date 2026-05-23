"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminLoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {

    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {

      alert(error.message);

    } else {

      window.location.href = "/admin";

    }

    setLoading(false);

  }

  return (

    <main className="min-h-screen bg-[#050816] flex items-center justify-center p-6 text-white">

      <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-[40px] p-10">

        <h1 className="text-5xl font-black mb-3">
          Admin Login
        </h1>

        <p className="text-gray-400 mb-10">
          Sign in to access admin panel.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">

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
            disabled={loading}
            className="w-full bg-orange-500 text-black py-5 rounded-2xl font-black"
          >
            {loading ? "Signing In..." : "Login"}
          </button>

        </form>

      </div>

    </main>

  );

}
"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {

    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {

      alert(error.message);

    } else {

      router.push("/dashboard");

    }

  }

  async function handleGoogleLogin() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) alert(error.message);
}

  return (

    <main className="min-h-screen bg-[#050816] flex items-center justify-center px-6">

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-[32px] p-10 space-y-6"
      >

        <h1 className="text-4xl font-black text-white text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          required
          className="w-full bg-[#0F172A] text-white border border-white/10 rounded-2xl px-5 py-5"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          className="w-full bg-[#0F172A] text-white border border-white/10 rounded-2xl px-5 py-5"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-orange-500 py-5 rounded-2xl text-black font-black"
        >
          Login
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white text-black py-5 rounded-2xl font-black flex items-center justify-center gap-3"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-6 h-6"
          />
          Continue with Google
        </button>

        <div className="mt-6 text-center">

        <a
          href="/"
          className="text-gray-400 hover:text-orange-400 transition"
        >
          ← Back To Home
        </a>

      </div>

      </form>

    </main>

  );
}
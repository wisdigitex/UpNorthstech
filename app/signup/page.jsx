"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  async function handleSignup(e) {

    e.preventDefault();

    if (form.password !== form.confirmPassword) {

      alert("Passwords do not match");

      return;

    }

    setLoading(true);

    try {

      const { data, error } = await supabase.auth.signUp({

        email: form.email,

        password: form.password,

        options: {

          data: {
            fullname: form.fullname,
          },

        },

      });

      if (error) {

        alert(error.message);

        return;

      }

    alert(
      "Account Created Successfully ✅ Please check your email to confirm your account."
    );

    router.push("/login");

    } catch (err) {

      console.log(err);

      alert("Signup failed ❌");

    } finally {

      setLoading(false);

    }

  }

  return (

    <main className="min-h-screen bg-[#050816] flex items-center justify-center px-6">

      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-[40px] p-10"
      >

        <h1 className="text-5xl font-black text-white mb-10 text-center">
          Create Account
        </h1>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            required
            value={form.fullname}
            onChange={(e) =>
              setForm({ ...form, fullname: e.target.value })
            }
            className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-5 text-white outline-none focus:border-orange-500"
          />

          <input
            type="email"
            placeholder="Gmail Address"
            required
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-5 text-white outline-none focus:border-orange-500"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-5 text-white outline-none focus:border-orange-500"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value,
              })
            }
            className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-5 text-white outline-none focus:border-orange-500"
          />

        </div>

        <button
          disabled={loading}
          className="w-full bg-orange-500 text-black py-5 rounded-2xl font-black text-lg mt-8 hover:scale-[1.02] transition"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <div className="mt-8 text-center">

          <p className="text-gray-400 mb-3">
            Already have an account?
          </p>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-orange-400 font-bold"
          >
            Login Here
          </button>

        </div>

        <div className="mt-6 text-center">

          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white transition"
          >
            ← Back To Home
          </button>

        </div>

      </form>

    </main>

  );

}
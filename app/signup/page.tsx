"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { ShieldCheck, Mail, Lock, User, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const { signup } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const success = await signup(email, name, "citizen");
      if (success) {
        setInfoMsg("Registration successful! Creating citizen profile...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setError("Sign up failed. Please try a different email.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to register profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 bg-slate-50 dark:bg-[#051026] relative">
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#FF9933]/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#138808]/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top visual theme band */}
        <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>

        <div className="p-8">
          
          <div className="text-center space-y-2 mb-8">
            <div className="mx-auto h-12 w-12 rounded-full bg-navy/5 border border-border flex items-center justify-center text-navy dark:text-saffron">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-navy dark:text-white">
              Create Citizen Account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign up to track municipal files and qualify for schemes.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200 text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          {infoMsg && (
            <div className="mb-4 p-3 rounded-lg bg-green-100 border border-green-200 text-xs font-semibold text-green-700">
              {infoMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rohan Sharma"
                  className="block w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-slate-50/50 dark:bg-navy-light/20 text-sm text-navy dark:text-white focus:outline-none focus:border-saffron"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rohan@domain.in"
                  className="block w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-slate-50/50 dark:bg-navy-light/20 text-sm text-navy dark:text-white focus:outline-none focus:border-saffron"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-slate-50/50 dark:bg-navy-light/20 text-sm text-navy dark:text-white focus:outline-none focus:border-saffron"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-navy dark:bg-saffron text-white dark:text-navy hover:bg-navy-light dark:hover:bg-saffron-light font-bold text-sm shadow transition-colors flex items-center justify-center"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already registered?{" "}
            <Link href="/login" className="text-saffron hover:underline font-semibold">
              Log In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

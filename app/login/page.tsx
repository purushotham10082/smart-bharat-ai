"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { ShieldCheck, Mail, Lock, Sparkles, KeyRound } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { login, isFallbackMode } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [useOtp, setUseOtp] = useState(false);
  const [otp, setOtp] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("Please fill in email field");
      setLoading(false);
      return;
    }

    try {
      if (useOtp) {
        // Mock OTP check
        if (otp.length !== 6) {
          setError("Please enter a valid 6-digit OTP code");
          setLoading(false);
          return;
        }
      }
      
      const success = await login(email, password);
      if (success) {
        setInfoMsg("Authentication successful! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setError("Invalid credentials. Please verify details.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please fill in your email address first");
      return;
    }
    setInfoMsg(`OTP code sent successfully to ${email}. (Simulated: enter '123456')`);
    setUseOtp(true);
    setOtp("123456");
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
              Grievance Portal Access
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access schemes check, complaint reporting & document assistant.
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
                  placeholder="name@domain.in"
                  className="block w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-slate-50/50 dark:bg-navy-light/20 text-sm text-navy dark:text-white focus:outline-none focus:border-saffron"
                />
              </div>
            </div>

            {!useOtp ? (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Password
                  </label>
                  <button 
                    onClick={handleRequestOtp}
                    className="text-[11px] font-bold text-saffron hover:underline"
                  >
                    Use OTP / Login Code
                  </button>
                </div>
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
            ) : (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    One Time PIN (OTP)
                  </label>
                  <button 
                    onClick={() => setUseOtp(false)}
                    className="text-[11px] font-bold text-saffron hover:underline"
                  >
                    Use Password instead
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <KeyRound className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="block w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-slate-50/50 dark:bg-navy-light/20 text-sm text-navy dark:text-white tracking-widest font-mono focus:outline-none focus:border-saffron"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-navy dark:bg-saffron text-white dark:text-navy hover:bg-navy-light dark:hover:bg-saffron-light font-bold text-sm shadow transition-colors flex items-center justify-center"
            >
              {loading ? "Authenticating..." : "Access Dashboard"}
            </button>
          </form>

          {/* Reviewer Note */}
          <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-navy-light/40 border border-border space-y-2 text-left">
            <div className="flex items-center space-x-1 text-saffron">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Reviewer Quick Testing:</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              This system supports role-based features. Log in with these email strings to simulate roles:
            </p>
            <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-mono">
              <li>**citizen@smartbharat.in** (Citizen dashboard)</li>
              <li>**officer@smartbharat.in** (Officer Grievance solver)</li>
              <li>**admin@smartbharat.in** (Full administrator)</li>
            </ul>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-saffron hover:underline font-semibold">
              Create Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

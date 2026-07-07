"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { User, Mail, MapPin, Globe, Shield, Check, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];

export default function Profile() {
  const router = useRouter();
  const { user, updateProfile, loading } = useAuth();
  
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [lang, setLang] = useState("");
  
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      setName(user.name);
      setState(user.state || "Delhi");
      setLang(user.language || "en");
    }
  }, [user, loading, router]);

  const handleSave = async () => {
    setSuccessMsg("");
    const ok = await updateProfile({
      name,
      state,
      language: lang
    });
    if (ok) {
      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-navy dark:text-white">
        Loading profile details...
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Page Title */}
      <div className="text-left space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy dark:text-white">
          Citizen Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your personal credentials, digital location preferences, and regional translations.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-green-100 border border-green-200 text-xs font-semibold text-green-700 flex items-center">
          <Check className="h-4 w-4 mr-2" />
          {successMsg}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Avatar Card */}
        <div className="md:col-span-1 bg-card border border-border rounded-xl p-6 text-center space-y-4">
          <div className="mx-auto h-24 w-24 rounded-full bg-navy/5 border border-border flex items-center justify-center text-navy dark:text-saffron">
            <User className="h-12 w-12" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy dark:text-white">{user.name}</h2>
            <p className="text-xs text-slate-400 font-mono">{user.email}</p>
          </div>

          <div className="pt-4 border-t border-border flex flex-col items-center">
            <span className="inline-flex items-center rounded-full bg-saffron/10 border border-saffron/25 px-2.5 py-0.5 text-xs font-bold text-saffron uppercase">
              <Shield className="h-3 w-3 mr-1" />
              Role: {user.role}
            </span>
          </div>
        </div>

        {/* Right Side: Details Form */}
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="text-base font-bold text-navy dark:text-white">Account Details</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-saffron font-semibold hover:underline flex items-center space-x-1"
            >
              <Edit2 className="h-3 w-3" />
              <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
            </button>
          </div>

          <div className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-slate-50/50 dark:bg-navy-light/10 text-sm text-navy dark:text-white disabled:opacity-75 focus:outline-none focus:border-saffron"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="block w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-slate-100 dark:bg-navy-light/30 text-sm text-slate-500 cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Jurisdiction (State)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <select
                    disabled={!isEditing}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-slate-50/50 dark:bg-navy-light/10 text-sm text-navy dark:text-white disabled:opacity-75 focus:outline-none focus:border-saffron"
                  >
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Preferred Translation
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Globe className="h-4 w-4" />
                  </span>
                  <select
                    disabled={!isEditing}
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-slate-50/50 dark:bg-navy-light/10 text-sm text-navy dark:text-white disabled:opacity-75 focus:outline-none focus:border-saffron"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="te">Telugu</option>
                    <option value="ta">Tamil</option>
                    <option value="kn">Kannada</option>
                    <option value="ml">Malayalam</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-lg bg-navy dark:bg-saffron text-white dark:text-navy hover:bg-navy-light dark:hover:bg-saffron-light text-xs font-bold shadow transition-colors"
              >
                Save Profile Changes
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

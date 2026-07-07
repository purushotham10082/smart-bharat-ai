"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage, LANGUAGES, LanguageCode } from "@/context/lang-context";
import { useAuth } from "@/context/auth-context";
import { Menu, X, Globe, User, LogOut, Sun, Moon, Briefcase } from "lucide-react";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check dark mode preference
    const isDark = document.documentElement.classList.contains("dark") || 
                   localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const navItems = [
    { href: "/", labelKey: "navHome" },
    { href: "/services", labelKey: "navServices" },
    { href: "/schemes", labelKey: "navSchemes" },
    { href: "/complaints", labelKey: "navComplaints" },
    { href: "/resources", labelKey: "navResources" },
    { href: "/about", labelKey: "navAbout" },
  ];

  // If user is admin/officer, show admin/dashboard links too
  if (user) {
    navItems.splice(4, 0, { href: "/dashboard", labelKey: "navDashboard" });
    if (user.role === "admin" || user.role === "officer") {
      navItems.splice(5, 0, { href: "/admin", labelKey: "navAdmin" });
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border glass transition-all duration-300">
      {/* Tricolor border top for Government branding */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md border border-slate-100/80 shrink-0">
                {/* Official State Emblem of India */}
                <img 
                  src="/emblem.svg" 
                  alt="State Emblem of India" 
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#FF9933] dark:text-saffron-light">
                  Government of India
                </span>
                <span className="block text-lg font-bold tracking-tight text-navy dark:text-white">
                  Smart Bharat
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-saffron bg-[#FF9933]/10 dark:text-saffron-light dark:bg-saffron/10"
                      : "text-navy/80 hover:text-saffron dark:text-slate-200 dark:hover:text-saffron-light"
                  }`}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </div>

          {/* Right Header Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                onBlur={() => setTimeout(() => setLangOpen(false), 200)}
                className="flex items-center space-x-1 rounded-full p-2 text-navy/80 hover:bg-slate-200/50 dark:text-slate-200 dark:hover:bg-navy-light/50 transition-colors"
                title="Select Language"
              >
                <Globe className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase">
                  {language}
                </span>
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-card border border-border py-1 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 text-xs font-bold text-navy/50 dark:text-slate-400 border-b border-border">
                    Select Language
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-navy-light/40 flex justify-between items-center ${
                          language === lang.code
                            ? "text-saffron font-bold bg-[#FF9933]/5"
                            : "text-navy/80 dark:text-slate-200"
                        }`}
                      >
                        <span>{lang.nativeName}</span>
                        <span className="text-xs text-slate-400 font-normal">
                          {lang.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="rounded-full p-2 text-navy/80 hover:bg-slate-200/50 dark:text-slate-200 dark:hover:bg-navy-light/50 transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Authentication / Profile Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  onBlur={() => setTimeout(() => setProfileOpen(false), 200)}
                  className="flex items-center space-x-2 rounded-full border border-border bg-slate-100 dark:bg-navy-light px-3 py-1.5 text-sm font-medium hover:bg-slate-200 dark:hover:bg-navy-light/75 transition-colors"
                >
                  <User className="h-4 w-4 text-navy dark:text-white" />
                  <span className="max-w-[100px] truncate text-xs">
                    {user.name.split(" ")[0]}
                  </span>
                  {user.role !== "citizen" && (
                    <span className="inline-flex items-center rounded-full bg-[#FF9933]/15 px-1.5 py-0.5 text-[9px] font-bold text-saffron uppercase">
                      {user.role}
                    </span>
                  )}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-card border border-border py-1 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-navy dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-light/40"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-navy dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-light/40"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-navy-light/40 flex items-center space-x-2 border-t border-border"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t("logout")}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-navy-light dark:bg-saffron dark:text-navy dark:hover:bg-saffron-light transition-all"
              >
                {t("login")}
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggler */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="rounded-full p-2 text-navy/80 dark:text-slate-200"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-navy dark:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card/95 py-3 px-4 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-md px-3 py-2 text-base font-semibold ${
                    active
                      ? "text-saffron bg-[#FF9933]/10 dark:text-saffron-light"
                      : "text-navy/80 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-navy-light"
                  }`}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </div>

          {/* Mobile language picker and auth */}
          <div className="mt-4 border-t border-border pt-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-navy/60 dark:text-slate-400">Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="rounded-md border border-border bg-card px-2 py-1 text-sm text-navy dark:text-slate-200 focus:outline-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {user ? (
              <div className="flex items-center justify-between border-t border-border/50 pt-3">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 text-navy dark:text-white"
                >
                  <User className="h-5 w-5" />
                  <span className="font-semibold text-sm">{user.name}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="rounded-md px-3 py-1.5 text-sm border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50/10 flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t("logout")}</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center rounded-md bg-navy px-4 py-2.5 text-sm font-semibold text-white dark:bg-saffron dark:text-navy transition-all"
              >
                {t("login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

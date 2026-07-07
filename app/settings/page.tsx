"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/lang-context";
import { Eye, HelpCircle, Laptop, Settings as SettingsIcon, Volume2, Accessibility } from "lucide-react";

export default function Settings() {
  const { t } = useLanguage();
  
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [autoVoice, setAutoVoice] = useState(false);
  const [themeMode, setThemeMode] = useState("system");

  useEffect(() => {
    // Load accessibility settings from localStorage
    setHighContrast(localStorage.getItem("access_contrast") === "true");
    setLargeText(localStorage.getItem("access_large_text") === "true");
    setScreenReader(localStorage.getItem("access_screen_reader") === "true");
    setAutoVoice(localStorage.getItem("access_auto_voice") === "true");
    setThemeMode(localStorage.getItem("theme_mode") || "system");
  }, []);

  const handleToggleContrast = () => {
    const val = !highContrast;
    setHighContrast(val);
    localStorage.setItem("access_contrast", String(val));
    if (val) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  const handleToggleLargeText = () => {
    const val = !largeText;
    setLargeText(val);
    localStorage.setItem("access_large_text", String(val));
    if (val) {
      document.documentElement.style.fontSize = "18px";
    } else {
      document.documentElement.style.fontSize = "16px";
    }
  };

  const handleToggleScreenReader = () => {
    const val = !screenReader;
    setScreenReader(val);
    localStorage.setItem("access_screen_reader", String(val));
  };

  const handleToggleAutoVoice = () => {
    const val = !autoVoice;
    setAutoVoice(val);
    localStorage.setItem("access_auto_voice", String(val));
  };

  const handleThemeChange = (mode: string) => {
    setThemeMode(mode);
    localStorage.setItem("theme_mode", mode);
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else if (mode === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System choice
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy dark:text-white flex items-center space-x-2">
          <SettingsIcon className="h-7 w-7 text-saffron" />
          <span>Platform Settings</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Personalize user interface scaling, themes, and screen reader configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Summary Card */}
        <div className="md:col-span-1 bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="p-3 bg-saffron/10 text-saffron rounded-lg w-max">
            <Accessibility className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy dark:text-white">Accessibility Focus</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
              Smart Bharat is fully WCAG AA compliant. Adjust colors and scaling to match screen reader compatibility.
            </p>
          </div>
        </div>

        {/* Right Side: Options Form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Section 1: Themes */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-navy dark:text-white border-b border-border pb-2 flex items-center space-x-2">
              <Laptop className="h-4 w-4 text-slate-400" />
              <span>Theme Preference</span>
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {["light", "dark", "system"].map((m) => (
                <button
                  key={m}
                  onClick={() => handleThemeChange(m)}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
                    themeMode === m
                      ? "bg-navy text-white border-navy dark:bg-saffron dark:text-navy dark:border-saffron shadow-sm"
                      : "bg-slate-50/50 hover:bg-slate-100 border-border text-slate-500 dark:bg-navy-light/10 dark:text-slate-300"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Visual Adjustments */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-navy dark:text-white border-b border-border pb-2 flex items-center space-x-2">
              <Eye className="h-4 w-4 text-slate-400" />
              <span>Visual Adjustments</span>
            </h3>

            <div className="space-y-4">
              {/* High Contrast Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-sm font-semibold text-navy dark:text-white">High Contrast Mode</span>
                  <span className="block text-xs text-slate-400">Increase color difference for readability.</span>
                </div>
                <button
                  onClick={handleToggleContrast}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                    highContrast ? "bg-green-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute transition-all ${
                      highContrast ? "left-6" : "left-1"
                    }`}
                  ></span>
                </button>
              </div>

              {/* Large Text Mode */}
              <div className="flex items-center justify-between border-t border-border/50 pt-4">
                <div>
                  <span className="block text-sm font-semibold text-navy dark:text-white">Large Text Scaling</span>
                  <span className="block text-xs text-slate-400">Increase base text size to 18px.</span>
                </div>
                <button
                  onClick={handleToggleLargeText}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                    largeText ? "bg-green-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute transition-all ${
                      largeText ? "left-6" : "left-1"
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Speech Adjustments */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-navy dark:text-white border-b border-border pb-2 flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-slate-400" />
              <span>Speech & Navigation</span>
            </h3>

            <div className="space-y-4">
              {/* Voice Assist Automatic Reading */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-sm font-semibold text-navy dark:text-white">Auto Response Speech</span>
                  <span className="block text-xs text-slate-400">Automatically read incoming AI messages aloud.</span>
                </div>
                <button
                  onClick={handleToggleAutoVoice}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                    autoVoice ? "bg-green-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute transition-all ${
                      autoVoice ? "left-6" : "left-1"
                    }`}
                  ></span>
                </button>
              </div>

              {/* Screen Reader optimizations */}
              <div className="flex items-center justify-between border-t border-border/50 pt-4">
                <div>
                  <span className="block text-sm font-semibold text-navy dark:text-white">Screen Reader Optimization</span>
                  <span className="block text-xs text-slate-400">Enhance element focus borders and aria descriptions.</span>
                </div>
                <button
                  onClick={handleToggleScreenReader}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                    screenReader ? "bg-green-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute transition-all ${
                      screenReader ? "left-6" : "left-1"
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

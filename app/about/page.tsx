"use client";

import React from "react";
import { Award, ShieldCheck, Flame, Cpu, Layout } from "lucide-react";

export default function About() {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      
      {/* Title */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy dark:text-white">
          About Smart Bharat
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          A prototype for the next-generation conversational interface for Indian citizen welfare.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        <div className="bg-card border border-border p-6 rounded-xl space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 text-navy dark:text-white">
            <Award className="h-5 w-5 text-saffron shrink-0" />
            <h3 className="font-bold text-base">National Mission & Objective</h3>
          </div>
          
          <p>
            **Smart Bharat** was designed to bridge the accessibility gap between complex bureaucratic administrative codes and the general public. Modern civic systems offer hundreds of state and central schemes, but identifying eligibility, gathering documents, and filing complaints can be challenging for rural and urban citizens alike.
          </p>
          <p>
            By combining **Google Gemini Multimodal AI** models with simple layouts and offline fallback local storage protocols, Smart Bharat simulates how citizen services can be centralized into a single conversation stream.
          </p>
        </div>

        {/* Features block */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card border border-border p-4 rounded-lg space-y-2">
            <Cpu className="h-5 w-5 text-saffron" />
            <span className="block font-bold text-navy dark:text-white">Generative AI</span>
            <p className="text-[11px] leading-relaxed">
              Leverages Google Gemini API to translate guidelines, predict eligibility, and categorize complaints.
            </p>
          </div>

          <div className="bg-card border border-border p-4 rounded-lg space-y-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <span className="block font-bold text-navy dark:text-white">Secured Datastore</span>
            <p className="text-[11px] leading-relaxed">
              Integrates Supabase auth protocols, custom relational DB indexes, and local encrypted session buffers.
            </p>
          </div>

          <div className="bg-card border border-border p-4 rounded-lg space-y-2">
            <Layout className="h-5 w-5 text-blue-500" />
            <span className="block font-bold text-navy dark:text-white">Fluid Interface</span>
            <p className="text-[11px] leading-relaxed">
              Uses Framer Motion triggers, Tailwind custom properties, and Radix accessibility schemas for screen readers.
            </p>
          </div>
        </div>

        {/* Hackathon Features list */}
        <div className="bg-slate-100 dark:bg-navy-light/20 border border-border p-5 rounded-xl space-y-3">
          <span className="font-bold text-navy dark:text-white text-xs block flex items-center">
            <Flame className="h-4.5 w-4.5 text-red-500 mr-1" />
            <span>Hackathon-Grade Impact Benchmarks:</span>
          </span>
          <ul className="list-disc list-inside space-y-1.5 text-[11px]">
            <li>**Multilingual Dialect Adaptability:** Integrates 10 language contexts natively.</li>
            <li>**Zero-Infrastructure OCR:** Multimodal Gemini analysis extracts text and flags document validation properties.</li>
            <li>**AI-Powered Triaging:** Local auto-classification sorts local grievances to the PWD/DISCOM.</li>
            <li>**Audio Web Accessibility:** Voice-recognition STT and native vocal synthesis synthesis engines.</li>
          </ul>
        </div>
      </div>

    </div>
  );
}

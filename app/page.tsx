"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/lang-context";
import { 
  MessageSquareCode, 
  FileText, 
  Search, 
  AlertTriangle, 
  ClipboardList, 
  MapPin, 
  PhoneCall, 
  ChevronRight, 
  Sparkles, 
  Languages, 
  ShieldCheck, 
  Users 
} from "lucide-react";

export default function Home() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const services = [
    {
      icon: <MessageSquareCode className="h-6 w-6 text-saffron" />,
      titleKey: "homeCardAssistantTitle",
      descKey: "homeCardAssistantDesc",
      link: "/chat"
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      titleKey: "homeCardReportTitle",
      descKey: "homeCardReportDesc",
      link: "/report"
    },
    {
      icon: <ClipboardList className="h-6 w-6 text-green-600" />,
      titleKey: "homeCardTrackerTitle",
      descKey: "homeCardTrackerDesc",
      link: "/complaints"
    },
    {
      icon: <Search className="h-6 w-6 text-blue-500" />,
      titleKey: "homeCardSchemesTitle",
      descKey: "homeCardSchemesDesc",
      link: "/schemes"
    },
    {
      icon: <FileText className="h-6 w-6 text-purple-500" />,
      titleKey: "homeCardOcrTitle",
      descKey: "homeCardOcrDesc",
      link: "/chat?ocr=true"
    },
    {
      icon: <MapPin className="h-6 w-6 text-orange-500" />,
      titleKey: "homeCardOfficesTitle",
      descKey: "homeCardOfficesDesc",
      link: "/resources#offices"
    }
  ];

  return (
    <div className="flex-1 w-full relative overflow-hidden bg-slate-50 dark:bg-[#051026]">
      {/* Background visual graphics */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF9933]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#138808]/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
        
        {/* India Gate / Taj Mahal / Red Fort National Banner Slider */}
        <div className="relative mb-12 rounded-2xl overflow-hidden border border-border shadow-lg h-48 sm:h-56 md:h-64 flex items-center px-8 sm:px-12 text-left">
          
          {/* Background Slide Images with Cross-fade */}
          <div className="absolute inset-0 z-0">
            {["/india_gate_banner.jpg", "/taj_mahal_banner.jpg", "/red_fort_banner.jpg"].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: currentSlide === i ? 1 : 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(to right, rgba(11, 31, 77, 0.95) 45%, rgba(11, 31, 77, 0.3) 100%), url('${img}')` }}
              />
            ))}
          </div>

          {/* Slogan Text Overlay */}
          <div className="max-w-md space-y-2 z-10 text-white">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
              {t("bannerTitle").split("।")[0] || t("bannerTitle").split(".")[0]}.
              <span className="block text-saffron">
                {t("bannerTitle").split("।")[1] || t("bannerTitle").split(".")[1] || "Simplifying Governance."}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              {t("bannerSub")}
            </p>
          </div>
          
          {/* Slide Indicator Dots */}
          <div className="absolute bottom-4 right-6 flex space-x-2 z-10">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 w-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? "bg-saffron w-4" : "bg-white/40"
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 rounded-full bg-[#FF9933]/10 border border-[#FF9933]/25 px-3 py-1 text-xs font-semibold text-saffron"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t("heroSub")}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight text-navy dark:text-white sm:text-5xl md:text-6xl"
            >
              {t("heroTitle")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base text-slate-600 dark:text-slate-300 sm:text-lg max-w-lg leading-relaxed"
            >
              {t("heroDesc")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-navy-light dark:bg-saffron dark:text-navy dark:hover:bg-saffron-light transition-all duration-300"
              >
                {t("btnStartChat")}
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-navy dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-light/40 transition-all duration-300"
              >
                {t("btnExploreServices")}
              </Link>
            </motion.div>
          </div>

          {/* Right Side: Glassmorphic AI Dashboard Preview */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative mx-auto w-full max-w-lg rounded-2xl border border-border/40 glass-premium p-6 shadow-2xl overflow-hidden"
            >
              {/* Header bar */}
              <div className="flex items-center justify-between border-b border-border/30 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-400 uppercase">
                  {t("heroPreviewStatus")}
                </div>
              </div>

              {/* Chat Simulation Area */}
              <div className="space-y-4 min-h-[220px] flex flex-col justify-end text-xs">
                
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="rounded-lg bg-saffron/10 border border-saffron/20 px-3 py-2 text-navy dark:text-slate-200 max-w-[80%]">
                    How do I renew my driving license online?
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex items-start space-x-2">
                  <div className="h-7 w-7 rounded-full bg-navy border border-slate-200 flex items-center justify-center text-[10px] text-white font-bold">
                    SB
                  </div>
                  <div className="rounded-lg bg-slate-100 dark:bg-navy-light/60 border border-border/20 px-3 py-2.5 text-navy dark:text-slate-200 max-w-[85%] space-y-1.5">
                    <p className="font-semibold text-xs text-saffron">Smart Bharat AI Assistant</p>
                    <p>To renew your Driving License (DL) online in India:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <li>Visit the official portal **[sarathi.parivahan.gov.in](https://sarathi.parivahan.gov.in)**.</li>
                      <li>Select your State & choose **"Apply for DL Renewal"**.</li>
                      <li>Upload your old DL copy, address proof, and **Form 1A (Medical Certificate)** if over 40 years.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Input Mock */}
              <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-2 w-full">
                  <div className="h-8 w-full bg-slate-100 dark:bg-navy-light/50 border border-border/20 rounded-md px-3 flex items-center justify-start text-[11px]">
                    {t("heroPreviewPlaceholder")}
                  </div>
                  <button className="h-8 w-8 rounded-md bg-navy dark:bg-saffron text-white dark:text-navy flex items-center justify-center shrink-0">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>



            {/* Floating Card 2: Resolution Rate */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-card text-navy dark:text-white border border-border p-3.5 rounded-xl shadow-lg flex items-center space-x-3 hidden sm:flex"
            >
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-600 dark:text-green-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs text-slate-400">Resolution Rate</span>
                <span className="block text-sm font-extrabold tracking-tight text-green-600 dark:text-green-400">94.8% Solved</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Services Grid Section */}
      <section className="bg-white dark:bg-navy-dark border-y border-border py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-navy dark:text-white">
              {t("homeDirTitle")}
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">
              {t("homeDirSub")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)" }}
                className="bg-slate-50 dark:bg-navy-light/20 border border-border/60 hover:border-saffron/30 rounded-xl p-6 transition-all duration-300 text-left flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="p-2 bg-white dark:bg-navy-light border border-slate-100 dark:border-border/30 rounded-lg w-max shadow-sm">
                    {srv.icon}
                  </div>
                  <h3 className="text-lg font-bold text-navy dark:text-white">
                    {t(srv.titleKey)}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    {t(srv.descKey)}
                  </p>
                </div>
                
                <div className="pt-4 mt-2">
                  <Link
                    href={srv.link}
                    className="inline-flex items-center text-xs font-semibold text-navy dark:text-saffron-light hover:text-saffron transition-colors"
                  >
                    <span>{t("homeLaunchService")}</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Emergency Call-Out SOS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
          <div className="space-y-2 z-10 text-left">
            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
              Emergency SOS Helpdesk
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Access Instant Helpline Numbers
            </h2>
            <p className="text-white/80 text-xs sm:text-sm max-w-md">
              Need police, fire brigade, women's cell, or disaster response? Access single-tap dial tools and nearby locations instantly.
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex gap-4 shrink-0 z-10">
            <Link
              href="/resources#emergency"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-red-600 shadow-sm hover:bg-slate-100 transition-colors"
            >
              <PhoneCall className="h-4 w-4 mr-2" />
              <span>Show Helplines</span>
            </Link>
          </div>
          
          {/* Backdrop graphic */}
          <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
        </div>
      </section>
    </div>
  );
}

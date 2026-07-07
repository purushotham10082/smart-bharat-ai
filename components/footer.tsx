"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, Award } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-slate-900 text-slate-300 py-12 px-4 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Government branding */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full border border-dashed border-saffron flex items-center justify-center">
                <div className="h-1 w-1 rounded-full bg-saffron"></div>
              </div>
              <span className="font-bold text-white tracking-wider text-sm uppercase">
                Digital India Initiative
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              **Smart Bharat** is an AI-powered conversational civic companion designed to simplify accessibility of Indian Government schemes, certificates, licenses, and local civic grievance filing.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-saffron transition-colors" title="Twitter">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-saffron transition-colors" title="Facebook">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-saffron transition-colors" title="YouTube">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Key links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Resources & Help
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/resources" className="hover:text-saffron transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-saffron transition-colors">
                  About Smart Bharat
                </Link>
              </li>
              <li>
                <a href="https://india.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-saffron transition-colors">
                  National Portal (india.gov.in)
                </a>
              </li>
              <li>
                <a href="https://mygov.in" target="_blank" rel="noopener noreferrer" className="hover:text-saffron transition-colors">
                  MyGov Platform (mygov.in)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Compliance & Legal
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-saffron transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-saffron transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-saffron transition-colors">
                  Accessibility Statement
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-saffron transition-colors">
                  Contact Grievance Officer
                </a>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Disclaimer section */}
        <div className="mt-8 border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400 space-y-4 md:space-y-0">
          <div className="flex items-start space-x-2 max-w-3xl">
            <ShieldAlert className="h-4 w-4 text-saffron shrink-0 mt-0.5" />
            <p className="leading-normal">
              **Disclaimer:** This is a simulated national AI Civic Companion platform. It represents a demonstration concept. The suggestions, schedules, and calculations are mock-supported for hackathon illustration and development evaluations. For actual operations, please register on the official websites of the respective Ministries.
            </p>
          </div>
          
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <Award className="h-4 w-4 text-green-500" />
            <span>Digital India © {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

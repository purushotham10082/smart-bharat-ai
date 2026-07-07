"use client";

import React, { useState } from "react";
import { 
  PhoneCall, 
  FileDown, 
  MapPin, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert 
} from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS_DATABASE: FAQItem[] = [
  {
    q: "How long does it take to get a birth certificate registered?",
    a: "If the application is filed within 21 days of birth at the local registrar (municipality or block office), it is typically processed within 7 to 10 working days. Late registrations (after 21 days) require an affidavit, late fee, and approval from the magistrate, taking 15 to 30 days."
  },
  {
    q: "Can I update my Aadhaar phone number online?",
    a: "No. For security and biometric verification, updates to mobile numbers, email IDs, and fingerprints must be done in person at a registered Aadhaar Seva Kendra. Demographic details like address can be updated online if your current number is linked to receive OTPs."
  },
  {
    q: "What should I do if my civic complaint is not resolved?",
    a: "Municipal complaints filed on Smart Bharat are routed directly to departmental lines. If a complaint is not resolved within the estimated timeline, it is automatically escalated to the Grievance Officer of the local municipality. You will receive real-time notifications on the tracker."
  },
  {
    q: "Is there a fee for applying for a government scheme?",
    a: "Government welfare programs and schemes (like PMAY, PM Kisan, and Ayushman Bharat) are entirely free to apply. Never pay any fee to agents. Only formal registration fees apply for licenses or passports on official gateways."
  }
];

const EMERGENCY_NUMBERS = [
  { service: "National Emergency Number", number: "112", desc: "All-in-one emergency response line." },
  { service: "Police Control Room", number: "100", desc: "Local police response dispatch." },
  { service: "Fire Brigade Helpline", number: "101", desc: "Fire department emergencies." },
  { service: "Ambulance Services", number: "102", desc: "Medical emergencies and trauma." },
  { service: "Women's Helpline", number: "1091", desc: "Domestic safety and assistance support." },
  { service: "National Cyber Crime", number: "1930", desc: "Reporting online fraud and scams." },
  { service: "National Disaster Response", number: "1078", desc: "NDRF flood/earthquake response." }
];

const DOWNLOADS = [
  { name: "Aadhaar Demographic Update Form", size: "35 KB", type: "PDF", link: "/forms/aadhaar_update_form.pdf" },
  { name: "Form 1: Birth Registration Form", size: "28 KB", type: "PDF", link: "/forms/birth_registration_form.pdf" },
  { name: "Form 1A: Medical Certificate (DL)", size: "24 KB", type: "PDF", link: "/forms/medical_certificate_form.pdf" },
  { name: "Passport Verification Document Checklist", size: "30 KB", type: "PDF", link: "/forms/passport_checklist_form.pdf" }
];

export default function Resources() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12 text-left">
      
      {/* Title */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy dark:text-white">
          Civic Resources & SOS Directory
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Access emergency helplines, download official application PDF templates, and read civic tutorials.
        </p>
      </div>

      {/* Grid for Helplines and Downloads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SOS Emergency (7 cols) */}
        <div id="emergency" className="lg:col-span-7 space-y-6">
          <div className="flex items-center space-x-2 text-red-600">
            <PhoneCall className="h-5 w-5 shrink-0" />
            <h2 className="text-xl font-bold tracking-tight">Emergency SOS Helplines</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EMERGENCY_NUMBERS.map((sos, i) => (
              <div
                key={i}
                className="bg-card border border-red-200/50 dark:border-red-900/30 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow transition-shadow"
              >
                <div className="space-y-0.5 text-xs text-left">
                  <span className="block font-bold text-navy dark:text-white">{sos.service}</span>
                  <span className="block text-slate-400 text-[11px]">{sos.desc}</span>
                </div>
                <a
                  href={`tel:${sos.number}`}
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-extrabold flex items-center space-x-1 shrink-0"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>{sos.number}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Forms Downloads (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center space-x-2 text-navy dark:text-saffron">
            <FileDown className="h-5 w-5 shrink-0" />
            <h2 className="text-xl font-bold tracking-tight">Official Form Templates</h2>
          </div>

          <div className="bg-card border border-border rounded-xl divide-y divide-border/60 overflow-hidden shadow-sm">
            {DOWNLOADS.map((doc, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-navy-light/10">
                <div className="space-y-0.5 text-left">
                  <span className="block font-bold text-navy dark:text-white">{doc.name}</span>
                  <span className="block text-slate-400 text-[10px] uppercase font-bold">{doc.type} • {doc.size}</span>
                </div>
                <a
                  href={doc.link}
                  download={doc.link.split("/").pop()}
                  className="p-2 rounded-lg border border-border bg-slate-50/50 hover:bg-slate-100 dark:bg-navy-light/10 text-slate-500 hover:text-navy dark:text-slate-200 transition-colors flex items-center justify-center shrink-0"
                  title="Download File"
                >
                  <FileDown className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Accordion FAQ Area */}
      <div className="space-y-6 border-t border-border pt-10">
        <div className="flex items-center space-x-2 text-navy dark:text-saffron">
          <HelpCircle className="h-5 w-5 shrink-0" />
          <h2 className="text-xl font-bold tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4 max-w-4xl">
          {FAQS_DATABASE.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <div
                  onClick={() => toggleFaq(idx)}
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-navy-light/10"
                >
                  <span className="text-sm font-bold text-navy dark:text-white text-left leading-normal">{faq.q}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" /> : <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />}
                </div>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-slate-500 dark:text-slate-400 border-t border-border/40 text-left leading-relaxed animate-in slide-in-from-top-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Offices locator */}
      <div id="offices" className="bg-slate-100 dark:bg-navy-light/20 border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-2 text-navy dark:text-white">
          <MapPin className="h-5 w-5 text-red-500 shrink-0" />
          <h3 className="font-bold text-base">Municipal Offices Directories (Central Delhi Region)</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-card p-4 rounded-lg border border-border/60">
            <span className="block font-bold text-navy dark:text-white">Passport Seva Kendra</span>
            <p className="text-slate-400 text-[11px] mt-1 leading-normal">
              Shalimar Place, Outer Ring Rd, District Center, Delhi 110088.
            </p>
            <span className="block text-[10px] text-saffron font-bold mt-2">Hours: 9 AM - 4 PM</span>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border/60">
            <span className="block font-bold text-navy dark:text-white">Aadhaar Seva Kendra</span>
            <p className="text-slate-400 text-[11px] mt-1 leading-normal">
              Metro Station Complex, Ground Floor, Dwarka Sec-12, Delhi 110075.
            </p>
            <span className="block text-[10px] text-saffron font-bold mt-2">Hours: 9 AM - 6 PM</span>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border/60">
            <span className="block font-bold text-navy dark:text-white">Municipal Corporation (MCD)</span>
            <p className="text-slate-400 text-[11px] mt-1 leading-normal">
              Civic Centre, Minto Road, Block-A, Ward 12, Delhi 110002.
            </p>
            <span className="block text-[10px] text-saffron font-bold mt-2">Hours: 10 AM - 5 PM</span>
          </div>
        </div>
      </div>

    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/lang-context";
import { 
  ClipboardList, 
  Clock, 
  MapPin, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Search,
  ChevronDown,
  ChevronUp,
  FileBadge
} from "lucide-react";

interface TimelineEvent {
  status: string;
  date: string;
  note: string;
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  imageUrl?: string | null;
  department: string;
  urgency: string;
  status: "Pending" | "In Progress" | "Resolved";
  date: string;
  timeline: TimelineEvent[];
  officerRemarks?: string;
  resolutionDate?: string;
}

const SEEDED_COMPLAINTS: Complaint[] = [
  {
    id: "GRIEV-891045",
    title: "Large pothole blocking primary school gate",
    description: "There is a massive pothole right outside the main gate of Government Sr. Sec. School in Sector 14. Water accumulates in it during rains, causing massive hazards to children.",
    category: "Roads",
    location: "Lat: 28.6284, Lng: 77.2189 (Sector 14, B-Block)",
    department: "Public Works Department (PWD)",
    urgency: "High",
    status: "In Progress",
    date: "02/07/2026",
    timeline: [
      { status: "Grievance Logged", date: "02/07/2026", note: "Filed by citizen via Smart Bharat." },
      { status: "Assigned to PWD Inspector", date: "03/07/2026", note: "Allocated to Inspector Vijay Kumar." },
      { status: "Work Scheduled", date: "05/07/2026", note: "Gravel filling scheduled for next working week." }
    ],
    officerRemarks: "Inspected. Pothole filling crew dispatched. Repair work scheduled to complete by Friday.",
    resolutionDate: "09/07/2026"
  },
  {
    id: "GRIEV-714092",
    title: "No water supply in block C since 2 days",
    description: "Drinking water supply has stopped completely in C-Block since Wednesday morning. No warning or notice was issued by the board.",
    category: "Water",
    location: "Lat: 28.5945, Lng: 77.1890 (C-Block, Dwarka)",
    department: "Municipal Water Board (Jal Board)",
    urgency: "High",
    status: "Resolved",
    date: "29/06/2026",
    timeline: [
      { status: "Grievance Logged", date: "29/06/2026", note: "Filed by citizen via Smart Bharat." },
      { status: "Assigned to Technician", date: "29/06/2026", note: "Pipeline leak investigation started." },
      { status: "Leak Repaired", date: "30/06/2026", note: "Main conduit valve replaced. Supply restored." }
    ],
    officerRemarks: "Main feeder valve ruptured due to high pressure. Replaced and verified pressure. Water supply restored to Block C.",
    resolutionDate: "30/06/2026"
  }
];

export default function Complaints() {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const loadComplaints = () => {
      const stored = localStorage.getItem("smart_bharat_complaints");
      let storedList: Complaint[] = [];
      if (stored) {
        try {
          storedList = JSON.parse(stored);
        } catch (e) {}
      }
      
      // If no stored complaints, seed with our default examples
      if (storedList.length === 0) {
        setComplaints(SEEDED_COMPLAINTS);
        localStorage.setItem("smart_bharat_complaints", JSON.stringify(SEEDED_COMPLAINTS));
      } else {
        // Merge stored with seeded to show full dashboard
        setComplaints(storedList);
      }
    };

    loadComplaints();
  }, []);

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filtered = complaints.filter((c) => {
    return c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           c.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
           c.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    if (status === "Resolved") return "bg-green-100 text-green-700 border-green-200";
    if (status === "In Progress") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-navy dark:text-white font-bold animate-pulse">
        Checking authentication status...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 w-full max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="p-6 bg-slate-50 dark:bg-navy-light/10 border border-border rounded-2xl shadow-md text-navy dark:text-slate-300">
          <AlertCircle className="mx-auto h-12 w-12 mb-3 text-saffron" />
          <h2 className="text-lg font-bold">Sign In Required</h2>
          <p className="text-sm mt-1 leading-normal text-slate-500">
            Please sign in to your Smart Bharat account to view, track, or manage your registered civic complaints.
          </p>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="px-5 py-2.5 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy-light cursor-pointer"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy dark:text-white">
            {t("myComplaintsTitle")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track status timelines, municipal officer replies, and resolution estimations.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/report"
            className="inline-flex items-center justify-center rounded-lg bg-navy dark:bg-saffron text-white dark:text-navy px-4 py-2 text-xs font-bold shadow-sm hover:bg-navy-light dark:hover:bg-saffron-light"
          >
            File New Complaint
          </Link>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md w-full">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Complaint ID, Title or Category..."
          className="block w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-card text-sm text-navy dark:text-white focus:outline-none focus:border-saffron"
        />
      </div>

      {/* Grievances List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((c) => {
            const isExpanded = expandedId === c.id;
            return (
              <div
                key={c.id}
                className="bg-card border border-border rounded-xl shadow-sm hover:shadow transition-shadow overflow-hidden"
              >
                {/* Header Summary Tab */}
                <div
                  onClick={() => handleToggleExpand(c.id)}
                  className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-navy-light/10"
                >
                  <div className="space-y-1 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-slate-400 font-mono">{c.id}</span>
                      <span className="inline-flex items-center rounded-full bg-navy/5 dark:bg-navy-light px-2 py-0.5 text-[9px] font-bold text-navy dark:text-saffron uppercase tracking-wider">
                        {c.category}
                      </span>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${getStatusColor(c.status)}`}>
                        {c.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-navy dark:text-white leading-normal">
                      {c.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-4 self-end sm:self-auto text-xs text-slate-400 shrink-0">
                    <span className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {c.date}
                    </span>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>

                {/* Expanded Details Pane */}
                {isExpanded && (
                  <div className="border-t border-border px-6 py-6 bg-slate-50/50 dark:bg-navy-light/5 text-left grid grid-cols-1 md:grid-cols-12 gap-8 animate-in slide-in-from-top-2 duration-150">
                    
                    {/* Left: details & Remarks */}
                    <div className="md:col-span-7 space-y-4 text-xs">
                      <div>
                        <span className="block font-bold text-navy dark:text-white mb-1">Details & Context:</span>
                        <p className="text-slate-500 dark:text-slate-400 leading-normal">{c.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block font-bold text-navy dark:text-white mb-0.5">Assigned Department:</span>
                          <span className="text-slate-500">{c.department}</span>
                        </div>
                        <div>
                          <span className="block font-bold text-navy dark:text-white mb-0.5">Assigned Urgency:</span>
                          <span className={`inline-block font-semibold ${
                            c.urgency === "High" ? "text-red-500" : c.urgency === "Medium" ? "text-orange-500" : "text-blue-500"
                          }`}>
                            {c.urgency} Priority
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-1.5 text-slate-500">
                        <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <span>**Location:** {c.location}</span>
                      </div>

                      {c.imageUrl && (
                        <div className="space-y-1">
                          <span className="block font-bold text-navy dark:text-white mb-1">Citizen Uploaded Image:</span>
                          <div className="h-28 w-44 rounded-lg overflow-hidden border border-border bg-slate-100 shadow-inner">
                            <img src={c.imageUrl} alt="Proof upload" className="object-cover h-full w-full" />
                          </div>
                        </div>
                      )}

                      {/* Officer Remarks */}
                      {c.officerRemarks && (
                        <div className="p-3.5 bg-saffron/10 border border-saffron/20 rounded-lg space-y-1">
                          <span className="font-bold text-navy dark:text-white flex items-center">
                            <UserCheck className="h-4 w-4 text-saffron mr-1" />
                            <span>Municipal Officer Remarks:</span>
                          </span>
                          <p className="text-slate-600 dark:text-slate-300 leading-normal">{c.officerRemarks}</p>
                          {c.resolutionDate && (
                            <span className="block text-[10px] text-slate-400 font-bold mt-1">
                              Estimated/Actual Resolution: {c.resolutionDate}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: progress timeline */}
                    <div className="md:col-span-5 space-y-4">
                      <span className="block font-bold text-navy dark:text-white text-xs border-b border-border pb-1.5">
                        Investigation Status Timeline
                      </span>
                      
                      <div className="space-y-4 relative pl-4 before:absolute before:inset-y-1 before:left-1.5 before:w-0.5 before:bg-border">
                        {c.timeline.map((evt, i) => {
                          const isLast = i === c.timeline.length - 1;
                          return (
                            <div key={i} className="relative text-left space-y-0.5">
                              {/* Dot */}
                              <span className={`absolute -left-[14px] top-1.5 h-3.5 w-3.5 rounded-full border border-white flex items-center justify-center ${
                                isLast ? "bg-[#138808] text-white" : "bg-slate-300 text-slate-400"
                              }`}>
                                {isLast && <CheckCircle2 className="h-3 w-3" />}
                              </span>
                              <span className="block font-bold text-navy dark:text-white text-xs">{evt.status}</span>
                              <span className="block text-[10px] text-slate-400 font-bold">{evt.date}</span>
                              <p className="text-[11px] text-slate-500 leading-normal">{evt.note}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500 bg-card border border-border rounded-xl">
          <HelpCircle className="mx-auto h-8 w-8 mb-2 text-slate-400" />
          <p className="text-sm">No complaints found. File a complaint to begin tracking.</p>
        </div>
      )}

    </div>
  );
}

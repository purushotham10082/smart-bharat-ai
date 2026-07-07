"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { 
  User, 
  Bookmark, 
  AlertTriangle, 
  CheckSquare, 
  Bell, 
  Calendar, 
  ChevronRight, 
  Sparkles,
  ClipboardCheck,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";

interface BookmarkScheme {
  id: string;
  name: string;
  category: string;
}

interface UserComplaint {
  id: string;
  title: string;
  status: string;
  date: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [bookmarks, setBookmarks] = useState<BookmarkScheme[]>([]);
  const [complaints, setComplaints] = useState<UserComplaint[]>([]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Grievance Pothole repair updated to 'In Progress'", date: "Today" },
    { id: 2, text: "Your Aadhaar check extraction was verified via OCR", date: "Yesterday" },
    { id: 3, text: "New guidelines released for PM Awas Scheme eligibility", date: "3 days ago" }
  ]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    // Load saved bookmarks and active complaints
    const saved = localStorage.getItem("smart_bharat_bookmarks");
    if (saved) {
      try {
        const ids: string[] = JSON.parse(saved);
        // Map back to scheme detail mocks
        const list = ids.map((id) => {
          if (id === "ayushman-bharat") return { id, name: "Ayushman Bharat PM-JAY", category: "Healthcare" };
          if (id === "pmay-housing") return { id, name: "Pradhan Mantri Awas Yojana", category: "Housing" };
          if (id === "pm-kisan") return { id, name: "PM Kisan Samman Nidhi", category: "Agriculture" };
          return { id, name: id.replace("-", " ").toUpperCase(), category: "Welfare" };
        });
        setBookmarks(list);
      } catch (e) {}
    }

    const storedGrievances = localStorage.getItem("smart_bharat_complaints");
    if (storedGrievances) {
      try {
        const list = JSON.parse(storedGrievances);
        setComplaints(list.slice(0, 3)); // show top 3
      } catch (e) {}
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-navy dark:text-white">
        Loading citizen dashboard...
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      
      {/* Greetings banner */}
      <div className="rounded-2xl bg-gradient-to-r from-navy to-navy-light text-white p-6 sm:p-8 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center space-x-1 rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
            <Sparkles className="h-3 w-3 text-saffron mr-1" />
            <span>Digital Identity Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Namaste, {user.name}
          </h1>
          <p className="text-white/80 text-xs sm:text-sm">
            Welcome to your Smart Bharat workspace. Monitor welfare bookmarks and track civic tasks.
          </p>
        </div>

        <div className="flex space-x-2 shrink-0 z-10 text-xs">
          <Link
            href="/chat"
            className="px-4 py-2 bg-saffron text-navy font-bold rounded-lg hover:bg-saffron-light transition-colors"
          >
            Open AI Companion
          </Link>
        </div>

        {/* Backdrop shape */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-[70px] pointer-events-none"></div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Complaints and Bookmarks (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Active Grievances */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h2 className="text-base font-bold text-navy dark:text-white flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-saffron shrink-0" />
                <span>My Active Grievances</span>
              </h2>
              <Link href="/complaints" className="text-xs font-semibold text-saffron hover:underline">
                View Tracker
              </Link>
            </div>

            {complaints.length > 0 ? (
              <div className="divide-y divide-border/60">
                {complaints.map((c) => (
                  <div key={c.id} className="py-3 flex justify-between items-center text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-navy dark:text-white hover:underline block">{c.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {c.id} • Filed: {c.date}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                      c.status === "Resolved" ? "bg-green-100 text-green-700" : c.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-2">No active complaints. You can report infrastructure bugs on our filing form.</p>
            )}
          </div>

          {/* Bookmarked Schemes */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h2 className="text-base font-bold text-navy dark:text-white flex items-center space-x-2">
                <Bookmark className="h-5 w-5 text-saffron shrink-0" />
                <span>Bookmarked Schemes</span>
              </h2>
              <Link href="/schemes" className="text-xs font-semibold text-saffron hover:underline">
                Find Schemes
              </Link>
            </div>

            {bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bookmarks.map((b) => (
                  <div key={b.id} className="p-3 border border-border rounded-lg bg-slate-50/50 dark:bg-navy-light/10 flex justify-between items-start">
                    <div className="space-y-0.5 text-xs text-left">
                      <span className="font-bold text-navy dark:text-white block">{b.name}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{b.category}</span>
                    </div>
                    <Link
                      href={`/chat?message=Tell me more about ${b.name}`}
                      className="p-1 rounded text-saffron hover:bg-slate-100"
                      title="Ask details"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-2">No saved schemes. Browse welfare programs and save them to qualify.</p>
            )}
          </div>

        </div>

        {/* Right Column: Checklists, renewals & alerts (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Real-time Alerts */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-navy dark:text-white border-b border-border pb-2 flex items-center space-x-2">
              <Bell className="h-4.5 w-4.5 text-saffron shrink-0" />
              <span>Grievance Alerts</span>
            </h2>

            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="text-xs flex items-start space-x-2 border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
                  <div className="h-2 w-2 rounded-full bg-saffron shrink-0 mt-1.5"></div>
                  <div className="space-y-0.5 text-left">
                    <p className="text-slate-600 dark:text-slate-300 leading-normal">{n.text}</p>
                    <span className="block text-[9px] text-slate-400 font-bold">{n.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Checker */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-navy dark:text-white border-b border-border pb-2 flex items-center space-x-2">
              <ClipboardCheck className="h-4.5 w-4.5 text-saffron shrink-0" />
              <span>Document Verification</span>
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Aadhaar Card (UIDAI)</span>
                <span className="inline-flex items-center text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                  <ShieldCheck className="h-3 w-3 mr-0.5" /> Checked
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">PAN Card (Income Tax)</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Pending Upload</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Driving License (RTO)</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Pending Upload</span>
              </div>
            </div>
          </div>

          {/* Renewals */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-navy dark:text-white border-b border-border pb-2 flex items-center space-x-2">
              <Calendar className="h-4.5 w-4.5 text-saffron shrink-0" />
              <span>Renewals Watch</span>
            </h2>

            <div className="space-y-3">
              <div className="text-xs flex items-center justify-between">
                <div className="text-left">
                  <span className="block font-bold text-navy dark:text-white">Passport Renewal</span>
                  <span className="block text-[10px] text-slate-400">Expires in 6 months</span>
                </div>
                <Link
                  href="/chat?service=passport"
                  className="text-[10px] font-bold text-saffron hover:underline"
                >
                  Renew
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

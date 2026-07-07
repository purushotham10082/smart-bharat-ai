"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  FileText,
  UserCheck,
  ChevronRight,
  ShieldAlert,
  PlusCircle,
  Briefcase
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

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [remarkInput, setRemarkInput] = useState("");
  const [statusInput, setStatusInput] = useState<"Pending" | "In Progress" | "Resolved">("Resolved");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Admin Add Scheme form states
  const [schemeName, setSchemeName] = useState("");
  const [schemeCategory, setSchemeCategory] = useState("Finance & Pension");
  const [schemeDesc, setSchemeDesc] = useState("");
  const [schemeBenefits, setSchemeBenefits] = useState("");
  const [schemeUrl, setSchemeUrl] = useState("");
  const [schemeSuccess, setSchemeSuccess] = useState(false);

  // Admin Add Service form states
  const [serviceName, setServiceName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("Identity Documents");
  const [serviceDesc, setServiceDesc] = useState("");
  const [servicePortal, setServicePortal] = useState("");
  const [serviceSuccess, setServiceSuccess] = useState(false);

  useEffect(() => {
    if (!loading && (!user || (user.role !== "admin" && user.role !== "officer"))) {
      router.push("/login");
      return;
    }

    const loadComplaints = () => {
      const stored = localStorage.getItem("smart_bharat_complaints");
      if (stored) {
        try {
          setComplaints(JSON.parse(stored));
        } catch (e) {}
      }
    };

    loadComplaints();
  }, [user, loading, router]);

  // Statistics calculation
  const totalCases = complaints.length;
  const resolvedCases = complaints.filter((c) => c.status === "Resolved").length;
  const pendingCases = complaints.filter((c) => c.status === "Pending").length;
  const inProgressCases = complaints.filter((c) => c.status === "In Progress").length;

  const handleUpdateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    // Officer is locked to Resolve, Admin can toggle
    const nextStatus = user?.role === "officer" ? "Resolved" : statusInput;

    const updatedTimelineEvent = {
      status: nextStatus === "Resolved" ? "Grievance Resolved" : nextStatus === "In Progress" ? "Investigation Underway" : "Grievance Re-opened",
      date: new Date().toLocaleDateString(),
      note: remarkInput || "Status updated by administrative review."
    };

    const updatedList = complaints.map((c) => {
      if (c.id === selectedComplaint.id) {
        return {
          ...c,
          status: nextStatus,
          officerRemarks: remarkInput,
          resolutionDate: nextStatus === "Resolved" ? new Date().toLocaleDateString() : c.resolutionDate,
          timeline: [...c.timeline, updatedTimelineEvent]
        };
      }
      return c;
    });

    setComplaints(updatedList);
    localStorage.setItem("smart_bharat_complaints", JSON.stringify(updatedList));
    
    setUpdateSuccess(true);
    setTimeout(() => {
      setUpdateSuccess(false);
      setSelectedComplaint(null);
      setRemarkInput("");
    }, 1500);
  };

  const handleAddScheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeName || !schemeDesc) return;

    const newScheme = {
      id: "scheme-" + Math.floor(1000 + Math.random() * 9000),
      name: schemeName,
      category: schemeCategory,
      description: schemeDesc,
      benefits: schemeBenefits || "Welfare grants / digital service accessibility.",
      eligibility: { minAge: 18 },
      documents: ["Aadhaar Card", "Income Certificate"],
      officialWebsite: schemeUrl || "https://india.gov.in"
    };

    const existing = localStorage.getItem("smart_bharat_new_schemes");
    let list = [];
    if (existing) {
      try { list = JSON.parse(existing); } catch (err) {}
    }
    list.push(newScheme);
    localStorage.setItem("smart_bharat_new_schemes", JSON.stringify(list));

    setSchemeSuccess(true);
    setSchemeName("");
    setSchemeDesc("");
    setSchemeBenefits("");
    setSchemeUrl("");
    setTimeout(() => setSchemeSuccess(false), 2000);
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName || !serviceDesc) return;

    const newService = {
      name: serviceName,
      category: serviceCategory,
      description: serviceDesc,
      portalLink: servicePortal || "https://india.gov.in",
      aiServiceCode: "custom_" + serviceName.toLowerCase().replace(/[^a-z0-9]/g, "_")
    };

    const existing = localStorage.getItem("smart_bharat_new_services");
    let list = [];
    if (existing) {
      try { list = JSON.parse(existing); } catch (err) {}
    }
    list.push(newService);
    localStorage.setItem("smart_bharat_new_services", JSON.stringify(list));

    setServiceSuccess(true);
    setServiceName("");
    setServiceDesc("");
    setServicePortal("");
    setTimeout(() => setServiceSuccess(false), 2000);
  };

  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-navy dark:text-white font-bold animate-pulse">
        Verifying Administrative Credentials...
      </div>
    );
  }

  // Define components depending on roles
  const isAdmin = user.role === "admin";

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy dark:text-white flex items-center space-x-2">
            <ShieldAlert className="h-8 w-8 text-saffron shrink-0" />
            <span>{isAdmin ? "Admin Control Panel" : "Officer Grievance Panel"}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Logged in as: **{user.name}** ({user.role.toUpperCase()}) • Municipal Desk.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Queue</span>
            <FileText className="h-4.5 w-4.5 text-blue-500" />
          </div>
          <div>
            <span className="text-2xl font-black text-navy dark:text-white">{totalCases}</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">Reported civic issues</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Cases Solved</span>
            <CheckCircle className="h-4.5 w-4.5 text-green-500" />
          </div>
          <div>
            <span className="text-2xl font-black text-green-600 dark:text-green-400">{resolvedCases}</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              {isAdmin ? `${(totalCases > 0 ? (resolvedCases / totalCases) * 100 : 0).toFixed(1)}% success rate` : "Grievances closed"}
            </span>
          </div>
        </div>

        {/* KPI 3 (Admin Only) */}
        {isAdmin && (
          <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-3">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">In Progress</span>
              <Clock className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{inProgressCases}</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Active field investigations</span>
            </div>
          </div>
        )}

        {/* KPI 4 (Admin Only) */}
        {isAdmin && (
          <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-3">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Avg SLA</span>
              <TrendingUp className="h-4.5 w-4.5 text-saffron" />
            </div>
            <div>
              <span className="text-2xl font-black text-navy dark:text-white">4.2 Days</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Conforms to standard SLAs</span>
            </div>
          </div>
        )}

      </div>

      {/* Analytics SVG Charts - ADMIN ONLY */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Category breakdown bar chart */}
          <div className="bg-card border border-border p-6 rounded-xl space-y-4 shadow-sm text-center">
            <div className="text-left">
              <h3 className="text-sm font-bold text-navy dark:text-white">Grievances reported by category</h3>
              <p className="text-[10px] text-slate-400">Relative incident frequency across departments.</p>
            </div>
            
            <div className="h-48 w-full flex items-end justify-between px-4 pt-4 border-b border-border">
              <div className="flex flex-col items-center space-y-2 w-1/5">
                <span className="text-[10px] font-bold text-navy dark:text-white">5</span>
                <div className="h-28 w-6 bg-gradient-to-t from-saffron to-orange-500 rounded-t"></div>
                <span className="text-[9px] font-bold text-slate-400">Roads</span>
              </div>
              <div className="flex flex-col items-center space-y-2 w-1/5">
                <span className="text-[10px] font-bold text-navy dark:text-white">4</span>
                <div className="h-20 w-6 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t"></div>
                <span className="text-[9px] font-bold text-slate-400">Water</span>
              </div>
              <div className="flex flex-col items-center space-y-2 w-1/5">
                <span className="text-[10px] font-bold text-navy dark:text-white">2</span>
                <div className="h-10 w-6 bg-gradient-to-t from-yellow-400 to-saffron rounded-t"></div>
                <span className="text-[9px] font-bold text-slate-400">Power</span>
              </div>
              <div className="flex flex-col items-center space-y-2 w-1/5">
                <span className="text-[10px] font-bold text-navy dark:text-white">3</span>
                <div className="h-16 w-6 bg-gradient-to-t from-green-600 to-green-400 rounded-t"></div>
                <span className="text-[9px] font-bold text-slate-400">Garbage</span>
              </div>
              <div className="flex flex-col items-center space-y-2 w-1/5">
                <span className="text-[10px] font-bold text-navy dark:text-white">1</span>
                <div className="h-6 w-6 bg-gradient-to-t from-slate-400 to-slate-200 rounded-t"></div>
                <span className="text-[9px] font-bold text-slate-400">Others</span>
              </div>
            </div>
          </div>

          {/* Status Distribution Donut ring */}
          <div className="bg-card border border-border p-6 rounded-xl space-y-4 shadow-sm flex flex-col justify-between">
            <div className="text-left">
              <h3 className="text-sm font-bold text-navy dark:text-white">Resolution status breakdown</h3>
              <p className="text-[10px] text-slate-400">Percentage distribution of caseload files.</p>
            </div>

            <div className="flex items-center justify-around py-4">
              <div className="relative h-28 w-28 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#138808" strokeWidth="3" strokeDasharray="50 50" strokeDashoffset="0" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="-50" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="-80" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-xs">
                  <span className="font-extrabold text-navy dark:text-white">{totalCases}</span>
                  <span className="text-[9px] text-slate-400">Cases</span>
                </div>
              </div>

              <div className="space-y-1.5 text-left text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#138808]"></span>
                  <span className="text-slate-500">Resolved ({resolvedCases})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                  <span className="text-slate-500">In Progress ({inProgressCases})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
                  <span className="text-slate-500">Pending ({pendingCases})</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Grid: Complaints Queue & Resolving Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Complaints Table Queue */}
        <div className={`${isAdmin ? "lg:col-span-7" : "lg:col-span-8"} bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm`}>
          <h3 className="text-sm font-bold text-navy dark:text-white border-b border-border pb-2">
            Grievances Dispatch Center
          </h3>

          <div className="overflow-x-auto">
            {complaints.length > 0 ? (
              <table className="min-w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 font-bold">ID</th>
                    <th className="py-2.5 font-bold">Title</th>
                    <th className="py-2.5 font-bold">Department</th>
                    <th className="py-2.5 font-bold">Status</th>
                    <th className="py-2.5 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {complaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-light/10">
                      <td className="py-3 font-mono font-bold text-slate-400">{c.id}</td>
                      <td className="py-3 font-semibold text-navy dark:text-white truncate max-w-[150px]">{c.title}</td>
                      <td className="py-3 text-slate-500">{c.department}</td>
                      <td className="py-3">
                        <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] ${
                          c.status === "Resolved" ? "bg-green-100 text-green-700" : c.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => {
                            setSelectedComplaint(c);
                            setStatusInput(c.status);
                            setRemarkInput(c.officerRemarks || "");
                          }}
                          className="text-saffron font-bold hover:underline cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-slate-400 text-center py-8">No complaints logged in system.</p>
            )}
          </div>
        </div>

        {/* Action Panel / Case inspection */}
        <div className={`${isAdmin ? "lg:col-span-5" : "lg:col-span-4"}`}>
          {selectedComplaint ? (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
              <div className="border-b border-border pb-2 flex justify-between items-center">
                <span className="text-xs font-bold text-navy dark:text-white flex items-center">
                  <UserCheck className="h-4.5 w-4.5 text-saffron mr-1.5" />
                  <span>Update Case File: {selectedComplaint.id}</span>
                </span>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-xs font-bold text-slate-400 hover:text-navy cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {updateSuccess && (
                <div className="p-2.5 rounded-lg bg-green-100 border border-green-200 text-[10px] font-bold text-green-700">
                  Case updated successfully! Syncing databases...
                </div>
              )}

              <form onSubmit={handleUpdateComplaint} className="space-y-4 text-xs">
                <div>
                  <span className="block font-bold text-navy dark:text-white mb-1">Citizen Complaint Description:</span>
                  <p className="p-3 bg-slate-50 dark:bg-navy-light/10 border border-border rounded-lg text-slate-400 leading-normal italic">
                    "{selectedComplaint.description}"
                  </p>
                </div>

                {/* Status Assignment - Admin Can Edit, Officer locked to Resolved */}
                {isAdmin ? (
                  <div>
                    <label className="block font-bold text-navy dark:text-white mb-1">Assign Resolution Status</label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value as any)}
                      className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50 text-navy dark:text-white focus:outline-none"
                    >
                      <option value="Pending">Pending Review</option>
                      <option value="In Progress">Investigation Underway</option>
                      <option value="Resolved">Resolved / Case Closed</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <span className="block font-bold text-navy dark:text-white mb-1">Resolution Status</span>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-bold text-green-800 uppercase">
                      Resolve & Close Case File
                    </span>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-navy dark:text-white mb-1">Department Inspector Remarks</label>
                  <textarea
                    rows={3}
                    value={remarkInput}
                    onChange={(e) => setRemarkInput(e.target.value)}
                    required
                    placeholder="Enter inspection findings, restoration details, or close notes..."
                    className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50 text-navy dark:text-white focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-navy dark:bg-saffron text-white dark:text-navy font-bold hover:bg-navy-light dark:hover:bg-saffron-light cursor-pointer"
                  >
                    {isAdmin ? "Save Case Settings" : "Resolve Grievance"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-slate-100 dark:bg-navy-light/10 border border-dashed border-border rounded-xl p-8 text-center text-slate-400 flex flex-col items-center justify-center h-full min-h-[250px]">
              <Sparkles className="h-8 w-8 text-saffron mb-2" />
              <p className="text-xs">Select a grievance from the left queue to input inspection findings and update municipal resolution timelines.</p>
            </div>
          )}
        </div>

      </div>

      {/* Admin Operations Section - Schemes & Services Creators - ADMIN ONLY */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-8">
          
          {/* Form 1: Welfare Schemes Creator */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-navy dark:text-white border-b border-border pb-2 flex items-center">
              <PlusCircle className="h-4.5 w-4.5 text-saffron mr-1.5" />
              <span>Create New Welfare Scheme</span>
            </h3>

            {schemeSuccess && (
              <div className="p-2.5 rounded-lg bg-green-100 text-green-700 font-bold text-xs">
                Scheme added successfully! Visible in Schemes Explorer.
              </div>
            )}

            <form onSubmit={handleAddScheme} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-navy dark:text-white mb-1">Scheme Name</label>
                  <input
                    type="text"
                    value={schemeName}
                    onChange={(e) => setSchemeName(e.target.value)}
                    required
                    placeholder="e.g. PM Solar Panel Yojana"
                    className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50 text-navy dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy dark:text-white mb-1">Category</label>
                  <select
                    value={schemeCategory}
                    onChange={(e) => setSchemeCategory(e.target.value)}
                    className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50 text-navy dark:text-white focus:outline-none"
                  >
                    <option value="Agriculture">Agriculture</option>
                    <option value="Finance & Pension">Finance & Pension</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy dark:text-white mb-1">Scheme Description</label>
                <textarea
                  rows={2}
                  value={schemeDesc}
                  onChange={(e) => setSchemeDesc(e.target.value)}
                  required
                  placeholder="Provide brief details on what assistance is offered..."
                  className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50 text-navy dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-navy dark:text-white mb-1">Key Benefits</label>
                <input
                  type="text"
                  value={schemeBenefits}
                  onChange={(e) => setSchemeBenefits(e.target.value)}
                  placeholder="e.g. 40% subsidy on installation cost up to 3kW"
                  className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50 text-navy dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-navy dark:text-white mb-1">Official Portal Link</label>
                <input
                  type="url"
                  value={schemeUrl}
                  onChange={(e) => setSchemeUrl(e.target.value)}
                  placeholder="https://pmsuryaghar.gov.in"
                  className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50 text-navy dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy-light cursor-pointer"
              >
                Publish New Scheme
              </button>
            </form>
          </div>

          {/* Form 2: Government Services Creator */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-navy dark:text-white border-b border-border pb-2 flex items-center">
              <Briefcase className="h-4.5 w-4.5 text-[#138808] mr-1.5" />
              <span>Create New Government Service</span>
            </h3>

            {serviceSuccess && (
              <div className="p-2.5 rounded-lg bg-green-100 text-green-700 font-bold text-xs">
                Service added successfully! Visible in Services Directory.
              </div>
            )}

            <form onSubmit={handleAddService} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-navy dark:text-white mb-1">Service Name</label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    required
                    placeholder="e.g. Ration Card Updation"
                    className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50 text-navy dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy dark:text-white mb-1">Category</label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50 text-navy dark:text-white focus:outline-none"
                  >
                    <option value="Identity Documents">Identity Documents</option>
                    <option value="Taxes & Finance">Taxes & Finance</option>
                    <option value="Transport & Driving">Transport & Driving</option>
                    <option value="Certificates & Records">Certificates & Records</option>
                    <option value="Agriculture & Rural">Agriculture & Rural</option>
                    <option value="Digital Services">Digital Services</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy dark:text-white mb-1">Service Description</label>
                <textarea
                  rows={2}
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  required
                  placeholder="Provide step-by-step checklist overview details..."
                  className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50 text-navy dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-navy dark:text-white mb-1">Official Portal Link</label>
                <input
                  type="url"
                  value={servicePortal}
                  onChange={(e) => setServicePortal(e.target.value)}
                  placeholder="https://rationcard.gov.in"
                  className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50 text-navy dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy-light cursor-pointer"
              >
                Publish New Service
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}

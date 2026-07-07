"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/lang-context";
import { useAuth } from "@/context/auth-context";
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Sparkles, 
  Check, 
  Loader2, 
  ShieldAlert, 
  Info 
} from "lucide-react";

const CATEGORIES = [
  "Roads", "Water", "Electricity", "Garbage", "Street Lights", 
  "Public Transport", "Sanitation", "Illegal Construction", 
  "Noise Pollution", "Land Survey & Disputes", "Others"
];

export default function ReportIssue() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Others");
  const [gpsLocation, setGpsLocation] = useState("");
  const [imageFile, setImageFile] = useState<string | null>(null);
  
  // AI auto classification fields
  const [aiDepartment, setAiDepartment] = useState("");
  const [aiUrgency, setAiUrgency] = useState<"Low" | "Medium" | "High">("Medium");

  const [isClassifying, setIsClassifying] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registeredComplaint, setRegisteredComplaint] = useState<any>(null);
  const [error, setError] = useState("");

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `Lat: ${position.coords.latitude.toFixed(5)}, Lng: ${position.coords.longitude.toFixed(5)}`;
        setGpsLocation(coords);
        setIsLocating(false);
      },
      (err) => {
        console.error("Location fetch failed, using default coordinates", err);
        // Fallback Delhi coordinate
        setGpsLocation("Lat: 28.6139, Lng: 77.2090 (Delhi Central)");
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Auto classify grievance via Gemini API
  const handleAutoClassify = async () => {
    if (!title || !description) {
      setError("Please fill in Title and Description first so the AI can analyze them.");
      return;
    }

    setError("");
    setIsClassifying(true);

    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
      });

      if (!res.ok) throw new Error("Auto classification failed");

      const data = await res.json();
      if (data.category && CATEGORIES.includes(data.category)) {
        setCategory(data.category);
      }
      setAiDepartment(data.department || "Municipal Grievance Cell");
      setAiUrgency(data.urgency || "Medium");

    } catch (err) {
      console.error(err);
      setError("AI Classification failed. Setting default category.");
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!title || !description) {
      setError("Title and Description are required");
      setLoading(false);
      return;
    }

    try {
      const activeLocation = gpsLocation || "Lat: 28.6139, Lng: 77.2090 (Delhi Central)";
      
      const newComplaint = {
        id: "GRIEV-" + Math.floor(100000 + Math.random() * 900000),
        title,
        description,
        category,
        location: activeLocation,
        imageUrl: imageFile,
        department: aiDepartment || "Municipal Grievance Cell",
        urgency: aiUrgency,
        status: "Pending",
        date: new Date().toLocaleDateString(),
        timeline: [
          { status: "Grievance Logged", date: new Date().toLocaleDateString(), note: "Filed by citizen via Smart Bharat." }
        ]
      };

      // Save to localStorage complaints database
      const existing = localStorage.getItem("smart_bharat_complaints");
      let list = [];
      if (existing) {
        try {
          list = JSON.parse(existing);
        } catch (e) {}
      }
      list.unshift(newComplaint);
      localStorage.setItem("smart_bharat_complaints", JSON.stringify(list));

      setRegisteredComplaint(newComplaint);
      setSuccess(true);

    } catch (err) {
      console.error(err);
      setError("Failed to register complaint.");
    } finally {
      setLoading(false);
    }
  };

  if (user && (user.role === "admin" || user.role === "officer")) {
    return (
      <div className="flex-1 w-full max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl text-red-700 dark:text-red-300 shadow-md">
          <ShieldAlert className="mx-auto h-12 w-12 mb-3 text-red-500" />
          <h2 className="text-lg font-bold">Unauthorized Action</h2>
          <p className="text-sm mt-1 leading-normal">
            As an administrative {user.role}, you are restricted from registering civic complaints. Only citizens are authorized to submit new complaints.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin")}
          className="px-5 py-2 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy-light cursor-pointer"
        >
          Return to Administrative Panel
        </button>
      </div>
    );
  }

  if (success && registeredComplaint) {
    return (
      <div className="flex-1 w-full max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        <div id="printable-receipt" className="bg-white dark:bg-navy-dark border-2 border-slate-200 dark:border-border rounded-2xl p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 flex">
            <div className="h-full w-1/3 bg-[#FF9933]"></div>
            <div className="h-full w-1/3 bg-white"></div>
            <div className="h-full w-1/3 bg-[#138808]"></div>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center space-x-3">
              <img src="/emblem.svg" alt="State Emblem" className="h-12 w-auto object-contain" />
              <div>
                <span className="block text-[10px] font-bold text-[#FF9933] uppercase tracking-wider">Government of India</span>
                <span className="block text-lg font-black text-navy dark:text-white">Smart Bharat AI</span>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-400 font-mono">
              <span className="block">Grievance Receipt</span>
              <span className="block text-xs font-bold text-navy dark:text-white">{registeredComplaint.id}</span>
            </div>
          </div>
          <div className="space-y-4 text-xs text-navy dark:text-slate-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider">Date Filed</span>
                <span className="font-semibold">{registeredComplaint.date}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider">Urgency Level</span>
                <span className="font-semibold text-red-600 dark:text-red-400">{registeredComplaint.urgency}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider">Assigned Department</span>
                <span className="font-semibold">{registeredComplaint.department}</span>
              </div>
              <div>
                <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider">Category</span>
                <span className="font-semibold">{registeredComplaint.category}</span>
              </div>
            </div>
            <div>
              <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider">Grievance Title</span>
              <span className="font-semibold text-sm">{registeredComplaint.title}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider">Description Details</span>
              <p className="p-3 bg-slate-50 dark:bg-navy-light/10 border border-border rounded-lg italic text-slate-500 dark:text-slate-400 leading-normal">
                "{registeredComplaint.description}"
              </p>
            </div>
            <div>
              <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider">Incident Location</span>
              <span className="font-semibold">{registeredComplaint.location}</span>
            </div>
          </div>
          <div className="border-t border-border pt-4 text-center text-[10px] text-slate-400">
            <p>This is a digitally generated acknowledgement receipt by Smart Bharat AI Portal.</p>
            <p className="mt-1 font-bold text-[#138808]">Satyamev Jayate</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 px-4 bg-navy text-white text-xs font-bold rounded-xl hover:bg-navy-light flex items-center justify-center space-x-2 shadow-md cursor-pointer"
          >
            <span>Print / Save Receipt PDF</span>
          </button>
          <button
            onClick={() => router.push("/complaints")}
            className="flex-1 py-3 px-4 bg-[#138808] text-white text-xs font-bold rounded-xl hover:bg-green-700 flex items-center justify-center space-x-2 shadow-md cursor-pointer"
          >
            <span>Proceed to Complaints Tracker</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy dark:text-white">
          {t("reportTitle")}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t("reportDesc")}
        </p>
      </div>

      {success && (
        <div className="p-3.5 rounded-lg bg-green-100 border border-green-200 text-xs font-semibold text-green-700 flex items-center">
          <Check className="h-4.5 w-4.5 mr-2 shrink-0 animate-bounce" />
          <span>Grievance filed successfully! Opening Complaint Tracker...</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-100 border border-red-200 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Guidelines */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2 text-saffron">
              <ShieldAlert className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Filing Guidelines</span>
            </div>
            
            <ul className="text-xs text-slate-500 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Provide clear title naming the locality (e.g. *Water leak in sector 4*).</li>
              <li>Upload a photograph of the fault to increase priority check.</li>
              <li>Fetch GPS location at the site or drag location marker.</li>
              <li>Use the **AI Auto-Classify** button to predict PWD/Electricity department routes.</li>
            </ul>
          </div>

          {/* AI Info Card */}
          {aiDepartment && (
            <div className="bg-[#FF9933]/5 border border-[#FF9933]/25 p-5 rounded-xl space-y-3 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center space-x-1.5 text-saffron">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Classification Meta</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="block text-slate-400">Predicted Department:</span>
                  <span className="block font-bold text-navy dark:text-white">{aiDepartment}</span>
                </div>
                <div>
                  <span className="block text-slate-400">Urgency Level:</span>
                  <span className={`inline-block px-2 py-0.5 rounded font-bold uppercase text-[9px] mt-0.5 ${
                    aiUrgency === "High" ? "bg-red-100 text-red-700" : aiUrgency === "Medium" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {aiUrgency} Priority
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Title */}
            <div>
              <label htmlFor="grievance-title" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Grievance Title
              </label>
              <input
                id="grievance-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken water mains leaking water on Road 14"
                className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50/50 dark:bg-navy-light/10 text-sm text-navy dark:text-white focus:outline-none focus:border-saffron"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="grievance-description" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Detailed Description
              </label>
              <textarea
                id="grievance-description"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue, including landmarks, severity, and duration of the problem..."
                className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50/50 dark:bg-navy-light/10 text-sm text-navy dark:text-white focus:outline-none focus:border-saffron"
              />
            </div>

            {/* Category selection */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="grievance-category" className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Grievance Category
                </label>
                <button
                  type="button"
                  onClick={handleAutoClassify}
                  disabled={isClassifying}
                  className="inline-flex items-center text-[10px] font-bold text-saffron uppercase hover:underline"
                >
                  {isClassifying ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      <span>Analyzing description...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 mr-1 animate-pulse" />
                      <span>{t("btnAutoClassify")}</span>
                    </>
                  )}
                </button>
              </div>

              <select
                id="grievance-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50/50 dark:bg-navy-light/10 text-sm text-navy dark:text-white focus:outline-none focus:border-saffron"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location GPS */}
            <div>
              <label htmlFor="grievance-location" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                GPS Coordinates
              </label>
              <div className="flex space-x-2">
                <input
                  id="grievance-location"
                  type="text"
                  required
                  value={gpsLocation}
                  onChange={(e) => setGpsLocation(e.target.value)}
                  placeholder="Lat: 0.000, Lng: 0.000"
                  className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50/50 dark:bg-navy-light/10 text-sm text-navy dark:text-white focus:outline-none focus:border-saffron"
                />
                <button
                  type="button"
                  onClick={handleFetchLocation}
                  disabled={isLocating}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-navy-light/20 dark:hover:bg-navy-light/50 border border-border rounded-lg text-slate-500 hover:text-navy text-xs font-bold flex items-center shrink-0"
                >
                  {isLocating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-1 text-red-500" />
                      <span>Get GPS</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Upload Proof Image
              </label>
              <div className="flex items-center space-x-4">
                <label htmlFor="grievance-image" className="px-4 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-navy-light/10 dark:hover:bg-navy-light/35 border-2 border-dashed border-border rounded-xl cursor-pointer flex flex-col items-center justify-center space-y-1 shrink-0 w-28 h-20 transition-all">
                  <Camera className="h-5 w-5 text-slate-400" />
                  <span className="text-[10px] text-slate-400 font-bold">Select File</span>
                  <input
                    id="grievance-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                
                {imageFile ? (
                  <div className="relative h-20 w-28 border border-border rounded-xl overflow-hidden shadow-inner bg-slate-100">
                    <img src={imageFile} alt="Complaint preview" className="object-cover h-full w-full" />
                    <button
                      type="button"
                      onClick={() => setImageFile(null)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 text-[8px] font-bold"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 flex items-center space-x-1 max-w-[180px]">
                    <Info className="h-4 w-4 shrink-0 text-saffron" />
                    <span>Upload a clear image of the issue to accelerate municipal verification.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                type="submit"
                disabled={loading || success}
                className="px-6 py-2.5 bg-navy dark:bg-saffron hover:bg-navy-light dark:hover:bg-saffron-light text-white dark:text-navy font-bold text-xs shadow rounded-lg flex items-center justify-center"
              >
                {loading ? "Registering Grievance..." : "File Complaint"}
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

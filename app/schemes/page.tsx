"use client";

import React, { useState, useEffect } from "react";
import { Search, Calculator, Check, ArrowRight, HelpCircle, Bookmark, Share2, Globe, FileCheck } from "lucide-react";

interface Scheme {
  id: string;
  name: string;
  category: "Healthcare" | "Housing" | "Agriculture" | "Finance & Pension" | "Education & Women";
  description: string;
  benefits: string;
  eligibility: {
    minAge?: number;
    maxAge?: number;
    maxIncome?: number;
    gender?: "Any" | "Female" | "Male";
    isFarmer?: boolean;
    state?: string;
  };
  documents: string[];
  officialWebsite: string;
}

const SCHEMES_DATABASE: Scheme[] = [
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat PM-JAY",
    category: "Healthcare",
    description: "National health insurance scheme offering cashless coverage of up to ₹5 Lakh per family per year for secondary and tertiary hospitalization.",
    benefits: "₹5,00,000 yearly family cover for medical care at listed private and government hospitals.",
    eligibility: {
      maxIncome: 180000,
      gender: "Any",
    },
    documents: ["Aadhaar Card", "Ration Card (SECC listing)", "Income Certificate"],
    officialWebsite: "https://pmjay.gov.in"
  },
  {
    id: "pmay-housing",
    name: "Pradhan Mantri Awas Yojana (PMAY)",
    category: "Housing",
    description: "Financial subsidy scheme to support construction of pukka permanent houses for Economically Weaker Sections (EWS) and Low Income Groups (LIG).",
    benefits: "Subsidized housing interest rates up to 6.5% or direct funding assistance of up to ₹1.5 Lakh.",
    eligibility: {
      minAge: 18,
      maxIncome: 600000,
    },
    documents: ["Aadhaar Card", "PAN Card", "Income Certificate / Form 16", "Land details (for rural)"],
    officialWebsite: "https://pmaymis.gov.in"
  },
  {
    id: "pm-kisan",
    name: "PM Kisan Samman Nidhi",
    category: "Agriculture",
    description: "Direct income support program providing agricultural funds directly into bank accounts of land-holding farmers.",
    benefits: "₹6,000 annual direct cash transfers in 3 equal installments of ₹2,000.",
    eligibility: {
      minAge: 18,
      isFarmer: true,
    },
    documents: ["Aadhaar Card", "Land ownership record (RoR)", "Active Bank Account"],
    officialWebsite: "https://pmkisan.gov.in"
  },
  {
    id: "sukanya-samriddhi",
    name: "Sukanya Samriddhi Yojana (SSY)",
    category: "Education & Women",
    description: "Small deposit savings scheme for girl children, offering high tax-free interest rates and long term maturity for higher studies.",
    benefits: "8.2% tax-free compound interest with flexible annual deposits up to ₹1.5 Lakh.",
    eligibility: {
      maxAge: 10,
      gender: "Female",
    },
    documents: ["Girl child Birth Certificate", "Parent's Aadhaar and PAN Card", "Address Proof"],
    officialWebsite: "https://www.indiapost.gov.in"
  },
  {
    id: "atal-pension",
    name: "Atal Pension Yojana (APY)",
    category: "Finance & Pension",
    description: "Pension program for unorganized sector workers, promising guaranteed post-retirement monthly pensions.",
    benefits: "Guaranteed monthly pensions of ₹1,000 to ₹5,000 based on contribution age.",
    eligibility: {
      minAge: 18,
      maxAge: 40,
    },
    documents: ["Aadhaar Card", "Active Savings Bank Account", "Mobile number link"],
    officialWebsite: "https://www.npscra.nsdl.co.in"
  },
  {
    id: "pm-mudra",
    name: "Pradhan Mantri Mudra Yojana (PMMY)",
    category: "Finance & Pension",
    description: "Loans up to ₹10 Lakh provided to small micro-enterprises and startups for business expansion without collateral requirement.",
    benefits: "Collateral-free commercial loans across Shishu (up to ₹50k), Kishor (up to ₹5L), and Tarun (up to ₹10L) tiers.",
    eligibility: {
      minAge: 18,
      maxIncome: 1200000,
    },
    documents: ["Aadhaar Card", "PAN Card", "Business Registration Proof", "Project Proposal Report"],
    officialWebsite: "https://www.mudra.org.in"
  },
  {
    id: "svamitva-scheme",
    name: "SVAMITVA Scheme (Survey of Villages)",
    category: "Agriculture",
    description: "Drone technology mapping program verifying property boundaries and issuing official ownership cards to rural residential landholders.",
    benefits: "Guaranteed rural Property Cards providing asset validation, resolving boundary disputes, and enabling commercial bank loans.",
    eligibility: {
      isFarmer: true,
    },
    documents: ["Aadhaar Card", "Panchayat Tax Receipt", "Mobile Link Verification"],
    officialWebsite: "https://svamitva.nic.in"
  }
];

export default function Schemes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [savedSchemes, setSavedSchemes] = useState<string[]>([]);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  // Eligibility questionnaire state
  const [showChecker, setShowChecker] = useState(false);
  const [qAge, setQAge] = useState("");
  const [qGender, setQGender] = useState("Any");
  const [qIncome, setQIncome] = useState("");
  const [qFarmer, setQFarmer] = useState("no");
  const [quizResults, setQuizResults] = useState<Scheme[] | null>(null);
  const [quizStep, setQuizStep] = useState(1);
  const [allSchemes, setAllSchemes] = useState<Scheme[]>(SCHEMES_DATABASE);

  useEffect(() => {
    const saved = localStorage.getItem("smart_bharat_bookmarks");
    if (saved) {
      try {
        setSavedSchemes(JSON.parse(saved));
      } catch (e) {}
    }

    const custom = localStorage.getItem("smart_bharat_new_schemes");
    if (custom) {
      try {
        const parsed = JSON.parse(custom);
        setAllSchemes([...SCHEMES_DATABASE, ...parsed]);
      } catch (e) {}
    }
  }, []);

  const toggleBookmark = (id: string) => {
    let updated = [...savedSchemes];
    if (updated.includes(id)) {
      updated = updated.filter((x) => x !== id);
    } else {
      updated.push(id);
    }
    setSavedSchemes(updated);
    localStorage.setItem("smart_bharat_bookmarks", JSON.stringify(updated));
  };

  const handleShare = (name: string) => {
    setShareStatus(name);
    setTimeout(() => setShareStatus(null), 2000);
  };

  // Run checker logic
  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(qAge) || 25;
    const income = parseInt(qIncome) || 300000;
    const isFarmer = qFarmer === "yes";

    const matched = allSchemes.filter((s) => {
      const eRules = s.eligibility;
      
      // Age check
      if (eRules.minAge && age < eRules.minAge) return false;
      if (eRules.maxAge && age > eRules.maxAge) return false;
      
      // Income check
      if (eRules.maxIncome && income > eRules.maxIncome) return false;
      
      // Gender check
      if (eRules.gender && eRules.gender !== "Any" && qGender !== "Any" && eRules.gender !== qGender) return false;
      
      // Farmer check
      if (eRules.isFarmer && !isFarmer) return false;

      return true;
    });

    setQuizResults(matched);
    setQuizStep(3); // Go to results step
  };

  const resetChecker = () => {
    setQAge("");
    setQGender("Any");
    setQIncome("");
    setQFarmer("no");
    setQuizResults(null);
    setQuizStep(1);
  };

  const filteredSchemes = allSchemes.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCat === "All" || s.category === activeCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 text-left relative">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy dark:text-white">
            Welfare Schemes Explorer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search center and state government subsidies, medical insurance, and pensions.
          </p>
        </div>

        {/* Buttons and Search */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => {
              setShowChecker(true);
              setQuizStep(1);
            }}
            className="inline-flex items-center justify-center rounded-lg bg-navy dark:bg-saffron text-white dark:text-navy px-4 py-2 text-xs font-bold shadow-sm hover:bg-navy-light dark:hover:bg-saffron-light"
          >
            <Calculator className="h-4 w-4 mr-1.5" />
            <span>Eligibility Checker</span>
          </button>
        </div>
      </div>

      {/* Search Input and Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="md:col-span-2 flex flex-wrap gap-2">
          {["All", "Healthcare", "Housing", "Agriculture", "Finance & Pension", "Education & Women"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                activeCat === cat
                  ? "bg-navy text-white border-navy dark:bg-saffron dark:text-navy dark:border-saffron"
                  : "bg-card border-border hover:bg-slate-100 text-slate-500 dark:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search scheme name, description..."
            className="block w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-card text-sm text-navy dark:text-white focus:outline-none focus:border-saffron"
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSchemes.map((s) => {
          const isSaved = savedSchemes.includes(s.id);
          return (
            <div
              key={s.id}
              className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Category flag */}
              <div className="absolute top-0 right-0 h-1.5 w-24 bg-gradient-to-r from-saffron to-orange-500"></div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-navy-light px-2.5 py-0.5 text-[10px] font-bold text-slate-500 dark:text-saffron-light uppercase tracking-wider">
                    {s.category}
                  </span>
                  
                  {/* Action buttons */}
                  <div className="flex space-x-1.5">
                    <button
                      onClick={() => toggleBookmark(s.id)}
                      className={`p-1.5 rounded-full border border-border bg-slate-50/50 hover:bg-slate-100 dark:bg-navy-light/10 ${
                        isSaved ? "text-saffron border-saffron/40" : "text-slate-400"
                      }`}
                      title={isSaved ? "Bookmarked" : "Bookmark Scheme"}
                    >
                      <Bookmark className="h-3.5 w-3.5" fill={isSaved ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={() => handleShare(s.name)}
                      className="p-1.5 rounded-full border border-border bg-slate-50/50 hover:bg-slate-100 dark:bg-navy-light/10 text-slate-400"
                      title="Share link"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-navy dark:text-white">
                    {s.name}
                  </h3>
                  <p className="mt-1 text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    {s.description}
                  </p>
                </div>

                {/* Eligibility Summary */}
                <div className="p-3.5 bg-slate-50 dark:bg-[#09152e] border border-border/60 rounded-lg text-xs space-y-2">
                  <div>
                    <span className="font-bold text-navy dark:text-white block mb-0.5">Benefits Provided:</span>
                    <p className="text-slate-600 dark:text-slate-300 leading-normal">{s.benefits}</p>
                  </div>
                  <div>
                    <span className="font-bold text-navy dark:text-white block mb-0.5">Required Document Checklist:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {s.documents.map((d, i) => (
                        <span key={i} className="inline-flex items-center rounded-md bg-white dark:bg-navy border border-border px-1.5 py-0.5 text-[10px] text-slate-500 dark:text-slate-300">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="pt-4 mt-6 border-t border-border/50 flex justify-between items-center text-xs">
                {shareStatus === s.name && (
                  <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">Copied Link!</span>
                )}
                <span></span>
                <div className="flex items-center space-x-2">
                  <a
                    href={s.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-1.5 font-semibold text-slate-500 hover:bg-slate-50"
                  >
                    <Globe className="h-3.5 w-3.5 mr-1" />
                    <span>Apply Link</span>
                  </a>
                  <button
                    onClick={() => {
                      window.location.href = `/chat?message=Check eligibility requirements for ${s.name}`;
                    }}
                    className="inline-flex items-center justify-center rounded-lg bg-navy dark:bg-saffron text-white dark:text-navy px-3.5 py-1.5 font-bold"
                  >
                    <span>Check Details</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Questionnaire Eligibility Modal Overlay */}
      {showChecker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Top tricolor header */}
            <div className="h-1.5 w-full flex">
              <div className="h-full w-1/3 bg-[#FF9933]"></div>
              <div className="h-full w-1/3 bg-white"></div>
              <div className="h-full w-1/3 bg-[#138808]"></div>
            </div>

            <div className="p-6 space-y-4">
              
              <div className="flex justify-between items-start border-b border-border pb-3">
                <div>
                  <h3 className="text-lg font-bold text-navy dark:text-white flex items-center">
                    <Calculator className="h-5 w-5 text-saffron mr-1.5" />
                    <span>Scheme Eligibility Checker</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Calculate which welfare benefits match your criteria.</p>
                </div>
                <button
                  onClick={() => setShowChecker(false)}
                  className="text-xs font-bold text-slate-400 hover:text-navy"
                >
                  Close [X]
                </button>
              </div>

              {quizStep === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); setQuizStep(2); }} className="space-y-4 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">AGE (YEARS)</label>
                      <input
                        type="number"
                        required
                        value={qAge}
                        onChange={(e) => setQAge(e.target.value)}
                        placeholder="e.g. 28"
                        className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50 text-sm text-navy dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">GENDER</label>
                      <select
                        value={qGender}
                        onChange={(e) => setQGender(e.target.value)}
                        className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50 text-sm text-navy dark:text-white focus:outline-none"
                      >
                        <option value="Any">Any / Other</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">ANNUAL HOUSEHOLD INCOME (₹)</label>
                    <input
                      type="number"
                      required
                      value={qIncome}
                      onChange={(e) => setQIncome(e.target.value)}
                      placeholder="e.g. 240000"
                      className="block w-full px-3 py-2 rounded-lg border border-border bg-slate-50 text-sm text-navy dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy-light flex items-center"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </button>
                  </div>
                </form>
              )}

              {quizStep === 2 && (
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">OCCUPATION TYPE</label>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <button
                        onClick={() => setQFarmer("yes")}
                        className={`py-3 px-4 rounded-xl border text-center text-xs font-bold transition-all ${
                          qFarmer === "yes" ? "border-saffron bg-[#FF9933]/5 text-saffron" : "border-border hover:bg-slate-50 text-slate-500"
                        }`}
                      >
                        🌾 Agricultural / Farmer
                      </button>
                      <button
                        onClick={() => setQFarmer("no")}
                        className={`py-3 px-4 rounded-xl border text-center text-xs font-bold transition-all ${
                          qFarmer === "no" ? "border-saffron bg-[#FF9933]/5 text-saffron" : "border-border hover:bg-slate-50 text-slate-500"
                        }`}
                      >
                        🏢 Other / Private Sector
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-border">
                    <button
                      onClick={() => setQuizStep(1)}
                      className="px-4 py-2 border border-border text-slate-500 text-xs font-bold rounded-lg"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCheckEligibility}
                      className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy-light"
                    >
                      Evaluate Qualification
                    </button>
                  </div>
                </div>
              )}

              {quizStep === 3 && quizResults && (
                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-2 text-[#138808]">
                    <FileCheck className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-bold">Matching Results: {quizResults.length} Scheme(s) Qualified</span>
                  </div>

                  {quizResults.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                      {quizResults.map((qr) => (
                        <div key={qr.id} className="p-3 border border-border/80 bg-slate-50/50 rounded-lg space-y-1">
                          <h4 className="text-xs font-bold text-navy dark:text-white">{qr.name}</h4>
                          <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{qr.description}</p>
                          <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-1.5 py-0.5 rounded mt-1">
                            Qualified to Apply
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 leading-normal">
                      Unfortunately, based on your selected criteria (Age: {qAge}, Income: ₹{qIncome}, Farmer: {qFarmer}), you did not match the strict limits for our listed general schemes. Try updating details.
                    </p>
                  )}

                  <div className="flex justify-between pt-4 border-t border-border">
                    <button
                      onClick={resetChecker}
                      className="px-4 py-2 border border-border text-slate-500 text-xs font-bold rounded-lg"
                    >
                      Recalculate
                    </button>
                    <button
                      onClick={() => setShowChecker(false)}
                      className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy-light"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

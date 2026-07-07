"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/lang-context";
import { 
  FileBadge, 
  MapPin, 
  Search, 
  ShieldCheck, 
  Globe, 
  Car, 
  Sprout, 
  CreditCard, 
  HelpCircle, 
  ChevronRight, 
  MessageSquareShare 
} from "lucide-react";

interface ServiceItem {
  name: string;
  category: string;
  description: string;
  portalLink: string;
  aiServiceCode: string;
}

const SERVICES_DATABASE: ServiceItem[] = [
  {
    name: "Passport (Fresh / Re-issue)",
    category: "Identity Documents",
    description: "Submit online forms for fresh passport issuance or renewals. Book appointments at nearest Passport Seva Kendras (PSK).",
    portalLink: "https://passportindia.gov.in",
    aiServiceCode: "passport"
  },
  {
    name: "Aadhaar Card Update",
    category: "Identity Documents",
    description: "Update biometric details, demographic files (address, phone), or request a PVC plastic Aadhaar card online via UIDAI.",
    portalLink: "https://uidai.gov.in",
    aiServiceCode: "aadhaar"
  },
  {
    name: "PAN Card Correction & New Card",
    category: "Taxes & Finance",
    description: "Apply for a Permanent Account Number card. Modify spelling mistakes or date of birth details instantly.",
    portalLink: "https://www.onlineservices.nsdl.com",
    aiServiceCode: "pancard"
  },
  {
    name: "Driving License Renewal",
    category: "Transport & Driving",
    description: "Submit applications for learning licenses, permanent license renewals, or duplicate licenses in your state.",
    portalLink: "https://sarathi.parivahan.gov.in",
    aiServiceCode: "drivinglicense"
  },
  {
    name: "Birth Certificate Application",
    category: "Certificates & Records",
    description: "Register municipal birth records and download digitally signed birth certificates in active states.",
    portalLink: "https://serviceonline.gov.in",
    aiServiceCode: "birthcertificate"
  },
  {
    name: "Caste / Tribe Certificate",
    category: "Certificates & Records",
    description: "Apply for SC, ST, or OBC category certificates to claim educational and employment reservations.",
    portalLink: "https://serviceonline.gov.in",
    aiServiceCode: "castecertificate"
  },
  {
    name: "Farmer Support (PM-Kisan)",
    category: "Agriculture & Rural",
    description: "Register for agricultural financial aids and monitor cash installment disbursements directly into banks.",
    portalLink: "https://pmkisan.gov.in",
    aiServiceCode: "pmkisan"
  },
  {
    name: "Digital Locker Guide (DigiLocker)",
    category: "Digital Services",
    description: "Access and verify digital duplicates of your academic marks sheets, vehicle registration, and certificates safely.",
    portalLink: "https://digilocker.gov.in",
    aiServiceCode: "digilocker"
  },
  {
    name: "Income Certificate Application",
    category: "Certificates & Records",
    description: "Request state-verified income credentials needed for fee concessions and scheme qualification.",
    portalLink: "https://serviceonline.gov.in",
    aiServiceCode: "incomecertificate"
  },
  {
    name: "Land Records & Mutation (Bhulekh)",
    category: "Agriculture & Rural",
    description: "Access digitized survey maps, download Records of Rights (RoR / 7-12 / Jamabandi), and register mutations online.",
    portalLink: "https://india.gov.in",
    aiServiceCode: "landrecords"
  }
];

const CATEGORIES = ["All", "Identity Documents", "Taxes & Finance", "Transport & Driving", "Certificates & Records", "Agriculture & Rural", "Digital Services"];

interface OfficeDetails {
  office: string;
  address: string;
  distance: string;
  hours: string;
  phone: string;
}

export default function Services() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [allServices, setAllServices] = useState<ServiceItem[]>(SERVICES_DATABASE);

  useEffect(() => {
    const custom = localStorage.getItem("smart_bharat_new_services");
    if (custom) {
      try {
        const parsed = JSON.parse(custom);
        setAllServices([...SERVICES_DATABASE, ...parsed]);
      } catch (e) {}
    }
  }, []);

  const getServiceTranslation = (code: string) => {
    if (code === "passport") return { title: t("srvPassportTitle"), desc: t("srvPassportDesc") };
    if (code === "aadhaar") return { title: t("srvAadhaarTitle"), desc: t("srvAadhaarDesc") };
    if (code === "pancard") return { title: t("srvPanTitle"), desc: t("srvPanDesc") };
    if (code === "drivinglicense") return { title: t("srvLicenseTitle"), desc: t("srvLicenseDesc") };
    if (code === "birthcertificate") return { title: t("srvBirthTitle"), desc: t("srvBirthDesc") };
    if (code === "castecertificate") return { title: t("srvCasteTitle"), desc: t("srvCasteDesc") };
    if (code === "pmkisan") return { title: t("srvFarmerTitle"), desc: t("srvFarmerDesc") };
    if (code === "digilocker") return { title: t("srvLockerTitle"), desc: t("srvLockerDesc") };
    if (code === "incomecertificate") return { title: t("srvIncomeTitle"), desc: t("srvIncomeDesc") };
    if (code === "landrecords") return { title: t("srvLandTitle"), desc: t("srvLandDesc") };
    return { title: "", desc: "" };
  };

  const getCategoryTranslation = (cat: string) => {
    if (cat === "All") return t("catAll");
    if (cat === "Identity Documents") return t("catIdentity");
    if (cat === "Taxes & Finance") return t("catTax");
    if (cat === "Transport & Driving") return t("catTransport");
    if (cat === "Certificates & Records") return t("catCertificates");
    if (cat === "Agriculture & Rural") return t("catAgriculture");
    if (cat === "Digital Services") return t("catDigital");
    return cat;
  };

  // GPS Nearest Office states
  const [selectedService, setSelectedService] = useState<{ code: string; name: string } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [officeResult, setOfficeResult] = useState<OfficeDetails | null>(null);

  const getMockOffice = (serviceCode: string, coords: string): OfficeDetails => {
    if (serviceCode === "passport") {
      return {
        office: "Passport Seva Kendra (PSK) Dwarka",
        address: "Dwarka Sector 10, Metro Station Complex, New Delhi 110075",
        distance: "3.4 km",
        hours: "9:00 AM - 4:00 PM (Mon-Fri)",
        phone: "1800-258-1800"
      };
    }
    if (serviceCode === "aadhaar") {
      return {
        office: "Aadhaar Seva Kendra (ASK) - Central",
        address: "Ground Floor, Pragati Maidan Metro Station, New Delhi 110001",
        distance: "1.8 km",
        hours: "9:30 AM - 5:30 PM (Daily)",
        phone: "1947"
      };
    }
    if (serviceCode === "drivinglicense") {
      return {
        office: "Regional Transport Office (RTO) Dwarka",
        address: "Sector 22, Dwarka, Near RTO Depot, New Delhi 110077",
        distance: "5.1 km",
        hours: "10:00 AM - 2:00 PM (Public hours)",
        phone: "011-23932822"
      };
    }
    if (serviceCode === "pmkisan") {
      return {
        office: "CSC (Common Service Centre) - Sector 6 Office",
        address: "Shop No. 12, Block B Market, Dwarka Sector 6, New Delhi 110075",
        distance: "1.2 km",
        hours: "9:00 AM - 7:00 PM (Mon-Sat)",
        phone: "1800-3000-3468"
      };
    }
    if (serviceCode === "digilocker") {
      return {
        office: "DigiLocker Digital Services Helpdesk",
        address: "National e-Governance Division (NeGD), CGO Complex, Lodhi Road, New Delhi 110003",
        distance: "7.2 km (Online service - No physical visit required)",
        hours: "Helpdesk Online 24/7",
        phone: "011-24301900"
      };
    }

    return {
      office: "Municipal Corporation / Tehsildar Office (Central Delhi Zone)",
      address: "Civic Centre, Minto Road, Block-A, Ward 12, Delhi 110002",
      distance: "2.7 km",
      hours: "10:00 AM - 5:00 PM (Government Working Days)",
      phone: "011-23378800"
    };
  };

  const handleFindOffice = (serviceCode: string, serviceName: string) => {
    setLoadingLocation(true);
    setSelectedService({ code: serviceCode, name: serviceName });
    setOfficeResult(null);

    if (typeof window === "undefined" || !navigator.geolocation) {
      setTimeout(() => {
        setOfficeResult(getMockOffice(serviceCode, "Lat: 28.6139, Lng: 77.2090"));
        setLoadingLocation(false);
      }, 1000);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`;
        setTimeout(() => {
          setOfficeResult(getMockOffice(serviceCode, coords));
          setLoadingLocation(false);
        }, 1000);
      },
      () => {
        // Fallback
        setTimeout(() => {
          setOfficeResult(getMockOffice(serviceCode, "Lat: 28.6139, Lng: 77.2090"));
          setLoadingLocation(false);
        }, 1000);
      },
      { timeout: 5000 }
    );
  };

  const filtered = allServices.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === "All" || s.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy dark:text-white">
            {t("servicesTitle")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t("servicesDesc")}
          </p>
        </div>
        
        {/* Search Input */}
        <div className="relative max-w-sm w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("searchServicesPlaceholder")}
            className="block w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-card text-sm text-navy dark:text-white focus:outline-none focus:border-saffron"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border ${
              activeCategory === cat
                ? "bg-navy text-white border-navy dark:bg-saffron dark:text-navy dark:border-saffron"
                : "bg-card border-border hover:bg-slate-100 text-slate-500 dark:text-slate-200 dark:hover:bg-navy-light"
            }`}
          >
            {getCategoryTranslation(cat)}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((srv, idx) => {
            const translatedSrv = getServiceTranslation(srv.aiServiceCode);
            return (
              <div
                key={idx}
                className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="inline-flex items-center rounded-full bg-navy/5 dark:bg-navy-light px-2 py-0.5 text-[10px] font-bold text-navy dark:text-saffron-light uppercase tracking-wider">
                      {getCategoryTranslation(srv.category)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-navy dark:text-white">
                    {translatedSrv.title || srv.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    {translatedSrv.desc || srv.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
                  {/* AI Helper Link */}
                  <Link
                    href={`/chat?service=${srv.aiServiceCode}`}
                    className="inline-flex items-center text-xs font-bold text-saffron hover:underline"
                  >
                    <MessageSquareShare className="h-3.5 w-3.5 mr-1" />
                    <span>{t("btnAiAssist")}</span>
                  </Link>

                  {/* Office Locator */}
                  <button
                    onClick={() => handleFindOffice(srv.aiServiceCode, translatedSrv.title || srv.name)}
                    className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-navy dark:text-slate-300 dark:hover:text-saffron-light transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5 mr-0.5 text-red-500" />
                    <span>{t("btnNearestCenter")}</span>
                  </button>

                  {/* External Portal */}
                  <a
                    href={srv.portalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-semibold text-navy dark:text-slate-200 hover:text-navy-light"
                  >
                    <span>{t("btnOfficialPortal")}</span>
                    <ChevronRight className="h-3 w-3 ml-0.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500 bg-card border border-border rounded-xl">
          <HelpCircle className="mx-auto h-8 w-8 mb-2 text-slate-400" />
          <p className="text-sm">No services found matching your criteria. Try searching other words.</p>
        </div>
      )}

      {/* Info card */}
      <div className="bg-slate-100 dark:bg-navy-light/30 border border-border p-6 rounded-xl flex items-start space-x-3">
        <ShieldCheck className="h-5 w-5 text-[#138808] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-navy dark:text-white">National Security & Privacy Policy</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All civic requests and uploaded documents are handled locally or via encrypted Supabase secure tables. Our AI assistant references official national templates conforming to UIDAI and Ministry standards.
          </p>
        </div>
      </div>

      {/* GPS Location Nearest Office Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 text-left">
            <div className="h-1.5 w-full bg-gradient-to-r from-saffron via-white to-green"></div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start border-b border-border pb-3">
                <div>
                  <h3 className="text-base font-bold text-navy dark:text-white flex items-center">
                    <MapPin className="h-4.5 w-4.5 text-red-500 mr-1.5" />
                    <span>Office Location Finder</span>
                  </h3>
                  <p className="text-[10px] text-slate-400">Searching nearest center for {selectedService.name}</p>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-xs font-bold text-slate-400 hover:text-navy"
                >
                  Close [X]
                </button>
              </div>

              {loadingLocation ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-3 text-slate-400">
                  <div className="h-8 w-8 rounded-full border-4 border-t-saffron border-slate-200 animate-spin"></div>
                  <p className="text-xs font-semibold animate-pulse">Requesting GPS & querying database...</p>
                </div>
              ) : officeResult ? (
                <div className="space-y-3.5 text-xs text-left">
                  <div className="p-3 bg-[#FF9933]/5 border border-[#FF9933]/25 rounded-lg">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Closest Center Found:</span>
                    <span className="block text-sm font-extrabold text-navy dark:text-white mt-0.5">{officeResult.office}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="block font-bold text-slate-400">Office Address:</span>
                      <span className="text-slate-600 dark:text-slate-300 leading-normal block mt-0.5">{officeResult.address}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div>
                        <span className="block font-bold text-slate-400">Calculated Distance:</span>
                        <span className="text-green-600 dark:text-green-400 font-extrabold">{officeResult.distance}</span>
                      </div>
                      <div>
                        <span className="block font-bold text-slate-400">Official Helpline:</span>
                        <a href={`tel:${officeResult.phone}`} className="text-saffron hover:underline font-bold">{officeResult.phone}</a>
                      </div>
                    </div>
                    <div>
                      <span className="block font-bold text-slate-400">Open Public Hours:</span>
                      <span className="text-slate-600 dark:text-slate-300 mt-0.5 block">{officeResult.hours}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex justify-end">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeResult.office + " " + officeResult.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy-light flex items-center"
                    >
                      <span>Navigate in Maps</span>
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-4">Failed to fetch local coordinates. Make sure you grant browser GPS permissions.</p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

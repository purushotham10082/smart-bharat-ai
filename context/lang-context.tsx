"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type LanguageCode = "en" | "hi" | "te" | "ta" | "kn" | "ml" | "mr" | "bn" | "gu" | "pa";

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
];

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navbar
    navHome: "Home",
    navServices: "Services",
    navSchemes: "Schemes",
    navComplaints: "My Complaints",
    navResources: "Resources",
    navAbout: "About",
    navDashboard: "Dashboard",
    navAdmin: "Admin",
    // Hero Section
    heroSub: "SMART BHARAT",
    heroTitle: "AI Powered Civic Companion",
    heroDesc: "Your intelligent AI companion for Government Services, Issue Reporting, and Personalized Civic Support.",
    btnStartChat: "Start Chat",
    btnExploreServices: "Explore Services",
    heroPreviewTitle: "Smart Bharat AI Assistant",
    heroPreviewStatus: "Active & Secured • Digital India Initiative",
    heroPreviewPlaceholder: "Ask me anything about schemes, certificates, or complain details...",
    // General Buttons / Inputs
    searchPlaceholder: "Search services, schemes, documents...",
    submit: "Submit",
    cancel: "Cancel",
    loading: "Loading...",
    logout: "Log Out",
    login: "Log In",
    signup: "Sign Up",
    // Schemes
    schemesTitle: "Government Schemes Explorer",
    schemesFilterCategory: "Category",
    schemesFilterState: "State",
    schemesFilterIncome: "Annual Income",
    schemesFilterAge: "Age",
    schemesFilterGender: "Gender",
    schemesEligibilityQuiz: "Scheme Eligibility Checker",
    applyNow: "Apply Now",
    officialWebsite: "Official Website",
    eligibilityCriteria: "Eligibility Criteria",
    requiredDocuments: "Required Documents",
    benefits: "Benefits",
    // Reports / Complaints
    reportTitle: "Report a Civic Issue",
    reportDesc: "Submit details of infrastructure or public utility issues. Our AI will automatically direct it to the correct department.",
    complaintTitle: "Complaint Title",
    complaintDesc: "Detailed Description",
    complaintCategory: "Category",
    complaintLocation: "Location (GPS)",
    complaintImage: "Upload Image",
    btnAutoClassify: "AI Auto-Classify Category",
    myComplaintsTitle: "My Complaints Tracker",
    complaintStatus: "Status",
    complaintDate: "Date Filed",
    complaintId: "Complaint ID",
    // Resources
    resourcesTitle: "Civic Resources & FAQs",
    faqTitle: "Frequently Asked Questions",
    emergencySOS: "Emergency SOS",
    bannerTitle: "Empowering Citizens. Simplifying Governance.",
    bannerSub: "AI-powered assistance for a smarter and transparent India.",
    servicesTitle: "Explore Government Services",
    servicesDesc: "Browse through official application procedures or consult the AI Assistant for customized instructions.",
    searchServicesPlaceholder: "Search passport, license, certificates...",
    btnAiAssist: "AI Assist",
    btnNearestCenter: "Nearest Center",
    btnOfficialPortal: "Official Portal",
    catAll: "All",
    catIdentity: "Identity Documents",
    catTax: "Taxes & Finance",
    catTransport: "Transport & Driving",
    catCertificates: "Certificates & Records",
    catAgriculture: "Agriculture & Rural",
    catDigital: "Digital Services",
    srvPassportTitle: "Passport (Fresh / Re-issue)",
    srvPassportDesc: "Submit online forms for fresh passport issuance or renewals. Book appointments at nearest Passport Seva Kendras (PSK).",
    srvAadhaarTitle: "Aadhaar Card Update",
    srvAadhaarDesc: "Update biometric details, demographic files (address, phone), or request a PVC plastic Aadhaar card online via UIDAI.",
    srvPanTitle: "PAN Card Correction & New Card",
    srvPanDesc: "Apply for a Permanent Account Number card. Modify spelling mistakes or date of birth details instantly.",
    srvLicenseTitle: "Driving License Renewal",
    srvLicenseDesc: "Submit applications for learning licenses, permanent license renewals, or duplicate licenses in your state.",
    srvBirthTitle: "Birth Certificate Application",
    srvBirthDesc: "Register municipal birth records and download digitally signed birth certificates in active states.",
    srvCasteTitle: "Caste / Tribe Certificate",
    srvCasteDesc: "Apply for SC, ST, or OBC category certificates to claim educational and employment reservations.",
    srvFarmerTitle: "Farmer Support (PM-Kisan)",
    srvFarmerDesc: "Register for agricultural financial aids and monitor cash installment disbursements directly into banks.",
    srvLockerTitle: "Digital Locker Guide (DigiLocker)",
    srvLockerDesc: "Access and verify digital duplicates of your academic marks sheets, vehicle registration, and certificates safely.",
    srvIncomeTitle: "Income Certificate Application",
    srvIncomeDesc: "Request state-verified income credentials needed for fee concessions and scheme qualification.",
    srvLandTitle: "Land Records & Mutation (Bhulekh)",
    srvLandDesc: "Access digitized survey maps, download Records of Rights (RoR / 7-12 / Jamabandi), and register mutations online.",
    homeDirTitle: "Civic Services Directory",
    homeDirSub: "Use our simple civic directories or invoke the AI assistant for step-by-step forms and document checklist guidance.",
    homeLaunchService: "Launch Service",
    homeCardAssistantTitle: "AI Civic Assistant",
    homeCardAssistantDesc: "Instant conversational guidance on passports, certificates, Aadhaar updates, and municipal applications.",
    homeCardReportTitle: "Issue Reporting",
    homeCardReportDesc: "Snap a photo of potholes, trash, or electrical faults. The AI automatically classifies the category and alerts PWD.",
    homeCardTrackerTitle: "Complaint Tracker",
    homeCardTrackerDesc: "Check active municipal complaints. View status updates, officer allocations, and expected resolution timelines.",
    homeCardSchemesTitle: "Find Schemes",
    homeCardSchemesDesc: "Search central & state welfare schemes. Filter by category, gender, income, or age, and check your eligibility.",
    homeCardOcrTitle: "Document OCR",
    homeCardOcrDesc: "Upload local certificates or identity cards. Our AI extracts metadata, verifies signatures, and check for expiry.",
    homeCardOfficesTitle: "Nearby Offices",
    homeCardOfficesDesc: "Locate your nearest Aadhaar centers, municipal offices, passport offices, and emergency support stations.",
  },
  hi: {
    navHome: "होम",
    navServices: "सेवाएं",
    navSchemes: "योजनाएं",
    navComplaints: "मेरी शिकायतें",
    navResources: "संसाधन",
    navAbout: "हमारे बारे में",
    navDashboard: "डैशबोर्ड",
    navAdmin: "एडमिन",
    heroSub: "स्मार्ट भारत",
    heroTitle: "एआई-संचालित नागरिक साथी",
    heroDesc: "सरकारी सेवाओं, समस्या रिपोर्टिंग और व्यक्तिगत नागरिक सहायता के लिए आपका बुद्धिमान एआई साथी।",
    btnStartChat: "चैट शुरू करें",
    btnExploreServices: "सेवाएं देखें",
    heroPreviewTitle: "स्मार्ट भारत एआई सहायक",
    heroPreviewStatus: "सक्रिय और सुरक्षित • डिजिटल इंडिया पहल",
    heroPreviewPlaceholder: "योजनाओं, प्रमाणपत्रों या शिकायत विवरण के बारे में कुछ भी पूछें...",
    searchPlaceholder: "सेवाएं, योजनाएं, दस्तावेज खोजें...",
    submit: "जमा करें",
    cancel: "रद्द करें",
    loading: "लोड हो रहा है...",
    logout: "लॉग आउट",
    login: "लॉग इन",
    signup: "साइन अप",
    schemesTitle: "सरकारी योजनाएं खोजक",
    schemesFilterCategory: "श्रेणी",
    schemesFilterState: "राज्य",
    schemesFilterIncome: "वार्षिक आय",
    schemesFilterAge: "आयु",
    schemesFilterGender: "लिंग",
    schemesEligibilityQuiz: "योजना पात्रता जांच",
    applyNow: "अभी आवेदन करें",
    officialWebsite: "आधिकारिक वेबसाइट",
    eligibilityCriteria: "पात्रता मापदंड",
    requiredDocuments: "आवश्यक दस्तावेज",
    benefits: "लाभ",
    reportTitle: "नागरिक समस्या की रिपोर्ट करें",
    reportDesc: "बुनियादी ढांचे या सार्वजनिक उपयोगिता मुद्दों का विवरण सबमिट करें। हमारा एआई स्वचालित रूप से इसे सही विभाग को भेजेगा।",
    complaintTitle: "शिकायत का शीर्षक",
    complaintDesc: "विस्तृत विवरण",
    complaintCategory: "श्रेणी",
    complaintLocation: "स्थान (जीपीएस)",
    complaintImage: "छवि अपलोड करें",
    btnAutoClassify: "एआई ऑटो-वर्गीकृत श्रेणी",
    myComplaintsTitle: "शिकायत ट्रैकर",
    complaintStatus: "स्थिति",
    complaintDate: "दर्ज करने की तिथि",
    complaintId: "शिकायत आईडी",
    resourcesTitle: "नागरिक संसाधन और अक्सर पूछे जाने वाले प्रश्न",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    emergencySOS: "आपातकालीन एसओएस",
    bannerTitle: "नागरिकों का सशक्तिकरण। शासन का सरलीकरण।",
    bannerSub: "एक स्मार्ट और पारदर्शी भारत के लिए एआई-संचालित सहायता।",
    servicesTitle: "सरकारी सेवाओं की खोज करें",
    servicesDesc: "आधिकारिक आवेदन प्रक्रियाओं को ब्राउज़ करें या अनुकूलित निर्देशों के लिए एआई सहायक से परामर्श करें।",
    searchServicesPlaceholder: "पासपोर्ट, लाइसेंस, प्रमाण पत्र खोजें...",
    btnAiAssist: "एआई सहायता",
    btnNearestCenter: "नजदीकी केंद्र",
    btnOfficialPortal: "आधिकारिक पोर्टल",
    catAll: "सभी",
    catIdentity: "पहचान दस्तावेज",
    catTax: "कर और वित्त",
    catTransport: "परिवहन और ड्राइविंग",
    catCertificates: "प्रमाण पत्र और रिकॉर्ड",
    catAgriculture: "कृषि और ग्रामीण",
    catDigital: "डिजिटल सेवाएं",
    srvPassportTitle: "पासपोर्ट (नया / पुन: जारी)",
    srvPassportDesc: "नए पासपोर्ट जारी करने या नवीनीकरण के लिए ऑनलाइन फॉर्म जमा करें। नजदीकी पासपोर्ट सेवा केंद्रों में अपॉइंटमेंट बुक करें।",
    srvAadhaarTitle: "आधार कार्ड अपडेट",
    srvAadhaarDesc: "बायोमेट्रिक विवरण, जनसांख्यिकीय फाइलें (पता, फोन) अपडेट करें, या यूआईडीएआई के माध्यम से ऑनलाइन पीवीसी आधार कार्ड का अनुरोध करें।",
    srvPanTitle: "पैन कार्ड सुधार और नया कार्ड",
    srvPanDesc: "स्थायी खाता संख्या कार्ड के लिए आवेदन करें। वर्तनी की गलतियों या जन्म तिथि के विवरण को तुरंत संशोधित करें।",
    srvLicenseTitle: "ड्राइविंग लाइसेंस नवीनीकरण",
    srvLicenseDesc: "अपने राज्य में लर्निंग लाइसेंस, स्थायी लाइसेंस नवीनीकरण, या डुप्लिकेट लाइसेंस के लिए आवेदन जमा करें।",
    srvBirthTitle: "जन्म प्रमाण पत्र आवेदन",
    srvBirthDesc: "नगरपालिका जन्म रिकॉर्ड पंजीकृत करें और सक्रिय राज्यों में डिजिटल रूप से हस्ताक्षरित जन्म प्रमाण पत्र डाउनलोड करें।",
    srvCasteTitle: "जाति / जनजाति प्रमाण पत्र",
    srvCasteDesc: "शैक्षणिक और रोजगार आरक्षण का दावा करने के लिए एससी, एसटी, या ओबीसी श्रेणी के प्रमाण पत्र के लिए आवेदन करें।",
    srvFarmerTitle: "किसान सहायता (पीएम-किसान)",
    srvFarmerDesc: "कृषि वित्तीय सहायता के लिए पंजीकरण करें और सीधे बैंकों में नकद किस्त वितरण की निगरानी करें।",
    srvLockerTitle: "डिजिटल लॉकर गाइड (डिजिलॉकर)",
    srvLockerDesc: "अपनी शैक्षणिक अंक तालिका, वाहन पंजीकरण और प्रमाण पत्रों की डिजिटल प्रतियों को सुरक्षित रूप से एक्सेस और सत्यापित करें।",
    srvIncomeTitle: "आय प्रमाण पत्र आवेदन",
    srvIncomeDesc: "शुल्क रियायतें और योजना योग्यता के लिए आवश्यक राज्य-सत्यापित आय क्रेडेंशियल का अनुरोध करें।",
    srvLandTitle: "भूमि अभिलेख और नामांतरण (भूलेख)",
    srvLandDesc: "डिजिटल किए गए सर्वेक्षण मानचित्रों तक पहुंचें, अधिकारों के रिकॉर्ड (आरओआर / 7-12 / जमाबंदी) डाउनलोड करें और ऑनलाइन नामांतरण पंजीकृत करें।",
    homeDirTitle: "नागरिक सेवा निर्देशिका",
    homeDirSub: "चरण-दर-चरण फ़ॉर्म और दस्तावेज़ चेकलिस्ट मार्गदर्शन के लिए हमारी सरल नागरिक निर्देशिकाओं का उपयोग करें या एआई सहायक को बुलाएं।",
    homeLaunchService: "सेवा शुरू करें",
    homeCardAssistantTitle: "एआई नागरिक सहायक",
    homeCardAssistantDesc: "पासपोर्ट, प्रमाण पत्र, आधार अपडेट और नगरपालिका आवेदनों पर त्वरित संवादात्मक मार्गदर्शन।",
    homeCardReportTitle: "समस्या रिपोर्टिंग",
    homeCardReportDesc: "गड्ढों, कचरे या बिजली की खराबी की एक फोटो लें। एआई स्वचालित रूप से श्रेणी को वर्गीकृत करता है और पीडब्ल्यूडी को सचेत करता है।",
    homeCardTrackerTitle: "शिकायत ट्रैकर",
    homeCardTrackerDesc: "सक्रिय नगरपालिका शिकायतों की जाँच करें। स्थिति अपडेट, अधिकारी आवंटन और अपेक्षित समाधान समय सीमा देखें।",
    homeCardSchemesTitle: "योजनाएं खोजें",
    homeCardSchemesDesc: "केंद्रीय और राज्य कल्याण योजनाओं की खोज करें। श्रेणी, लिंग, आय या आयु के अनुसार फ़िल्टर करें और अपनी पात्रता की जाँच करें।",
    homeCardOcrTitle: "दस्तावेज़ ओसीआर",
    homeCardOcrDesc: "स्थानीय प्रमाण पत्र या पहचान पत्र अपलोड करें। हमारा एआई मेटाडेटा निकालता है, हस्ताक्षरों को सत्यापित करता है और समाप्ति की जांच करता है।",
    homeCardOfficesTitle: "नजदीकी कार्यालय",
    homeCardOfficesDesc: "अपने नजदीकी आधार केंद्र, नगरपालिका कार्यालय, पासपोर्ट कार्यालय और आपातकालीन सहायता केंद्र का पता लगाएं।",
  },
  // Adding brief fallbacks for other languages to keep the code compact but functional
  te: {
    navHome: "హోమ్", navServices: "సేవలు", navSchemes: "పథకాలు", navComplaints: "నా ఫిర్యాదులు",
    navResources: "వనరులు", navAbout: "గురించి", navDashboard: "డ్యాష్‌బోర్డ్",
    heroSub: "స్మార్ట్ భారత్", heroTitle: "ఏఐ సివిక్ కంపానియన్",
    heroDesc: "ప్రభుత్వ సేవలు, సమస్యల నివేదిక మరియు వ్యక్తిగతీకరించిన పౌర మద్దతు కోసం మీ తెలివైన ఏఐ సహచరుడు.",
    btnStartChat: "చాట్ ప్రారంభించండి", btnExploreServices: "సేవలను అన్వేషించండి",
    searchPlaceholder: "సేవలు, పథకాలు శోధించండి...",
    servicesTitle: "ప్రభుత్వ సేవలను అన్వేషించండి",
    servicesDesc: "అధికారిక దరखास्त విధానాలను బ్రౌజ్ చేయండి లేదా అనుకూలీకరించిన సూచనల కోసం ఏఐ సహాయకుడిని సంప్రదించండి.",
    searchServicesPlaceholder: "పాస్‌పోర్ట్, లైసెన్స్, సర్టిఫికేట్‌ల కోసం వెతకండి...",
    btnAiAssist: "ఏఐ సహాయం",
    btnNearestCenter: "సమీప కేంద్రం",
    btnOfficialPortal: "ఆధికారిక పోర్టల్",
    catAll: "అన్నీ",
    catIdentity: "గుర్తింపు పత్రాలు",
    catTax: "పన్నులు & ఫైనాన్స్",
    catTransport: "రవాణా & డ్రైవింగ్",
    catCertificates: "ధృవీకరణ పత్రాలు & రికార్డులు",
    catAgriculture: "వ్యవసాయం & గ్రామీణ",
    catDigital: "డిజిటల్ సేవలు",
    srvPassportTitle: "పాస్‌పోర్ట్ (కొత్తది / మళ్లీ జారీ)",
    srvPassportDesc: "కొత్త పాస్‌పోర్ట్ జారీ లేదా పునరుద్ధరణల కోసం ఆన్‌లైన్ ఫారమ్‌లను సమర్పించండి. సమీపంలోని పాస్‌పోర్ట్ సేవా కేంద్రాలలో అపాయింట్‌మెంట్‌లను బుక్ చేసుకోండి.",
    srvAadhaarTitle: "ఆధార్ కార్డ్ అప్‌డేట్",
    srvAadhaarDesc: "బయోమెట్రిక్ వివరాలు, డెమోగ్రాఫిక్ ఫైల్‌లను (చిరునామా, ఫోన్) అప్‌డేట్ చేయండి లేదా యుఐడిఎఐ ద్వారా ఆన్‌లైన్‌లో పివిసి ఆధార్ కార్డ్‌ను అభ్యర్థించండి.",
    srvPanTitle: "పాన్ కార్డ్ సవరణ & కొత్త కార్డ్",
    srvPanDesc: "శాశ్వత ఖాతా సంఖ్య (పాన్) కార్డ్ కోసం దరఖాస్తు చేసుకోండి. తప్పులను లేదా పుట్టిన తేదీ వివరాలను తక్షణమే సవరించండి.",
    srvLicenseTitle: "డ్రైవింగ్ లైసెన్స్ పునరుద్ధరణ",
    srvLicenseDesc: "లెర్నింగ్ లైసెన్స్‌లు, శాశ్వత లైసెన్స్ పునరుద్ధరణలు లేదా నకిలీ లైసెన్స్‌ల కోసం మీ రాష్ట్రంలో దరఖాస్తులను సమర్పించండి.",
    srvBirthTitle: "జనన ధృవీకరణ పత్రం దరఖాస్తు",
    srvBirthDesc: "మునిసిపల్ జనన రికార్డులను నమోదు చేయండి మరియు యాక్టివ్ రాష్ట్రాలలో డిజిటల్ సంతకం చేసిన జనన ధృవీకరణ పత్రాలను డౌన్‌లోడ్ చేయండి.",
    srvCasteTitle: "కుల / తెగ ధృవీకరణ పత్రం",
    srvCasteDesc: "విద్యా మరియు ఉపాధి రిజర్వేషన్లను క్లెయిమ్ చేయడానికి ఎస్సీ, ఎస్టీ లేదా ఓబీసీ కేటగిరీ సర్టిఫिकేట్ల కోసం దరఖాస్తు చేసుకోండి.",
    srvFarmerTitle: "రైతు మద్దతు (పీఎం-కిసాన్)",
    srvFarmerDesc: "వ్యవసాయ ఆర్థిక సహాయాల కోసం నమోదు చేసుకోండి మరియు నేరుగా బ్యాంకుల్లోకి నగదు విడతల పంపిణీని పర్యవేక్షించండి.",
    srvLockerTitle: "డిజిటల్ లాకర్ గైడ్ (డిజిలాకర్)",
    srvLockerDesc: "మీ విద్యా మార్కుల షీట్లు, వాహన రిజిస్ట్రేషన్ మరియు ధృవీకరణ పత్రాల డిజిటల్ నకళ్లను సురక్షితంగా యాక్సెస్ చేయండి మరియు ధృవీకరించండి.",
    srvIncomeTitle: "ఆదాయ ధృవీకరణ పత్రం దరఖాస్తు",
    srvIncomeDesc: "ఫీజు రాయితీలు మరియు పథకాల అర్హత కోసం అవసరమైన రాష్ట్ర ధృవీకృత ఆదాయ ఆధారాలను అభ్యర్థించండి.",
    srvLandTitle: "భూమి రికార్డులు & మ్యుటేషన్ (భూలేఖ్)",
    srvLandDesc: "డిజిటలైజ్డ్ సర్వే మ్యాప్‌లను యాక్సెస్ చేయండి, హక్కుల రికార్డులను (RoR / 7-12 / జమాబంది) డౌన్‌లోడ్ చేయండి మరియు ఆన్‌లైన్‌లో మ్యుటేషన్‌లను నమోదు చేయండి.",
    homeDirTitle: "పౌర సేవల డైరెక్టరీ",
    homeDirSub: "దశల వారీ ఫారమ్‌లు మరియు డాక్యుమెంట్ చెక్‌లిస్ట్ మార్గదర్శకత్వం కోసం మా సాధారణ పౌర డైరెక్టరీలను ఉపయోగించండి లేదా ఏఐ సహాయకుడిని సంప్రదించండి.",
    homeLaunchService: "సేవను ప్రారంభించండి",
    homeCardAssistantTitle: "ఏఐ సివిక్ అసిస్టెంట్",
    homeCardAssistantDesc: "పాస్‌పోర్ట్‌లు, సర్టిఫికేట్‌లు, ఆధార్ అప్‌డేట్‌లు మరియు మునిసిపల్ అప్లికేషన్‌లపై తక్షణ సంభాషణ మార్గదర్శకత్వం.",
    homeCardReportTitle: "సమస్యల నివేదిక",
    homeCardReportDesc: "రోడ్లపై గుంతలు, చెత్త లేదా విద్యుత్ లోపాల ఫోటోను తీయండి. ఏఐ ఆటోమేటిక్‌గా కేటగిరీని వర్గీకరించి పిడబ్ల్యుడిని అప్రమత్తం చేస్తుంది.",
    homeCardTrackerTitle: "ఫిర్యాదు ట్రాకర్",
    homeCardTrackerDesc: "యాక్టివ్ మునిసిపల్ ఫిర్యాదులను తనిఖీ చేయండి. స్టేటస్ అప్‌డేట్‌లు, అధికారి కేటాయింపులు మరియు ఆశించిన పరిష్కార సమయపాలనలను వీక్షించండి.",
    homeCardSchemesTitle: "పథకాలను కనుగొనండి",
    homeCardSchemesDesc: "కేంద్ర & రాష్ట్ర సంక్షేమ పథకాలను శోధించండి. కేటగిరీ, లింగం, ఆదాయం లేదా వయస్సు ఆధారంగా ఫిల్టర్ చేయండి మరియు మీ అర్హతను తనిఖీ చేయండి.",
    homeCardOcrTitle: "డాక్యుమెంట్ ఓసిఆర్",
    homeCardOcrDesc: "స్థానిక సర్టిఫికేట్‌లు లేదా గుర్తింపు కార్డులను అప్‌లోడ్ చేయండి. మా ఏఐ మెటాడేటాను సంగ్రహిస్తుంది, సంతకాలను ధృవీకరిస్తుంది మరియు గడువును తనిఖీ చేస్తుంది.",
    homeCardOfficesTitle: "సమీప కార్యాలయాలు",
    homeCardOfficesDesc: "మీ సమీప ఆధార్ కేంద్రాలు, మునిసిపల్ కార్యాలయాలు, పాస్‌పోర్ట్ కార్యాలయాలు మరియు అత్యవసర సహాయ కేంద్రాలను గుర్తించండి.",
  },
  ta: {
    navHome: "முகப்பு", navServices: "சேவைகள்", navSchemes: "திட்டங்கள்", navComplaints: "என் புகார்கள்",
    navResources: "வளங்கள்", navAbout: "பற்றி", navDashboard: "டாஷ்போர்டு",
    heroSub: "ஸ்மார்ட் பாரத்", heroTitle: "AI குடிமக்கள் துணை",
    heroDesc: "அரசு சேவைகள், புகார்கள் மற்றும் தனிப்பயனாக்கப்பட்ட குடிமக்கள் ஆதரவிற்கான உங்கள் புத்திசாலித்தனமான AI துணை.",
    btnStartChat: "அரட்டையைத் தொடங்கு", btnExploreServices: "சேவைகளை ஆராயுங்கள்",
    searchPlaceholder: "சேவைகள், திட்டங்கள் தேடுக..."
  },
  kn: {
    navHome: "ಮುಖಪುಟ", navServices: "ಸೇವೆಗಳು", navSchemes: "ಯೋಜನೆಗಳು", navComplaints: "ನನ್ನ ದೂರುಗಳು",
    navResources: "ಸಂಪನ್ಮೂಲಗಳು", navAbout: "ಬಗ್ಗೆ", navDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    heroSub: "ಸ್ಮಾರ್ಟ್ ಭಾರತ", heroTitle: "AI ನಾಗರಿಕ ಒಡನಾಡಿ",
    heroDesc: "ಸರ್ಕಾರಿ ಸೇವೆಗಳು, ದೂರು ವರದಿ ಮತ್ತು ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ನಾಗರಿಕ ಬೆಂಬಲಕ್ಕಾಗಿ ನಿಮ್ಮ ಬುದ್ಧಿವಂತ AI ಒಡನಾಡಿ.",
    btnStartChat: "ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ", btnExploreServices: "ಸೇವೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    searchPlaceholder: "ಸೇವೆಗಳು, ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ..."
  },
  ml: {
    navHome: "ഹോം", navServices: "സേവനങ്ങൾ", navSchemes: "പദ്ധതികൾ", navComplaints: "എന്റെ പരാതികൾ",
    navResources: "വിഭവങ്ങൾ", navAbout: "ഞങ്ങളെക്കുറിച്ച്", navDashboard: "ഡാഷ്‌ബോർഡ്",
    heroSub: "സ്മാർട്ട് ഭാരത്", heroTitle: "AI സിവിക് കമ്പാനിയൻ",
    heroDesc: "സർക്കാർ സേവനങ്ങൾ, പ്രശ്നങ്ങൾ റിപ്പോർട്ട് ചെയ്യൽ, വ്യക്തിഗതമാക്കിയ പൗര പിന്തുണ എന്നിവയ്ക്കുള്ള നിങ്ങളുടെ ബുദ്ധിമാനായ AI സഹായി.",
    btnStartChat: "ചാറ്റ് തുടങ്ങുക", btnExploreServices: "സേവനങ്ങൾ പരിശോധിക്കുക",
    searchPlaceholder: "സേവനങ്ങൾ, പദ്ധതികൾ തിരയുക..."
  },
  mr: {
    navHome: "होम", navServices: "सेवा", navSchemes: "योजना", navComplaints: "माझ्या तक्रारी",
    navResources: "संसाधने", navAbout: "बद्दल", navDashboard: "डॅशबोर्ड",
    heroSub: "स्मार्ट भारत", heroTitle: "एआय नागरिक साथी",
    heroDesc: "सरकारी सेवा, नागरी समस्या रिपोर्ट आणि वैयक्तिक नागरी मदतीसाठी आपला बुद्धिमान एआय साथी.",
    btnStartChat: "चॅट सुरू करा", btnExploreServices: "सेवा शोधा",
    searchPlaceholder: "सेवा, योजना शोधा..."
  },
  bn: {
    navHome: "হোম", navServices: "পরিষেবা", navSchemes: "পরিকল্পনা", navComplaints: "আমার অভিযোগ",
    navResources: "সম্পদ", navAbout: "সম্পর্কে", navDashboard: "ড্যাশবোর্ড",
    heroSub: "স্মার্ট ভারত", heroTitle: "এআই নাগরিক সাথী",
    heroDesc: "সরকারি পরিষেবা, অভিযোগ দায়ের এবং ব্যক্তিগত নাগরিক সহায়তার জন্য আপনার বুদ্ধিমান এআই সঙ্গী।",
    btnStartChat: "চ্যাট শুরু করুন", btnExploreServices: "পরিষেবা অন্বেষণ করুন",
    searchPlaceholder: "পরিষেবা, প্রকল্প খুঁজুন..."
  },
  gu: {
    navHome: "હોમ", navServices: "સેવાઓ", navSchemes: "યોજનાઓ", navComplaints: "મારી ફરિયાદો",
    navResources: "સંસાધનો", navAbout: "વિશે", navDashboard: "ડેશબોર્ડ",
    heroSub: "સ્માર્ટ ભારત", heroTitle: "AI નાગરિક સાથી",
    heroDesc: "સરકારી સેવાઓ, ફરિયાદ નિવારણ અને વ્યક્તિગત નાગરિક સહાય માટે તમારો બુદ્ધિશાળી AI સાથી.",
    btnStartChat: "ચેટ શરૂ કરો", btnExploreServices: "સેવાઓ શોધો",
    searchPlaceholder: "સેવાઓ, યોજનાઓ શોધો..."
  },
  pa: {
    navHome: "ਹੋਮ", navServices: "ਸੇਵਾਵਾਂ", navSchemes: "ਯੋਜਨਾਵਾਂ", navComplaints: "ਮੇਰੀਆਂ ਸ਼ਿਕਾਇਤਾਂ",
    navResources: "ਸਰੋਤ", navAbout: "ਬਾਰੇ", navDashboard: "ਡੈਸ਼ਬੋਰਡ",
    heroSub: "ਸਮਾਰਟ ਭਾਰਤ", heroTitle: "AI ਨਾਗਰਿਕ ਸਾਥੀ",
    heroDesc: "ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ, ਸ਼ਿਕਾਇਤਾਂ ਅਤੇ ਨਿੱਜੀ ਨਾਗਰਿਕ ਸਹਾਇਤਾ ਲਈ ਤੁਹਾਡਾ ਬੁੱਧੀਮਾਨ AI ਸਾਥੀ।",
    btnStartChat: "ਚੈਟ ਸ਼ੁਰੂ ਕਰੋ", btnExploreServices: "ਸੇਵਾਵਾਂ ਦੇਖੋ",
    searchPlaceholder: "ਸੇਵਾਵਾਂ, ਯੋਜਨਾਵਾਂ ਖੋਜੋ..."
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem("smart_bharat_lang") as LanguageCode;
    if (saved && translations[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("smart_bharat_lang", lang);
  };

  const t = (key: string): string => {
    // If language doesn't have translation, fallback to English. If English doesn't, return key.
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

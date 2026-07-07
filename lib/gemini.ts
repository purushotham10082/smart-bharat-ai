import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
export const isGeminiConfigured = () => {
  return apiKey !== "" && !apiKey.includes("your-api-key");
};

const genAI = isGeminiConfigured() ? new GoogleGenerativeAI(apiKey) : null;

// System personality prompt
const SYSTEM_INSTRUCTION = `
You are Smart Bharat, a friendly, professional, and trustworthy AI Civic Companion platform created to assist Indian citizens. 
Your primary roles are:
1. Provide accurate details on central and state government schemes (eligibility, benefits, required documents, official websites).
2. Guide users in applying for certificates (Birth, Caste, Income, etc.), licenses, and digital locker services.
3. Give instructions on how to report civic complaints (roads, sanitation, water, illegal construction) and direct them to appropriate departments.
4. Translate government jargon into plain, simple English (or other Indian languages as requested).

Core Guidelines:
- Be highly respectful, objective, and supportive.
- Cite government portals where applicable.
- NEVER HALLUCINATE OR INVENT INFORMATION. 
- If you are uncertain about any scheme detail or verify its accuracy, respond with: "I couldn't verify this information. Please check the official government website."
`;

export const getGeminiResponse = async (
  prompt: string,
  systemInstruction: string = SYSTEM_INSTRUCTION
): Promise<string> => {
  if (!genAI) {
    return getMockResponse(prompt);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction,
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API call failed, using fallback:", error);
    return getMockResponse(prompt);
  }
};

export const classifyComplaint = async (
  title: string,
  description: string
): Promise<{ category: string; department: string; urgency: "Low" | "Medium" | "High" }> => {
  const prompt = `
  Classify the following citizen complaint:
  Title: "${title}"
  Description: "${description}"
  
  Respond ONLY with a JSON object in this exact format (no markdown, no backticks):
  {
    "category": "Roads" | "Water" | "Electricity" | "Garbage" | "Street Lights" | "Public Transport" | "Sanitation" | "Illegal Construction" | "Noise Pollution" | "Others",
    "department": "Name of the government department responsible (e.g. Municipal Corporation, PWD, Jal Board)",
    "urgency": "Low" | "Medium" | "High"
  }
  `;

  if (!genAI) {
    return mockClassify(title, description);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    // Clean up markdown block if Gemini included it
    const jsonStr = text.replace(/^```json/, "").replace(/```$/, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini classification failed, using mock classification:", error);
    return mockClassify(title, description);
  }
};

export const performOCR = async (
  base64Data: string, // Base64 data string (without prefix e.g., data:image/png;base64,)
  mimeType: string
): Promise<{
  documentType: string;
  extractedInfo: Record<string, string>;
  isVerified: boolean;
  notes: string;
}> => {
  const prompt = `
  You are an expert Indian Government Document Analyzer. Analyze the attached document and extract the relevant metadata (such as Name, Document ID/Number, Date of Birth, Date of Issue, State/Authority).
  
  Respond ONLY with a JSON object in this exact format (no markdown, no backticks):
  {
    "documentType": "Aadhaar Card" | "PAN Card" | "Passport" | "Driving License" | "Voter ID" | "Birth Certificate" | "Caste Certificate" | "Unknown",
    "extractedInfo": {
      "name": "Full name found",
      "documentId": "ID/Number found",
      "dob": "Date of Birth (if applicable)",
      "issueDate": "Date of Issue (if applicable)",
      "authority": "Issuing Authority (e.g. UIDAI, Income Tax Department)"
    },
    "isVerified": true,
    "notes": "Any warning, observation, or missing information notes"
  }
  `;

  if (!genAI) {
    return mockOCR();
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text().trim();
    const jsonStr = text.replace(/^```json/, "").replace(/```$/, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini OCR analysis failed, using mock OCR:", error);
    return mockOCR();
  }
};

// Fallback Mock Generators
function getMockResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  
  if (lower.includes("birth certificate")) {
    return `### How to apply for a Birth Certificate in India

To obtain a Birth Certificate, follow this process:

1. **Required Documents:**
   - Proof of birth from the hospital (Discharge slip)
   - Parent's Aadhaar Cards / Identity Proof
   - Parent's Marriage Certificate (optional, varies by municipality)
   - Address Proof (Utility bill, Rent agreement)

2. **Application Channels:**
   - **Online:** Register on your State's Municipal website or national portal (ServicePlus). Fill out the Form 1 and upload parent ID documents.
   - **Offline:** Visit the local Registrar (Municipal Corporation office, Gram Panchayat, or Block Development Office) within **21 days** of the birth.

3. **Processing Fee:** Free if registered within 21 days; nominal late fee applies thereafter.
4. **Estimated Time:** 7 to 15 working days.
   
*Citation: Section 12/17 of the Registration of Births and Deaths Act, 1969.*`;
  }

  if (lower.includes("awas") || lower.includes("pmay") || lower.includes("housing")) {
    return `### Pradhan Mantri Awas Yojana (PMAY) - Urban & Gramin

PMAY is a central government scheme aims to provide housing for all in urban and rural areas.

* **Eligibility:**
  - Family must not own a pucca (permanent) house anywhere in India.
  - EWS (Economically Weaker Section) annual income up to ₹3 Lakh.
  - LIG (Low Income Group) annual income ₹3 Lakh to ₹6 Lakh.
* **Benefits:**
  - Interest subsidy up to 6.5% on home loans.
  - Direct financial assistance up to ₹1.2 Lakh (Rural) or ₹1.5 Lakh (Urban) for construction.
* **Required Documents:**
  - Aadhaar Card, PAN Card, Voter ID.
  - Income Certificate / Form 16.
  - Address Proof and Land ownership documents (for Gramin).
  - Bank Account Passbook details.

To apply, visit the official portal: **[pmaymis.gov.in](https://pmaymis.gov.in)**.`;
  }

  if (lower.includes("passport")) {
    return `### How to Apply for an Indian Passport

Follow these steps to apply for a new passport:

1. **Register on Passport Seva Portal:**
   - Visit the official portal: **[passportindia.gov.in](https://www.passportindia.gov.in)**.
   - Register and create a user ID.

2. **Fill Form Online:**
   - Log in and select "Apply for Fresh Passport / Re-issue of Passport".
   - Fill out the details (Personal, Family, Address, References).

3. **Pay and Schedule Appointment:**
   - Online payment is mandatory to book appointments at Passport Seva Kendra (PSK).
   - Fee: ₹1,500 for normal passport, ₹3,500 for Tatkaal.

4. **Required Documents (to carry to PSK):**
   - Address Proof (Aadhaar, Electricity Bill, Bank Passbook)
   - Date of Birth Proof (Birth Certificate, Matriculation Certificate)

5. **Police Verification:**
   - After the PSK appointment, local police will verify your address details.
   - Passport is dispatched via Speed Post post-clearance.`;
  }

  if (lower.includes("land survey") || lower.includes("land records") || lower.includes("boundary") || lower.includes("bhulekh") || lower.includes("encroachment")) {
    return `### Indian Land Records & Survey Guide (Bhulekh / SVAMITVA)

Here is how to request land boundary surveys, check digitization status (RoR), and handle disputes:

1. **Check Land Records Online (RoR / Jamabandi):**
   - Every state has a digitized **Bhulekh** portal (e.g., AnyRoR for Gujarat, Bhulekh UP, MahaBhumi for Maharashtra).
   - You can view and download your **Record of Rights (Form 7/12, Khatauni)** by entering the Survey Number or Owner Name.

2. **Requesting a Land Boundary Survey (Demarcation):**
   - Apply at the local **Tehsildar Office** or Sub-Divisional Magistrate (SDM) office.
   - **Required Documents:** ROR copy, Sale Deed, Land Tax receipts, and ID proof.
   - A government surveyor (Talati/Patwari) will be scheduled to measure the boundary using drone maps or theodolite meters.

3. **Handling Land Encroachment / Disputes:**
   - **Civil grievance:** File an encroachment petition with the local Tehsildar or District Collector under the respective state Land Revenue Code.
   - **Police support:** If there is a trespass threat, file an FIR under Section 441 (Criminal Trespass) of the Indian Penal Code.

To request digital property cards in village zones, check the central portal: **[svamitva.nic.in](https://svamitva.nic.in)**.`;
  }

  return `Thank you for contacting **Smart Bharat AI**. 

I can assist you with government services, civic reporting, and schemes. 

* **To apply for documents:** Try asking *"How do I get a birth certificate?"* or *"Apply for Passport"*.
* **To find government programs:** Ask *"What is PM Kisan Yojana?"* or *"Eligibility for PMAY"*.
* **To report local issues:** Go to the **Report Issue** tab or tell me *"How do I report potholes?"* or *"Encroachment on my land"*.

*I am here to translate complex policies into simple, readable advice.* If you need further assistance, you can also search our official portals or check details at **[india.gov.in](https://www.india.gov.in)**.`;
}

function mockClassify(title: string, description: string): { category: string; department: string; urgency: "Low" | "Medium" | "High" } {
  const text = (title + " " + description).toLowerCase();
  
  if (text.includes("pothole") || text.includes("road") || text.includes("street")) {
    return { category: "Roads", department: "Public Works Department (PWD)", urgency: "Medium" };
  }
  if (text.includes("water") || text.includes("drain") || text.includes("leak")) {
    return { category: "Water", department: "Municipal Water Board / Jal Board", urgency: "High" };
  }
  if (text.includes("garbage") || text.includes("trash") || text.includes("waste") || text.includes("dump")) {
    return { category: "Garbage", department: "Municipal Waste Management Department", urgency: "Medium" };
  }
  if (text.includes("light") || text.includes("dark")) {
    return { category: "Street Lights", department: "Municipal Electricity Corporation", urgency: "Low" };
  }
  if (text.includes("power") || text.includes("electricity") || text.includes("voltage")) {
    return { category: "Electricity", department: "State Power Distribution Company (DISCOM)", urgency: "High" };
  }
  if (text.includes("land") || text.includes("survey") || text.includes("boundary") || text.includes("encroachment") || text.includes("plot") || text.includes("property")) {
    return { category: "Land Survey & Disputes", department: "Revenue & Land Records Department (Tehsildar Office)", urgency: "Medium" };
  }

  return { category: "Others", department: "Municipal Grievance Cell", urgency: "Medium" };
}

function mockOCR(): { documentType: string; extractedInfo: Record<string, string>; isVerified: boolean; notes: string } {
  return {
    documentType: "Aadhaar Card",
    extractedInfo: {
      name: "Rohan Sharma",
      documentId: "XXXX XXXX 8945",
      dob: "12-08-1988",
      issueDate: "15-06-2015",
      authority: "Unique Identification Authority of India (UIDAI)"
    },
    isVerified: true,
    notes: "Successfully extracted and verified from digital copy (Simulated OCR)."
  };
}

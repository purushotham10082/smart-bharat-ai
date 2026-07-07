import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { isGeminiConfigured } from "@/lib/gemini";

const SYSTEM_INSTRUCTION = `
You are Smart Bharat, the official AI Civic Companion of India.
You help citizens:
- Discover and verify eligibility for government schemes (PMAY, PM-Kisan, Ayushman Bharat, etc.).
- Understand document requirements and application processes (Aadhaar, Passport, PAN Card, Birth Certificates).
- Direct them on how to file and track municipal complaints.
- Explain legal and tax guidelines in simple, accessible language.

Maintain a polite, helpful, patriotic, and authoritative persona. 
Use clear markdown syntax (bold text, lists, and tables where appropriate) in your responses.
Always cite official portals (like india.gov.in, UIDAI, passportindia.gov.in) when providing URLs.
If you do not know the answer, do not make it up. Instead say: "I couldn't verify this information. Please check the official government website."
`;

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const encoder = new TextEncoder();

    if (!isGeminiConfigured()) {
      // Simulate streaming for the mock fallback
      const mockReply = getMockReply(message);
      
      const stream = new ReadableStream({
        async start(controller) {
          // Break mock reply into chunks of words/characters
          const chunks = mockReply.split(" ");
          for (let i = 0; i < chunks.length; i++) {
            const word = chunks[i] + (i === chunks.length - 1 ? "" : " ");
            controller.enqueue(encoder.encode(word));
            // Simulate natural delay (30-60ms per word)
            await new Promise((resolve) => setTimeout(resolve, 40));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Format chat history for Gemini
    // Gemini expects format: { role: 'user' | 'model', parts: [{ text: string }] }
    const formattedHistory = (history || []).map((h: { role: string; content: string }) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessageStream(message);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          console.error("Error during Gemini stream generation:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("AI Chat API route failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function getMockReply(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes("birth certificate") || lower.includes("birthcertificate")) {
    return `To apply for a **Birth Certificate** in India, you need the following documents:
1. **Hospital Discharge Certificate** (Proof of birth location and time)
2. **Aadhaar Cards** of both parents
3. **Address Proof** (electricity bill, water bill, or rent agreement)
4. **Marriage Certificate** of parents (optional in most states)

**Process:**
- If the birth occurred in a hospital, the hospital administration will register it directly.
- Alternatively, register within **21 days** of birth on your state's municipal corporation portal or national portal [ServicePlus](https://serviceonline.gov.in).
- A nominal fee is charged for registration after 21 days.
- Estimated processing time: **7-10 working days**.`;
  }

  if (lower.includes("passport")) {
    return `To apply for a fresh **Indian Passport**, here is a step-by-step checklist:

| Step | Action | Details |
|---|---|---|
| 1 | Register | Visit the [Passport Seva Portal](https://www.passportindia.gov.in) and create a login account. |
| 2 | Application | Log in, fill the online application form and choose a Passport Seva Kendra (PSK) location. |
| 3 | Payment | Pay the application fee (₹1,500 for normal 36-page booklet). |
| 4 | Appointment | Book your date and slot. Print your application receipt. |
| 5 | PSK Visit | Carry original documents (Aadhaar Card, Birth Proof/Class 10 Certificate, Bank Passbook) to the appointment. |
| 6 | Police Verification | Local police will visit your house to verify address credentials. |

The passport is typically dispatched via Speed Post within 15-20 days of successful police clearance.`;
  }

  if (lower.includes("pothole") || lower.includes("garbage") || lower.includes("complaint")) {
    return `Reporting a civic issue (like potholes, garbage dumps, or broken streetlights) on **Smart Bharat** is simple:

1. Navigate to the **[Report Issue](file:///c:/Users/purus/OneDrive/Desktop/prompt%20wars/fianl/app/report)** page in the top menu.
2. Enter a title and describe the issue (e.g., *"Large pothole outside building 4B"*).
3. Select the appropriate **Category** (or click the *AI Auto-Classify* button).
4. Share your **GPS location** using the location picker.
5. Upload a clear picture of the problem to verify the report.
6. Click **Submit**.

Our system automatically directs the file to the Municipal Corporation / Public Works Department (PWD). You can monitor progress on the **[My Complaints](file:///c:/Users/purus/OneDrive/Desktop/prompt%20wars/fianl/app/complaints)** dashboard.`;
  }

  if (lower.includes("aadhaar") || lower.includes("uidai")) {
    return `**Aadhaar Card** is managed by the Unique Identification Authority of India (UIDAI).

To locate your nearest Aadhaar Center or update details:
- Visit the official portal: **[uidai.gov.in](https://uidai.gov.in)**.
- For updating your phone number, photo, or biometrics, you must book an appointment online and visit an **Aadhaar Seva Kendra** in person.
- Address updates can be completed entirely online if your current mobile number is linked to Aadhaar (OTP verification required).`;
  }

  if (lower.includes("pm kisan") || lower.includes("kisan yojana") || lower.includes("pmkisan")) {
    return `**Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)** is a central government scheme supporting farmers.

* **Benefits:** ₹6,00, yearly paid in three equal installments of ₹2,000 directly into the bank accounts of land-holding farmer families.
* **Eligibility:** Small and marginal land-holding farmer families with cultivable land in their name.
* **Required Documents:**
  1. Land ownership records (Fard/Jamabandi/RoR)
  2. Aadhaar Card
  3. Active Bank Account details (linked with Aadhaar)
  4. Mobile Number
* **How to Apply:** Apply online via the [PM-Kisan Portal](https://pmkisan.gov.in) under the "New Farmer Registration" section or visit a local Common Service Center (CSC).`;
  }

  if (lower.includes("pan card") || lower.includes("pancard") || lower.includes("pan ")) {
    return `To apply for a new **Permanent Account Number (PAN) Card** or request corrections:

1. **Online Portals:** Apply via either **[NSDL (Protean)](https://www.onlineservices.nsdl.com)** or **[UTIITSL](https://www.utiitsl.com)**.
2. **Required Documents:**
   - Proof of Identity (Aadhaar, Passport, Voter ID)
   - Proof of Address (Electricity bill, bank statement)
   - Proof of Date of Birth (Birth certificate, Matriculation mark sheet)
3. **Fee:** ₹107 for physical delivery in India; ₹66 for digital e-PAN copy.
4. **Estimated processing time:** 5-7 working days for e-PAN; 15 days for physical card.`;
  }

  if (lower.includes("driving license") || lower.includes("drivinglicense") || lower.includes(" license")) {
    return `To renew your **Driving License (DL)** online in India:

1. **Parivahan Portal:** Visit the official Ministry of Road Transport portal **[sarathi.parivahan.gov.in](https://sarathi.parivahan.gov.in)**.
2. **Steps:**
   - Select your State.
   - Choose "Apply for DL Renewal".
   - Enter your DL Number and Date of Birth.
   - Fill application details, select the RTO, and upload documents.
3. **Required Documents:**
   - Expired Driving License.
   - Form 1 (Self-declaration physical fitness) or **Form 1A (Medical Certificate)** signed by a government doctor if applicant age > 40.
   - Address and Age proof.
4. **Fees:** ₹200 (Late fee of ₹1,000 applies if renewed after 1 year of expiry).`;
  }

  if (lower.includes("caste certificate") || lower.includes("castecertificate")) {
    return `To obtain an **SC/ST/OBC Caste Certificate** to claim welfare or educational concessions:

1. **Application Channel:** Fill out the forms online via your state's **E-District / ServicePlus** portal, or offline at the local Revenue Office (Tehsildar/SDM).
2. **Required Documents:**
   - Proof of Identity (Aadhaar, PAN, Voter ID)
   - Father's/Relative's Caste Certificate (crucial proof of lineage)
   - Affidavit declaring caste classification.
   - Local Address proof.
3. **Verification:** Local Revenue Inspector will perform field verification of your family lineage.
4. **Estimated Time:** 15 to 30 working days.`;
  }

  if (lower.includes("digilocker") || lower.includes("digital locker")) {
    return `**DigiLocker** is a secure national cloud storage locker linked to your Aadhaar Card.

* **Key Features:**
  - Legally equivalent to physical documents under the IT Act, 2000.
  - Directly pulls official mark sheets, RTO vehicle registrations, insurance cards, and digital Aadhaar cards from issuing authorities.
* **How to Register:**
  1. Download the app or visit **[digilocker.gov.in](https://digilocker.gov.in)**.
  2. Register using your Aadhaar number (OTP verification required).
  3. Set your 6-digit security PIN.
* **Storage Limit:** 1 GB secure personal storage area.`;
  }

  if (lower.includes("income certificate") || lower.includes("incomecertificate")) {
    return `To obtain a government-certified **Income Certificate** (needed for school fee concessions and welfare qualification):

1. **Application:** Apply online via your state's **E-District** portal or visit the local Tehsildar / Sub-Divisional Magistrate office.
2. **Required Documents:**
   - Salary Slips / Form 16 (for salaried persons)
   - Land Revenue tax receipts (for agricultural income)
   - Verification affidavit declaring all family income sources.
   - Identity & Address Proof (Aadhaar, Voter ID).
3. **Estimated Time:** 10 to 15 working days. Valid for 1 financial year.`;
  }

  if (lower.includes("landrecords") || lower.includes("land records") || lower.includes("boundary") || lower.includes("bhulekh") || lower.includes("encroachment") || lower.includes("survey")) {
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

  return `Hello! I am **Smart Bharat AI**, your civic helper. 

I can guide you through:
- **Government Schemes:** Check eligibility and application portals for PM Awas Yojana, PM-Kisan, PM Mudra, etc.
- **Document Services:** Get clear checklists for Aadhaar, Driving Licenses, Voter ID, PAN Cards, and Birth Certificates.
- **Civic Grievances:** Guide you in reporting potholes, sanitation issues, or land survey boundary disputes.

Ask me questions like *"How do I apply for a passport?"*, *"Am I eligible for PM Awas Yojana?"*, or *"How to check land records?"*. I'm here to simplify Indian administrative procedures for you!`;
}

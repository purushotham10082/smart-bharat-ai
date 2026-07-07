import { NextResponse } from "next/server";
import { performOCR } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { file, mimeType } = await request.json();
    
    if (!file || !mimeType) {
      return NextResponse.json(
        { error: "Base64 file data and mimeType are required" },
        { status: 400 }
      );
    }

    // Strip prefix from base64 data if it exists (e.g. data:image/png;base64,)
    const base64Data = file.replace(/^data:image\/[a-z]+;base64,/, "");

    const ocrResult = await performOCR(base64Data, mimeType);
    return NextResponse.json(ocrResult);
  } catch (error) {
    console.error("OCR API route failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

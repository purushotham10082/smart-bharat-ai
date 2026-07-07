import { NextResponse } from "next/server";
import { classifyComplaint } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();
    
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const classification = await classifyComplaint(title, description);
    return NextResponse.json(classification);
  } catch (error) {
    console.error("Complaint classification API route failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

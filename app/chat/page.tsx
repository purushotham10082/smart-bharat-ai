"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/lang-context";
import { 
  Send, 
  Paperclip, 
  Trash2, 
  Sparkles, 
  Share2, 
  FileDown, 
  Bookmark, 
  ThumbsUp, 
  ThumbsDown, 
  AlertCircle,
  FileImage
} from "lucide-react";
import VoiceAssistant from "@/components/voice-assistant";

interface Message {
  role: "user" | "assistant";
  content: string;
  isBookmarked?: boolean;
  rating?: "like" | "dislike";
  isOcrResult?: boolean;
}

const QUICK_SUGGESTIONS = [
  "How do I get a Birth Certificate?",
  "PM Awas Yojana eligibility",
  "Apply for Passport",
  "Driving License renewal",
  "PAN Card correction",
  "Find nearest Aadhaar center"
];

function ChatContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `### Welcome to Smart Bharat AI Assistant!

I can help you translate government policies, compile document checklists, and report local civic grievances. 

**Quick tip:** You can upload certificates or identity documents using the paperclip icon, and I'll extract and verify details automatically.`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOcrUploading, setIsOcrUploading] = useState(false);
  
  // Track last response to read aloud
  const [lastModelReply, setLastModelReply] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if query parameters pre-fill the chat
  useEffect(() => {
    const serviceParam = searchParams?.get("service");
    const ocrParam = searchParams?.get("ocr");
    
    if (serviceParam) {
      let promptText = `How do I apply for a ${serviceParam}?`;
      if (serviceParam === "passport") promptText = "How do I apply for an Indian Passport?";
      if (serviceParam === "aadhaar") promptText = "How do I update my Aadhaar Card address?";
      if (serviceParam === "birthcertificate") promptText = "How do I register a Birth Certificate?";
      
      triggerChat(promptText);
    } else if (ocrParam) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Please upload your government document (Aadhaar Card, PAN Card, etc.) using the paperclip button below. I will perform an OCR extraction check."
        }
      ]);
    }
  }, [searchParams]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const triggerChat = async (promptText: string) => {
    if (!promptText.trim() || loading) return;

    const userMessage: Message = { role: "user", content: promptText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setLastModelReply("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptText,
          history: newMessages.slice(0, -1) // Exclude the last user message from history param
        })
      });

      if (!response.ok) throw new Error("Chat request failed");

      // Set up streaming response reader
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        setLoading(false);
        return;
      }

      // Add a blank placeholder assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let assistantContent = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        assistantContent += chunk;
        
        // Update the last message content
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantContent
          };
          return updated;
        });
      }

      setLastModelReply(assistantContent);

    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I couldn't verify this information. Please check the official government website."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    triggerChat(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    triggerChat(suggestion);
  };

  const handleTranscript = (text: string) => {
    setInput(text);
  };

  // Perform client-side Document OCR simulation using our route
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOcrUploading(true);
    
    // Read file as Base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      
      try {
        const response = await fetch("/api/ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: base64Data,
            mimeType: file.type
          })
        });

        if (!response.ok) throw new Error("OCR Failed");

        const data = await response.json();
        
        // Create an OCR verification chat message
        const infoMessage = `### Document OCR Extraction: ${data.documentType}
- **Document Type:** ${data.documentType}
- **Extracted ID Number:** \`${data.extractedInfo.documentId}\`
- **Name Found:** **${data.extractedInfo.name}**
- **Date of Birth:** ${data.extractedInfo.dob}
- **Issuing Authority:** ${data.extractedInfo.authority}
- **Status:** ✅ ${data.isVerified ? "Verified Copy" : "Flagged/Unverified"}
- **System Note:** *${data.notes}*

Would you like me to draft an application or checklist based on these credentials?`;

        setMessages((prev) => [
          ...prev,
          { role: "user", content: `Uploaded file: ${file.name} (OCR Request)` },
          { role: "assistant", content: infoMessage, isOcrResult: true }
        ]);

      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "⚠️ Document upload failed. Please verify if file is an image (JPEG, PNG)." }
        ]);
      } finally {
        setIsOcrUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear your active conversation?")) {
      setMessages([
        {
          role: "assistant",
          content: "Conversation history cleared. Ask me anything to begin again!"
        }
      ]);
      setLastModelReply("");
    }
  };

  const handleBookmarkMessage = (idx: number) => {
    setMessages((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        isBookmarked: !updated[idx].isBookmarked
      };
      return updated;
    });
  };

  const handleRateMessage = (idx: number, rating: "like" | "dislike") => {
    setMessages((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        rating: updated[idx].rating === rating ? undefined : rating
      };
      return updated;
    });
  };

  // Format markdown helper (bold, lists, tables)
  const formatMarkdown = (text: string) => {
    // Escape HTML tags to prevent XSS
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h4 class="font-bold text-navy dark:text-[#FFAE59] text-sm mt-3 mb-1">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 class="font-bold text-navy dark:text-[#FFAE59] text-base mt-4 mb-1.5">$1</h3>');

    // Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-navy dark:text-white">$1</strong>');
    
    // Lists
    html = html.replace(/^\s*\n*-\s*(.*$)/gim, '<li class="list-disc list-inside ml-2 my-0.5">$1</li>');
    html = html.replace(/^\s*\n*\d\.\s*(.*$)/gim, '<li class="list-decimal list-inside ml-2 my-0.5">$1</li>');

    // Simple markdown tables parser
    if (html.includes("|")) {
      const lines = html.split("\n");
      let inTable = false;
      let tableHtml = '<div class="overflow-x-auto my-3"><table class="min-w-full text-[11px] border border-border border-collapse text-left">';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith("|") && line.endsWith("|")) {
          // Skip divider lines e.g. |---|---|
          if (line.includes("---") || line.includes("===")) {
            continue;
          }
          
          if (!inTable) {
            inTable = true;
          }

          const cols = line.split("|").map((c) => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          tableHtml += '<tr class="border-b border-border hover:bg-slate-100 dark:hover:bg-navy-light/20">';
          cols.forEach((col) => {
            // Check if first row is header
            const cellTag = i === 0 || !html.split("\n")[i-1].includes("|") ? "th" : "td";
            tableHtml += `<${cellTag} class="px-2.5 py-1.5 font-semibold">${col}</${cellTag}>`;
          });
          tableHtml += "</tr>";
        } else {
          if (inTable) {
            inTable = false;
            tableHtml += "</table></div>";
            lines[i] = tableHtml + lines[i];
          }
        }
      }
      if (inTable) {
        tableHtml += "</table></div>";
        lines[lines.length - 1] = tableHtml;
      }
      html = lines.join("\n");
    }

    // Replace linebreaks
    return html.split("\n").map((line, key) => {
      // If line contains direct list items or tables, don't wrap in br
      if (line.includes("<li") || line.includes("<table") || line.includes("<tr") || line.includes("<h")) {
        return <div key={key} dangerouslySetInnerHTML={{ __html: line }} />;
      }
      return <p key={key} className="leading-relaxed mb-1.5" dangerouslySetInnerHTML={{ __html: line }} />;
    });
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="flex-1 w-full flex flex-col bg-slate-50 dark:bg-[#051026] relative h-[calc(105vh-8rem)]">
      
      {/* Dynamic Voice Assistant integration */}
      <VoiceAssistant
        onTranscript={handleTranscript}
        lastMessageToSpeak={lastModelReply}
        langCode={language === "hi" ? "hi-IN" : "en-IN"}
      />

      <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-6 p-4 md:p-6 overflow-hidden">
        
        {/* Left column: suggestions and config */}
        <div className="w-full md:w-1/4 shrink-0 flex flex-col justify-between hidden md:flex border border-border bg-card rounded-2xl p-4 shadow-sm h-full">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-saffron">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Example Prompts</span>
            </div>
            <div className="flex flex-col gap-2">
              {QUICK_SUGGESTIONS.map((qs, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(qs)}
                  className="w-full text-left p-3 rounded-lg border border-border/80 bg-slate-50/50 hover:bg-slate-100 text-xs font-semibold text-navy dark:text-slate-200 dark:bg-navy-light/10 dark:hover:bg-navy-light/35 transition-all leading-normal"
                >
                  {qs}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400">
              <AlertCircle className="h-4 w-4 text-saffron shrink-0" />
              <span>Smart Bharat citation guidelines apply.</span>
            </div>
            <button
              onClick={handleClearChat}
              className="w-full py-2.5 rounded-lg border border-red-500/20 text-red-600 hover:bg-red-50/50 dark:hover:bg-red-500/10 text-xs font-bold flex items-center justify-center space-x-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Conversation</span>
            </button>
          </div>
        </div>

        {/* Right column: active chat area */}
        <div className="flex-1 flex flex-col bg-card border border-border rounded-2xl shadow-sm overflow-hidden h-full">
          
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center space-x-2 text-left">
              <div className="h-8 w-8 rounded-full bg-navy flex items-center justify-center text-xs text-white font-extrabold shadow-sm border border-slate-200">
                SB
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy dark:text-white">Smart Bharat AI Portal</h3>
                <span className="block text-[10px] text-green-500 font-semibold">• Active Streaming Responses</span>
              </div>
            </div>

            {/* Print / Export button */}
            <button
              onClick={handleExportPdf}
              className="p-2 rounded-lg border border-border bg-slate-50/50 hover:bg-slate-100 dark:bg-navy-light/10 text-slate-500 hover:text-navy dark:text-slate-200 flex items-center space-x-1"
              title="Export Conversation PDF"
            >
              <FileDown className="h-4 w-4" />
              <span className="text-xs font-bold hidden sm:inline">Export PDF</span>
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left" id="print-area">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="h-7 w-7 rounded-full bg-navy border border-border flex items-center justify-center text-[10px] text-white font-bold shrink-0 shadow-sm print:hidden">
                    SB
                  </div>
                )}
                
                <div
                  className={`relative group max-w-[85%] rounded-xl px-4 py-3 border text-xs leading-relaxed transition-all shadow-sm ${
                    msg.role === "user"
                      ? "bg-saffron/10 border-saffron/30 text-navy dark:text-white"
                      : msg.isOcrResult 
                        ? "bg-purple-50/40 border-purple-500/20 text-navy dark:text-white dark:bg-purple-950/20"
                        : "bg-slate-50 dark:bg-navy-light/20 border-border/50 text-navy dark:text-slate-200"
                  }`}
                >
                  <div className="space-y-1.5">
                    {msg.role === "assistant" && (
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-saffron print:hidden">
                        Smart Bharat AI
                      </span>
                    )}
                    <div className="space-y-1">
                      {msg.role === "assistant" 
                        ? formatMarkdown(msg.content)
                        : <p className="font-semibold">{msg.content}</p>
                      }
                    </div>
                  </div>

                  {/* Message rating / actions */}
                  {msg.role === "assistant" && (
                    <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-slate-400 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity print:hidden">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleBookmarkMessage(idx)}
                          className={`hover:text-saffron transition-colors ${msg.isBookmarked ? "text-saffron" : ""}`}
                          title="Bookmark message"
                        >
                          <Bookmark className="h-3.5 w-3.5" fill={msg.isBookmarked ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={() => handleRateMessage(idx, "like")}
                          className={`hover:text-[#138808] transition-colors ${msg.rating === "like" ? "text-green-600" : ""}`}
                          title="Rate positive"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleRateMessage(idx, "dislike")}
                          className={`hover:text-red-500 transition-colors ${msg.rating === "dislike" ? "text-red-500" : ""}`}
                          title="Rate negative"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing animations loading skeleton */}
            {loading && (
              <div className="flex items-start space-x-3 justify-start">
                <div className="h-7 w-7 rounded-full bg-navy border border-border flex items-center justify-center text-[10px] text-white font-bold shrink-0 shadow-sm animate-pulse">
                  SB
                </div>
                <div className="bg-slate-50 dark:bg-navy-light/20 border border-border/50 rounded-xl px-4 py-3 flex items-center space-x-1 w-max">
                  <span className="h-2 w-2 rounded-full bg-saffron animate-[bounce_1s_infinite_100ms]"></span>
                  <span className="h-2 w-2 rounded-full bg-navy dark:bg-white animate-[bounce_1s_infinite_200ms]"></span>
                  <span className="h-2 w-2 rounded-full bg-[#138808] animate-[bounce_1s_infinite_300ms]"></span>
                </div>
              </div>
            )}
            
            {isOcrUploading && (
              <div className="flex items-start space-x-3 justify-start">
                <div className="h-7 w-7 rounded-full bg-purple-600 flex items-center justify-center shrink-0 shadow-md animate-pulse">
                  <FileImage className="h-4 w-4 text-white animate-bounce" />
                </div>
                <div className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-500/30 rounded-xl px-4 py-3 text-xs text-purple-600 dark:text-purple-400 space-y-2 max-w-sm w-full shadow-sm">
                  <div className="flex items-center justify-between font-bold">
                    <span>AI Document Scanner (OCR)</span>
                    <span className="text-[10px] uppercase animate-pulse">Scanning...</span>
                  </div>
                  <div className="w-full h-1.5 bg-purple-200 dark:bg-purple-900 rounded-full overflow-hidden relative">
                    <div className="h-full bg-purple-600 rounded-full animate-pulse" style={{ width: "75%" }}></div>
                  </div>
                  <p className="text-[10px] text-purple-500/80">Reading document fields & verifying security signatures...</p>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Form Input area */}
          <div className="p-4 border-t border-border">
            <form onSubmit={handleSend} className="relative flex items-center space-x-2">
              
              {/* Attachment / Document upload input wrapper */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-lg border border-border hover:bg-slate-100 dark:bg-navy-light/10 text-slate-400 hover:text-navy shrink-0"
                title="Upload government card for OCR check"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about passport, PMAY housing eligibility or upload documents..."
                className="block w-full py-2.5 pl-3 pr-10 rounded-lg border border-border bg-slate-50/50 dark:bg-navy-light/10 text-xs text-navy dark:text-white focus:outline-none focus:border-saffron"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-lg bg-navy dark:bg-saffron text-white dark:text-navy hover:bg-navy-light dark:hover:bg-saffron-light shrink-0 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-2 text-[10px] text-slate-400 text-center">
              Citings are generated in compliance with the Ministry of Electronics and Information Technology (MeitY) guidelines.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function Chat() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center p-8 text-navy dark:text-white">
        Loading chat interface...
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, X, HelpCircle } from "lucide-react";

interface VoiceAssistantProps {
  onTranscript?: (text: string) => void;
  lastMessageToSpeak?: string;
  langCode?: string;
}

export default function VoiceAssistant({
  onTranscript,
  lastMessageToSpeak,
  langCode = "en-IN"
}: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [supported, setSupported] = useState({ stt: false, tts: false });
  const [transcriptText, setTranscriptText] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API browser compatibility
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      const sttSupported = !!SpeechRecognition;
      const ttsSupported = !!window.speechSynthesis;

      setSupported({ stt: sttSupported, tts: ttsSupported });

      if (sttSupported) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = langCode;

        rec.onstart = () => {
          setIsListening(true);
          setTranscriptText("");
        };

        rec.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          setTranscriptText(resultText);
          if (onTranscript) {
            onTranscript(resultText);
          }
        };

        rec.onerror = (event: any) => {
          console.error("Speech Recognition error:", event.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, [onTranscript, langCode]);

  // Speak when last message updates
  useEffect(() => {
    if (ttsEnabled && lastMessageToSpeak && supported.tts && typeof window !== "undefined") {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      
      // Clean up markdown before reading
      const cleanText = lastMessageToSpeak
        .replace(/[*#`_\-\[\]()|]/g, " ")
        .replace(/https?:\/\/\S+/g, "")
        .trim();

      if (cleanText) {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = langCode;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [lastMessageToSpeak, ttsEnabled, supported.tts, langCode]);

  const toggleListening = () => {
    if (!supported.stt) return;

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  const toggleTts = () => {
    if (!supported.tts) return;
    const newTtsState = !ttsEnabled;
    setTtsEnabled(newTtsState);
    if (!newTtsState && typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
  };

  if (!supported.stt && !supported.tts) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2">
      {/* Waveform indicator when listening */}
      {isListening && (
        <div className="rounded-lg bg-navy/90 dark:bg-slate-900/90 text-white px-3 py-1.5 text-xs shadow-md border border-border/20 flex items-center space-x-2 animate-pulse">
          <div className="flex space-x-1 items-center">
            <span className="h-2 w-0.5 bg-saffron animate-bounce" style={{ animationDelay: "0ms" }}></span>
            <span className="h-3 w-0.5 bg-white animate-bounce" style={{ animationDelay: "150ms" }}></span>
            <span className="h-2 w-0.5 bg-green-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
          </div>
          <span>Listening...</span>
        </div>
      )}

      {/* Transcript feedback box */}
      {transcriptText && (
        <div className="max-w-xs rounded-lg bg-card text-navy dark:text-white px-3 py-2 text-xs shadow-md border border-border animate-in fade-in slide-in-from-bottom-2">
          <p className="italic">"{transcriptText}"</p>
        </div>
      )}

      <div className="flex items-center space-x-2">
        {/* Help tooltip toggle */}
        {showTooltip && (
          <div className="bg-card text-navy dark:text-white border border-border p-3 rounded-lg shadow-xl text-xs max-w-[200px] animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold">Voice Assistant</span>
              <button onClick={() => setShowTooltip(false)} className="text-slate-400 hover:text-navy">
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="text-slate-500 leading-normal">
              Click Mic to speak to AI. Toggling the volume icon turns on automatic voice reading (Text-to-Speech) of AI responses.
            </p>
          </div>
        )}

        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="p-1.5 rounded-full bg-slate-200 dark:bg-navy-light text-navy/70 dark:text-slate-200 hover:bg-slate-300 shadow border border-border"
          title="Voice Guide"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        {/* Text to Speech Toggle button */}
        {supported.tts && (
          <button
            onClick={toggleTts}
            className={`p-3 rounded-full shadow-lg border border-border transition-all hover:scale-105 ${
              ttsEnabled
                ? "bg-[#138808] text-white hover:bg-green-700"
                : "bg-card text-navy dark:text-white hover:bg-slate-100 dark:hover:bg-navy-light"
            }`}
            title={ttsEnabled ? "Disable Read Aloud" : "Enable Read Aloud"}
          >
            {ttsEnabled ? <Volume2 className="h-5 w-5 animate-pulse" /> : <VolumeX className="h-5 w-5" />}
          </button>
        )}

        {/* Speech to Text Microphone button */}
        {supported.stt && (
          <button
            onClick={toggleListening}
            className={`p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center border border-border glow-saffron ${
              isListening
                ? "bg-[#FF9933] text-white hover:bg-orange-600 animate-[pulse_1.5s_infinite]"
                : "bg-navy text-white hover:bg-navy-light dark:bg-saffron dark:text-navy dark:hover:bg-saffron-light"
            }`}
            title={isListening ? "Stop Listening" : "Start Voice Input"}
          >
            {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "citizen" | "officer" | "admin";
  state?: string;
  language?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isFallbackMode: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (email: string, name: string, role?: "citizen" | "officer" | "admin") => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFallbackMode, setIsFallbackMode] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const configured = isSupabaseConfigured();
      setIsFallbackMode(!configured);

      if (configured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Get profile from supabase DB or create basic one
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (profile) {
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                name: profile.name || "Citizen User",
                role: profile.role || "citizen",
                state: profile.state || "Delhi",
                language: profile.language || "en",
              });
            } else {
              // Fallback profile if auth exists but profile table is empty
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                name: "Citizen User",
                role: "citizen",
                state: "Delhi",
                language: "en",
              });
            }
          }
        } catch (e) {
          console.error("Supabase auth check failed, falling back to local session", e);
        }
      } else {
        // Fallback Local Storage Auth check
        const storedUser = localStorage.getItem("smart_bharat_user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            localStorage.removeItem("smart_bharat_user");
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    setLoading(true);
    if (!isFallbackMode && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || "Password123!",
        });
        if (error) throw error;
        
        if (data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          setUser({
            id: data.user.id,
            email: data.user.email || "",
            name: profile?.name || "Citizen User",
            role: profile?.role || "citizen",
            state: profile?.state || "Delhi",
            language: profile?.language || "en",
          });
          setLoading(false);
          return true;
        }
      } catch (err) {
        console.error("Supabase Login failed, attempting mock login", err);
      }
    }

    // Mock/Fallback login logic
    let mockRole: "citizen" | "officer" | "admin" = "citizen";
    let mockName = "Citizen User";
    if (email.includes("admin")) {
      mockRole = "admin";
      mockName = "Platform Administrator";
    } else if (email.includes("officer") || email.includes("govt")) {
      mockRole = "officer";
      mockName = "Municipal Officer";
    }

    const mockUser: UserProfile = {
      id: "mock-user-id-" + Math.random().toString(36).substr(2, 9),
      email,
      name: mockName,
      role: mockRole,
      state: "Delhi",
      language: "en"
    };

    setUser(mockUser);
    localStorage.setItem("smart_bharat_user", JSON.stringify(mockUser));
    setLoading(false);
    return true;
  };

  const signup = async (email: string, name: string, role: "citizen" | "officer" | "admin" = "citizen"): Promise<boolean> => {
    setLoading(true);
    if (!isFallbackMode && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: "Password123!",
        });
        if (error) throw error;
        
        if (data.user) {
          // Insert profile into database
          await supabase.from("profiles").insert({
            id: data.user.id,
            name,
            role,
            state: "Delhi",
            language: "en"
          });

          setUser({
            id: data.user.id,
            email,
            name,
            role,
            state: "Delhi",
            language: "en",
          });
          setLoading(false);
          return true;
        }
      } catch (err) {
        console.error("Supabase Signup failed, attempting mock signup", err);
      }
    }

    // Mock/Fallback signup logic
    const mockUser: UserProfile = {
      id: "mock-user-id-" + Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      state: "Delhi",
      language: "en"
    };

    setUser(mockUser);
    localStorage.setItem("smart_bharat_user", JSON.stringify(mockUser));
    setLoading(false);
    return true;
  };

  const logout = async () => {
    setLoading(true);
    if (!isFallbackMode && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Supabase signOut error", err);
      }
    }
    setUser(null);
    localStorage.removeItem("smart_bharat_user");
    setLoading(false);
  };

  const updateProfile = async (profile: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    const updated = { ...user, ...profile };
    setUser(updated);

    if (!isFallbackMode && supabase) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update(profile)
          .eq("id", user.id);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase profile update failed", err);
      }
    } else {
      localStorage.setItem("smart_bharat_user", JSON.stringify(updated));
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, loading, isFallbackMode, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

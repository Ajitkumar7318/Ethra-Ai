"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Member";
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load user from localStorage on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("flowforge_user");
      const token = localStorage.getItem("flowforge_token");
      if (stored && token) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("flowforge_token", data.token);
      localStorage.setItem("flowforge_user", JSON.stringify(data));
      setUser(data);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setError(null);
    try {
      const { data } = await api.post("/api/auth/register", { name, email, password });
      localStorage.setItem("flowforge_token", data.token);
      localStorage.setItem("flowforge_user", JSON.stringify(data));
      setUser(data);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("flowforge_token");
    localStorage.removeItem("flowforge_user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

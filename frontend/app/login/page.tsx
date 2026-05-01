"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Lock, Mail, Eye, EyeOff, CheckCircle2, Zap, LayoutDashboard, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const PWD_CHECKS = [
  { key: "length", label: "8+ chars", test: (p: string) => p.length >= 8 },
  { key: "upper",  label: "Uppercase", test: (p: string) => /[A-Z]/.test(p) },
  { key: "number", label: "Number",    test: (p: string) => /[0-9]/.test(p) },
  { key: "special",label: "Special char (@#!…)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function Login() {
  const [formData, setFormData]   = useState({ email: "", password: "" });
  const [showPwd, setShowPwd]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [errorMsg, setErrorMsg]   = useState("");
  const { login } = useAuth();

  const checks = PWD_CHECKS.map(c => ({ ...c, ok: c.test(formData.password) }));
  const allOk  = checks.every(c => c.ok);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allOk) { setErrorMsg("Password does not meet all requirements."); return; }
    setLoading(true); setErrorMsg("");
    try { await login(formData.email, formData.password); }
    catch (err: any) { setErrorMsg(err.response?.data?.message || "Invalid email or password."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0f1e]">
      {/* ── Left branding panel ───────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />

        <Link href="/" className="relative z-10 text-2xl font-bold tracking-tighter">
          FLOW<span className="text-blue-400">FORGE</span>
        </Link>

        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} className="relative z-10 space-y-8">
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Where great teams<br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">get things done.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md">FLOWFORGE unifies your projects, tasks, and team in one beautifully crafted workspace.</p>
          </div>
          <div className="space-y-3">
            {[
              { icon: LayoutDashboard, text: "Visual Kanban boards" },
              { icon: Users, text: "Team collaboration" },
              { icon: Zap, text: "Real-time progress tracking" },
              { icon: CheckCircle2, text: "Role-based access control" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400"><f.icon size={16} /></div>
                <span className="text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mini kanban preview */}
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.7, delay:0.3 }} className="relative z-10 glass rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-400" /><div className="w-2 h-2 rounded-full bg-yellow-400" /><div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-slate-500 ml-1">flowforge.app/dashboard</span>
          </div>
          <div className="flex gap-2">
            {["To Do","In Progress","Done"].map((col, i) => (
              <div key={i} className="flex-1 bg-white/5 rounded-xl p-2 space-y-1.5">
                <div className="text-[10px] font-medium text-slate-400 mb-1">{col}</div>
                {[...Array(i===1?1:2)].map((_, j) => (
                  <div key={j} className="h-6 rounded-lg bg-white/5 border border-white/10" style={{ opacity: 0.4 + j*0.3 }} />
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right form panel ─────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

        <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5 }} className="w-full max-w-md">
          <Link href="/" className="lg:hidden block text-2xl font-bold tracking-tighter mb-8">FLOW<span className="text-blue-400">FORGE</span></Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-slate-400">Sign in to continue to your workspace.</p>
          </div>

          {errorMsg && (
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {errorMsg}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors"><Mail size={18} /></div>
                <input type="email" required value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-slate-600 hover:border-white/20"
                  placeholder="you@company.com" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Link href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors"><Lock size={18} /></div>
                <input type={showPwd?"text":"password"} required value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-slate-600 hover:border-white/20"
                  placeholder="Your password" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors">
                  {showPwd ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
              {formData.password.length > 0 && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="mt-2 grid grid-cols-2 gap-1.5">
                  {checks.map(c => (
                    <div key={c.key} className={`flex items-center gap-1.5 text-xs transition-colors ${c.ok?"text-green-400":"text-slate-500"}`}>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 ${c.ok?"bg-green-500 border-green-500":"border-slate-600"}`}>
                        {c.ok && <CheckCircle2 size={9} className="text-white"/>}
                      </div>
                      {c.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]">
              {loading
                ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in...</>
                : <>Sign In <ArrowRight size={18}/></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Create one free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="absolute top-0 w-full flex justify-between items-center px-8 py-6 max-w-7xl mx-auto glass rounded-b-2xl z-50">
        <div className="text-2xl font-bold tracking-tighter">FLOWFORGE</div>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-medium">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-24 max-w-5xl w-full z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-sm font-medium">FLOWFORGE 1.0 is live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tight mb-6"
        >
          Forge Productivity.<br />
          <span className="text-gradient">Flow Seamlessly.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl"
        >
          The smart team task manager designed for speed, beauty, and modern collaboration. Stop managing work and start doing it.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center"
        >
          <Link 
            href="/register" 
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Start For Free <ArrowRight size={18} />
          </Link>
          <Link 
            href="/dashboard" 
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass hover:bg-white/10 transition-colors font-medium"
          >
            View Demo <LayoutDashboard size={18} />
          </Link>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24 mb-12 text-left"
        >
          {[
            { icon: LayoutDashboard, title: "Smart Kanban", desc: "Intuitive drag-and-drop boards to visualize your workflow." },
            { icon: Zap, title: "Real-time Sync", desc: "Instantly see updates from your team without refreshing." },
            { icon: Shield, title: "Role-based Access", desc: "Granular permissions for admins and members to keep data secure." },
          ].map((feature, i) => (
            <div key={i} className="glass p-6 rounded-2xl glass-hover">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}

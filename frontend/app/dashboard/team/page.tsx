"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Shield, UserPlus } from "lucide-react";
import api from "@/lib/api";

export default function TeamPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/team")
      .then((res) => setTeam(res.data))
      .catch(() => setTeam([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Team Members</h1>
          <p className="text-slate-400">Manage access and invite new collaborators.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <UserPlus size={18} /> Invite Member
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden mt-8">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-300">Name</th>
              <th className="px-6 py-4 font-medium text-slate-300">Email</th>
              <th className="px-6 py-4 font-medium text-slate-300">Role</th>
              <th className="px-6 py-4 font-medium text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={4} className="px-6 py-4">
                    <div className="h-6 bg-white/5 rounded animate-pulse w-full" />
                  </td>
                </tr>
              ))
            ) : team.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                  No team members yet.
                </td>
              </tr>
            ) : (
              team.map((member, i) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                        {member.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    <span className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-500" /> {member.email}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border font-medium ${member.role === "Admin" ? "bg-purple-500/20 text-purple-400 border-purple-500/20" : "bg-white/10 text-slate-300 border-white/10"}`}>
                      {member.role === "Admin" && <Shield size={12} />}
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

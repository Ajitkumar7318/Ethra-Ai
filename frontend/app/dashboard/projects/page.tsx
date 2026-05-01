"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Folder, MoreVertical, Plus, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/projects")
      .then((res) => setProjects(res.data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    await api.delete(`/api/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Projects</h1>
          <p className="text-slate-400">Manage your active workspaces and campaigns.</p>
        </div>
        {user?.role === "Admin" && (
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass p-6 rounded-2xl h-[220px] animate-pulse bg-white/5" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="mt-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Folder size={32} className="text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No projects yet</h3>
          <p className="text-slate-400">Create your first project to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="glass p-6 rounded-2xl glass-hover relative"
            >
              {user?.role === "Admin" && (
                <button
                  onClick={() => handleDelete(project.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <Folder size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-1 pr-8">{project.title}</h3>
              <p className="text-sm text-slate-400 mb-1 line-clamp-2">{project.description}</p>
              <p className="text-xs text-slate-500 mb-4">
                Due {new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>

              {project.members && project.members.length > 0 && (
                <div className="flex items-center gap-2 border-t border-white/10 pt-4">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 3).map((m: any) => (
                      <div key={m.id} className="w-8 h-8 rounded-full border-2 border-[#1e293b] bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                        {m.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{project.members.length} member{project.members.length !== 1 ? "s" : ""}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import api from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (task: any) => void;
}

export default function NewTaskModal({ open, onClose, onCreated }: Props) {
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [form, setForm] = useState({
    title: "", description: "", projectId: "",
    assignedTo: "", priority: "Medium", status: "To Do", dueDate: "",
  });

  useEffect(() => {
    if (!open) return;
    api.get("/api/projects").then(r => setProjects(r.data)).catch(() => {});
    api.get("/api/team").then(r => setUsers(r.data)).catch(() => {});
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.projectId || !form.dueDate) { setError("Title, project and due date are required."); return; }
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/api/tasks", {
        ...form,
        projectId:  Number(form.projectId),
        assignedTo: form.assignedTo ? Number(form.assignedTo) : undefined,
      });
      onCreated(data);
      setForm({ title:"",description:"",projectId:"",assignedTo:"",priority:"Medium",status:"To Do",dueDate:"" });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create task.");
    } finally { setLoading(false); }
  };

  const field = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-600 hover:border-white/20 transition-all text-sm";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}/>
          <motion.div initial={{opacity:0,scale:0.95,y:10}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:10}} transition={{duration:0.2}}
            className="relative w-full max-w-lg glass rounded-2xl p-6 border border-white/10 shadow-2xl z-10">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">Create New Task</h2>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><X size={20}/></button>
            </div>

            {error && <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
                <input className={field} placeholder="Task title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea className={`${field} resize-none`} rows={3} placeholder="What needs to be done?" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Project *</label>
                  <select className={field} value={form.projectId} onChange={e=>setForm({...form,projectId:e.target.value})}>
                    <option value="">Select project</option>
                    {projects.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Assignee</label>
                  <select className={field} value={form.assignedTo} onChange={e=>setForm({...form,assignedTo:e.target.value})}>
                    <option value="">Unassigned</option>
                    {users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                  <select className={field} value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                  <select className={field} value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                    <option>To Do</option><option>In Progress</option><option>Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Due Date *</label>
                  <input type="date" className={field} value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all text-sm disabled:opacity-60">
                  {loading?"Creating...":"Create Task"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

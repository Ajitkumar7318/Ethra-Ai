"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, AlertCircle, Plus } from "lucide-react";
import KanbanBoard from "@/components/KanbanBoard";
import dynamic from "next/dynamic";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import NewTaskModal from "@/components/NewTaskModal";

const AnalyticsChartWrapper = dynamic(
  () => import("@/components/AnalyticsChart").then(m => m.AnalyticsChart),
  { ssr: false }
);

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks]         = useState<any[]>([]);
  const [loadingTasks, setLoading]= useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get("/api/tasks")
      .then(r => setTasks(r.data))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const todo      = tasks.filter(t => t.status==="To Do").length;
  const inProgress= tasks.filter(t => t.status==="In Progress").length;
  const completed = tasks.filter(t => t.status==="Completed").length;
  const overdue   = tasks.filter(t => t.status!=="Completed" && new Date(t.dueDate)<now).length;

  const stats = [
    { label:"To Do",       value:todo,       icon:Clock,        color:"blue" },
    { label:"In Progress", value:inProgress, icon:Clock,        color:"yellow" },
    { label:"Completed",   value:completed,  icon:CheckCircle,  color:"green" },
    { label:"Overdue",     value:overdue,    icon:AlertCircle,  color:"red" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Good {new Date().getHours()<12?"morning":"evening"},{" "}{user?.name?.split(" ")[0]||"there"} 👋
          </h1>
          <p className="text-slate-400">Here&apos;s what&apos;s happening with your projects today.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          <Plus size={18}/> New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s,i)=>(
          <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.3,delay:i*0.07}}
            className={`glass p-5 rounded-2xl flex items-center justify-between ${s.color==="red"?"relative overflow-hidden":""}`}>
            {s.color==="red"&&<div className="absolute inset-0 bg-red-500/5"/>}
            <div className="relative z-10">
              <p className="text-sm text-slate-400 font-medium mb-1">{s.label}</p>
              <h3 className={`text-3xl font-bold ${s.color==="red"?"text-red-400":""}`}>{loadingTasks?"—":s.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center relative z-10 ${
              s.color==="blue"?"bg-blue-500/20 text-blue-400":
              s.color==="yellow"?"bg-yellow-500/20 text-yellow-400":
              s.color==="green"?"bg-green-500/20 text-green-400":
              "bg-red-500/20 text-red-400"}`}>
              <s.icon size={24}/>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-6">Weekly Productivity</h2>
          <div className="h-[280px]"><AnalyticsChartWrapper/></div>
        </div>
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-6">Task Breakdown</h2>
          <div className="space-y-4">
            {[
              {label:"Completed",  count:completed,  total:tasks.length, color:"bg-green-500"},
              {label:"In Progress",count:inProgress, total:tasks.length, color:"bg-blue-500"},
              {label:"To Do",      count:todo,        total:tasks.length, color:"bg-slate-500"},
            ].map(item=>(
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full transition-all duration-700`}
                    style={{width:tasks.length?`${(item.count/tasks.length)*100}%`:"0%"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Kanban Board</h2>
        <div className="h-[600px]">
          <KanbanBoard externalTasks={tasks} onTasksChange={setTasks}/>
        </div>
      </div>

      <NewTaskModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={task => setTasks(prev => [...prev, task])}
      />
    </div>
  );
}

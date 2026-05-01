import { Clock, MessageSquare, Paperclip } from "lucide-react";

export function TaskCard({ task }: { task: any }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":    return "bg-red-500/20 text-red-400 border-red-500/20";
      case "Medium":  return "bg-orange-500/20 text-orange-400 border-orange-500/20";
      case "Low":     return "bg-green-500/20 text-green-400 border-green-500/20";
      default:        return "bg-slate-500/20 text-slate-400 border-slate-500/20";
    }
  };

  // assignee can be an object {name: "..."} from the API, or a plain string from mock data
  const assigneeName: string =
    task.assignee && typeof task.assignee === "object"
      ? task.assignee.name ?? ""
      : (task.assignee ?? "");

  const initials = assigneeName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const dueLabel = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—";

  const isOverdue =
    task.status !== "Completed" &&
    task.dueDate &&
    new Date(task.dueDate) < new Date();

  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all cursor-grab active:cursor-grabbing shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <div className={`text-xs px-2 py-1 rounded-md border font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </div>
        {assigneeName && (
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm" title={assigneeName}>
            {initials || "?"}
          </div>
        )}
      </div>

      <h4 className="font-semibold text-white mb-1">{task.title}</h4>
      <p className="text-sm text-slate-400 line-clamp-2 mb-4">{task.description}</p>

      <div className="flex items-center justify-between text-slate-500 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 hover:text-white transition-colors">
            <MessageSquare size={14} /> 0
          </span>
          <span className="flex items-center gap-1 hover:text-white transition-colors">
            <Paperclip size={14} /> 0
          </span>
        </div>
        <div className={`flex items-center gap-1 ${isOverdue ? "text-red-400" : ""}`}>
          <Clock size={14} /> {dueLabel}
        </div>
      </div>
    </div>
  );
}

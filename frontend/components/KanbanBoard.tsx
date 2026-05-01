"use client";

import { useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { SortableTask } from "./SortableTask";
import { TaskCard } from "./TaskCard";
import api from "@/lib/api";

const columns = ["To Do", "In Progress", "Completed"];

interface KanbanBoardProps {
  externalTasks?: any[];
  onTasksChange?: (tasks: any[]) => void;
}

export default function KanbanBoard({ externalTasks, onTasksChange }: KanbanBoardProps) {
  const [localTasks, setLocalTasks] = useState<any[]>([
    { id: "1", title: "Design System", description: "Create the core design tokens", status: "To Do", priority: "High", assignee: { name: "JD" } },
    { id: "2", title: "Auth Flow", description: "Implement JWT based auth", status: "To Do", priority: "High", assignee: { name: "SA" } },
    { id: "3", title: "Landing Page", description: "Framer motion animations", status: "In Progress", priority: "Medium", assignee: { name: "JD" } },
    { id: "4", title: "Kanban Board", description: "Drag and drop functionality", status: "In Progress", priority: "High", assignee: { name: "SA" } },
    { id: "5", title: "Database Schema", description: "Mongoose models setup", status: "Completed", priority: "Low", assignee: { name: "JD" } },
  ]);

  const tasks = externalTasks && externalTasks.length > 0 ? externalTasks : localTasks;
  const setTasks = (updater: any) => {
    const updated = typeof updater === "function" ? updater(tasks) : updater;
    if (onTasksChange) onTasksChange(updated);
    else setLocalTasks(updated);
  };

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: any) => setActiveId(event.active.id);

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((prev: any[]) => {
        const activeIndex = prev.findIndex((t) => String(t.id) === String(activeId));
        const overIndex = prev.findIndex((t) => String(t.id) === String(overId));
        const updated = [...prev];
        if (updated[activeIndex].status !== updated[overIndex].status) {
          updated[activeIndex] = { ...updated[activeIndex], status: updated[overIndex].status };
        }
        return arrayMove(updated, activeIndex, overIndex);
      });
    }

    if (isActiveTask && isOverColumn) {
      setTasks((prev: any[]) => {
        const activeIndex = prev.findIndex((t) => String(t.id) === String(activeId));
        const updated = [...prev];
        updated[activeIndex] = { ...updated[activeIndex], status: overId };
        return updated;
      });
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const task = tasks.find((t) => String(t.id) === String(active.id));
    if (task) {
      try {
        await api.put(`/api/tasks/${task.id}`, { status: task.status });
      } catch {
        // ignore if not connected
      }
    }
  };

  const activeTask = activeId ? tasks.find((t) => String(t.id) === String(activeId)) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-full overflow-x-auto pb-4">
        {columns.map((col) => (
          <Column key={col} title={col} tasks={tasks.filter((t) => t.status === col)} />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function Column({ title, tasks }: { title: string; tasks: any[] }) {
  const { setNodeRef } = useDroppable({ id: title, data: { type: "Column" } });

  const columnColors: Record<string, string> = {
    "To Do": "text-slate-300",
    "In Progress": "text-blue-400",
    "Completed": "text-green-400",
  };

  return (
    <div className="flex-1 min-w-[300px] max-w-[340px] flex flex-col glass rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <h3 className={`font-semibold flex items-center gap-2 ${columnColors[title] || "text-white"}`}>
          {title}
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
            {tasks.length}
          </span>
        </h3>
      </div>

      <div ref={setNodeRef} className="p-3 flex-1 overflow-y-auto space-y-3">
        <SortableContext items={tasks.map((t) => String(t.id))} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTask key={task.id} task={task} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="h-24 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-500 text-sm">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

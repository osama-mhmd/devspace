"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SpaceUser } from "@/db/actions/spaces/get";
import { createTask, Task } from "@/db/actions/tasks/create";
import { updateTask } from "@/db/actions/tasks/update";
import debounce from "lodash.debounce";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteTask } from "@/db/actions/tasks/delete";

interface TasksTableProps {
  tasks: Task[];
  project_id: string;
  space_id: string;
  spaceUsers: SpaceUser[];
}

const sortTasks = (a: Task, b: Task) =>
  +new Date(a.created_at) - +new Date(b.created_at);

const TasksTable: React.FC<TasksTableProps> = ({
  tasks: _tasks,
  project_id,
  space_id,
  spaceUsers: users,
}) => {
  const [tasks, setTasks] = useState<Task[]>(_tasks);
  const [mode, setMode] = useState<"normal" | "delete" | "move">("normal");

  useEffect(() => {
    const doAction = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case "d":
        case "D":
          setMode((prev) => (prev == "delete" ? "normal" : "delete"));
          break;
      }
    };

    document.addEventListener("keypress", doAction);

    return () => document.removeEventListener("keypress", doAction);
  }, []);

  const addTask = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.value.trim();

    if (e.key !== "Enter" || !value) return;

    try {
      const newTask = await createTask({ project_id, title: value });
      setTasks((prev) => [...prev, newTask as Task]);
      target.value = "";
    } catch (error) {
      console.error("Failed to add task:", error);
      toast.error("Oops! Something went wrong while adding the task.");
    }
  };

  const changeTitle = debounce(
    async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
      const newTitle = e.target.value;
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, title: newTitle } : task,
        ),
      );
      try {
        await updateTask(id, { title: newTitle }, space_id);
      } catch {
        toast.error("Failed to save changes. Please try again.");
      }
    },
    500,
  );

  const changeAssignedTo = async (val: string, id: string) => {
    try {
      await updateTask(
        id,
        { assigned_to: val == "unassigned" ? null : val },
        space_id,
      );
    } catch {
      toast.error("Failed to save changes. Please try again.");
    }
  };
  const changeStatus = async (id: string, checked: boolean) => {
    const status = checked ? "done" : "todo";
    const previousTasks = tasks;

    try {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, status } : task)),
      );

      await updateTask(id, { status }, space_id);
    } catch {
      setTasks(previousTasks);
      toast.error("Failed to save changes. Please try again.");
    }
  };
  const removeTask = async (task: Task) => {
    if (mode !== "delete") return;

    setTasks((prev) => prev.filter((ts) => ts.id !== task.id));

    await deleteTask(task.id, space_id);

    toast("Task has been removed", {
      action: {
        label: "Undo",
        onClick: () => {
          setTasks((prev) => [...prev, task].sort(sortTasks));
          createTask(task);
        },
      },
    });
  };

  return (
    <section className="my-4">
      <div className="flex justify-end mb-2">
        <Button
          variant="outline"
          className={cn("px-3", {
            "bg-accent text-accent-foreground": mode == "delete",
            "hover:text-inherit hover:bg-inherit": mode !== "delete",
          })}
          onClick={() =>
            setMode((prev) => (prev == "delete" ? "normal" : "delete"))
          }
        >
          <Trash2 size={18} />
        </Button>
      </div>
      <div className="shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-muted/30">
              <tr className="tasks-table-header">
                <th scope="col" className="!pr-4"></th>
                <th scope="col">Task</th>
                <th scope="col">Description</th>
                <th scope="col">Importance</th>
                <th scope="col">Points</th>
                <th scope="col">Assigned To</th>
                <th scope="col">Due Date</th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-gray-200 dark:divide-gray-700">
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className={cn(
                    "group transition-colors duration-150 ease-in-out hover:bg-muted/10",
                    {
                      "opacity-50": task.status === "done",
                      "cursor-crosshair": mode === "delete",
                    },
                  )}
                  onClick={() => removeTask(task)}
                >
                  <td className="flex h-[50px] items-center justify-center">
                    <input
                      type="checkbox"
                      className={cn(
                        "size-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer hover:border-indigo-400 transition-colors",
                        {
                          "pointer-events-none": mode == "delete",
                        },
                      )}
                      onChange={(e) => changeStatus(task.id, e.target.checked)}
                      checked={task.status == "done"}
                    />
                  </td>
                  <td className="whitespace-nowrap">
                    <input
                      defaultValue={task.title}
                      onChange={(e) => changeTitle(e, task.id)}
                      className={cn("tasks-table-title-column", {
                        "line-through !text-muted-foreground":
                          task.status === "done",
                        "pointer-events-none": mode == "delete",
                      })}
                      disabled={task.status == "done"}
                      aria-label={`Edit task title: ${task.title}`}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {task.description || "-"}
                  </td>
                  <td className="tasks-table-columns">
                    {task.importance || "-"}
                  </td>
                  <td className="tasks-table-columns">{task.points || "-"}</td>
                  <td className="tasks-table-columns !py-1">
                    <Select
                      defaultValue={task.assigned_to || "unassigned"}
                      onValueChange={(val) => changeAssignedTo(val, task.id)}
                      disabled={task.status == "done"}
                    >
                      <SelectTrigger
                        className={cn("", {
                          "pointer-events-none": mode == "delete",
                        })}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {users.map((user) => (
                          <SelectItem
                            value={user.id}
                            key={user.username}
                            className="pe-8"
                          >
                            <Image
                              width={20}
                              height={20}
                              src={user.avatar!}
                              alt="avatar"
                              className="inline rounded-full mb-0.5 me-1.5"
                            />
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="tasks-table-columns">-</td>
                </tr>
              ))}
              <tr>
                <td colSpan={8}>
                  <input
                    placeholder="+ Add a new task and press Enter..."
                    onKeyDown={addTask}
                    className="px-6 py-4 w-full border-none bg-transparent focus:outline-none text-gray-600 dark:text-gray-400 placeholder-gray-400 dark:placeholder-gray-500 hover:bg-muted/25 transition-colors duration-150 ease-in-out"
                    aria-label="Add new task"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TasksTable;

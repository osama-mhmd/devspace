"use client";

import { Badge } from "@/components/ui/badge";
import { createTask, Task } from "@/db/actions/tasks/create";
import { updateTask } from "@/db/actions/tasks/update";
import debounce from "lodash.debounce";
import { useState } from "react";
import { toast } from "sonner";

interface TasksTableProps {
  tasks: Task[];
  project_id: string;
  space_id: string;
}

const TasksTable: React.FC<TasksTableProps> = ({
  tasks: _tasks,
  project_id,
  space_id,
}) => {
  const [tasks, setTasks] = useState(_tasks);

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

  return (
    <div className="bg-white dark:bg-gray-900 shadow-xl rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 my-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr className="tasks-table-header">
              <th scope="col">Task Name 📝</th>
              <th scope="col">Description</th>
              <th scope="col">Status</th>
              <th scope="col">Importance</th>
              <th scope="col">Points</th>
              <th scope="col">Assigned To</th>
              <th scope="col">Due Date</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="group transition-colors duration-150 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="whitespace-nowrap">
                  <input
                    defaultValue={task.title}
                    onChange={(e) => changeTitle(e, task.id)}
                    className="tasks-table-title-column"
                    aria-label={`Edit task title: ${task.title}`}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                  {task.description || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge>{task.status}</Badge>
                </td>
                <td className="tasks-table-columns">
                  {task.importance || "-"}
                </td>
                <td className="tasks-table-columns">{task.points || "-"}</td>
                <td className="tasks-table-columns">
                  {task.assigned_to || "-"}
                </td>
                <td className="tasks-table-columns">-</td>
              </tr>
            ))}
            <tr>
              <td colSpan={8}>
                <input
                  placeholder="+ Add a new task and press Enter..."
                  onKeyDown={addTask}
                  className="px-6 py-4 w-full border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600 dark:text-gray-400 placeholder-gray-400 dark:placeholder-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 ease-in-out rounded-b-md"
                  aria-label="Add new task"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksTable;

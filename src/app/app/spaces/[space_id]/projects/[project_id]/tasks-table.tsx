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
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { deleteTask } from "@/db/actions/tasks/delete";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Document } from "@/db/actions/documents/get";
import createDocument from "@/db/actions/documents/create";
import DocumentModal from "./document-modal";
import { FullTask } from "@/db/actions/tasks/get";

interface TasksTableProps {
  tasks: FullTask[];
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
  const [tasks, setTasks] = useState(_tasks);
  const [document, setDocument] = useState<Document | null>(null);

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

  const openDocument = async (task: FullTask) => {
    let document = task.document;

    if (!document) {
      document = await createDocument({
        space_id: space_id,
        for_id: task.id,
        title: task.title,
        content: task.description,
        for: "task",
      });

      setTasks((prev) =>
        prev.map((ts) => (ts.id === task.id ? { ...task, document } : ts)),
      );
    }

    setDocument(document);
  };

  return (
    <section className="my-4">
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
                <ContextMenu key={task.id}>
                  <ContextMenuTrigger asChild>
                    <tr
                      className={cn(
                        "group transition-colors duration-150 ease-in-out hover:bg-muted/10",
                        {
                          "opacity-50": task.status === "done",
                        },
                      )}
                    >
                      <td className="flex h-[50px] items-center justify-center">
                        <input
                          type="checkbox"
                          className="size-4 cursor-pointer"
                          onChange={(e) =>
                            changeStatus(task.id, e.target.checked)
                          }
                          checked={task.status == "done"}
                        />
                      </td>
                      <td className="whitespace-nowrap relative">
                        <input
                          defaultValue={task.title}
                          onChange={(e) => changeTitle(e, task.id)}
                          className={cn("tasks-table-title-column", {
                            "line-through !text-muted-foreground":
                              task.status === "done",
                          })}
                          disabled={task.status == "done"}
                          aria-label={`Edit task title: ${task.title}`}
                        />
                        <span
                          role="button"
                          onClick={() => openDocument(task)}
                          className="rounded-md opacity-0 group-hover:opacity-100 transition bg-muted p-1.5 px-2 absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 14 14"
                          >
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M8.403.419c-.94 0-1.854.093-2.72.192a2.59 2.59 0 0 0-2.275 2.281c-.095.863-.182 1.771-.182 2.705c0 .933.087 1.841.182 2.704a2.59 2.59 0 0 0 2.275 2.281c.866.1 1.78.192 2.72.192s1.855-.093 2.72-.192A2.59 2.59 0 0 0 13.4 8.301c.095-.863.182-1.771.182-2.704s-.087-1.842-.182-2.705A2.59 2.59 0 0 0 11.124.611c-.866-.099-1.78-.192-2.72-.192Zm1.553 6.695a.75.75 0 0 1-.576-.44a5 5 0 0 0-.345-.65L7.28 7.78a.75.75 0 1 1-1.06-1.06l1.753-1.754a5 5 0 0 0-.642-.34a.75.75 0 0 1-.44-.576a.67.67 0 0 1 .399-.71c.426-.19.956-.247 1.461-.206c.51.042 1.047.189 1.493.456a.5.5 0 0 1 .172.172c.268.446.414.983.456 1.493c.042.506-.015 1.035-.206 1.462a.67.67 0 0 1-.71.398ZM1.802 5.16a.75.75 0 0 0-1.478-.252c-.057.33-.155 1.228-.155 2.43c0 1.29.135 2.543.267 3.714a2.84 2.84 0 0 0 2.492 2.499c1.175.136 2.436.28 3.735.28a17 17 0 0 0 2.185-.128a.75.75 0 0 0-.221-1.483c-.226.034-.978.111-1.964.111c-1.2 0-2.378-.133-3.562-.27a1.34 1.34 0 0 1-1.175-1.176C1.794 9.71 1.67 8.533 1.67 7.337c0-1.134.094-1.945.133-2.177Z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {task.description || "-"}
                      </td>
                      <td className="tasks-table-columns">
                        {task.importance || "-"}
                      </td>
                      <td className="tasks-table-columns">
                        {task.points || "-"}
                      </td>
                      <td className="tasks-table-columns !py-1">
                        <Select
                          defaultValue={task.assigned_to || "unassigned"}
                          onValueChange={(val) =>
                            changeAssignedTo(val, task.id)
                          }
                          disabled={task.status == "done"}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">
                              Unassigned
                            </SelectItem>
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
                  </ContextMenuTrigger>
                  <ContextMenuContent className="min-w-52">
                    <ContextMenuItem
                      onClick={() => removeTask(task)}
                      className="text-red-400"
                    >
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
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
      {document && (
        <DocumentModal
          document={document}
          dismiss={setDocument}
          space_id={space_id}
        />
      )}
    </section>
  );
};

export default TasksTable;

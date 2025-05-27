"use server";

import db from "@/db";
import { tasksTable } from "@/db/schemas";
import { generateIdFromEntropySize } from "lucia";
import { getProject } from "../projects/get";
import $user from "../spaces/permission";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  created_at: Date;
  updated_at: Date | null;
  importance: number | null;
  points: number | null;
  status: "todo" | "in_progress" | "done" | null;
  parent: string | null;
  assigned_to: string | null;
  due_to: Date | null;
}

type CreateTaskInput = { title: string; project_id: string } & Partial<
  Omit<Task, "created_at" | "updated_at">
>;

export async function createTask(input: CreateTaskInput) {
  try {
    if (!input.title || !input.project_id) {
      throw new Error("Title and project_id are required");
    }

    const project = await getProject(input.project_id);

    if (!project)
      throw new Error("There's no project with the 'ID' you provided");

    const { permission } = await $user(project.space_id);

    if (permission == "no-access") throw new Error("Unauthorized request");

    const id = input.id ?? generateIdFromEntropySize(16);

    const [result] = await db
      .insert(tasksTable)
      .values({ id, ...input })
      .returning();

    return result;
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task");
  }
}

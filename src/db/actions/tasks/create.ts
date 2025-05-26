"use server";

import db from "@/db";
import { tasksTable } from "@/db/schemas";
import { generateIdFromEntropySize } from "lucia";

export interface Task {
  id: string;
  title: string;
  description?: string;
  project_id: string;
  created_at: Date;
  updated_at?: Date;
  importance?: number;
  points?: number;
  status?: "todo" | "in_progress" | "done";
  parent?: string;
  assigned_to?: string;
  due_to?: Date;
}

type CreateTaskInput = Omit<Task, "id" | "created_at" | "updated_at">;

export async function createTask(input: CreateTaskInput) {
  try {
    const id = generateIdFromEntropySize(16);

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

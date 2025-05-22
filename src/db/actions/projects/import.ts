"use server";

import { validateRequest } from "@/db/auth";

/**
 * @description there a lot of fields, but I will keep it simple
 */
export interface Repo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    url: string;
  };
  description: string;
  url: string;
  created_at: Date;
  updated_at: Date;
  arhieved: boolean;
  froks: number;
  open_issues: number;
  watchers: number;
  html_url: string;
}

export async function getUserRepos(): Promise<Repo[]> {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized access");

  const res = await fetch("https://api.github.com/user/repos", {
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user repos");

  const repos = (await res.json()) as Repo[];

  // console.log(repos);

  return repos;
}

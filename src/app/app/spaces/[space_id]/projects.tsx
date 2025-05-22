"use client";

import { Github } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Step, Steps } from "@/components/ui/steps";
import { Textarea } from "@/components/ui/textarea";
import createProject from "@/db/actions/projects/create";
import { ProjectToCreate as Project } from "@/db/actions/projects/create";
import { getSpaceProjects } from "@/db/actions/projects/get";
import { getUserRepos, Repo } from "@/db/actions/projects/import";
import { cn, timeAgo } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import NextLink from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  Calendar,
  Users,
  ArrowRight,
  Search,
  X,
  SearchX,
} from "lucide-react";
import { toast } from "sonner";
import { queryClient } from "@/app/query-client-provider";
import { motion } from "framer-motion";

const Link = motion(NextLink);

const sortRepos = (a: Repo, b: Repo) =>
  +new Date(b.updated_at) - +new Date(a.updated_at);

export default function Projects({ spaceId }: { spaceId: string }) {
  const {
    data: repos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["repos"],
    queryFn: getUserRepos,
  });
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects", spaceId],
    queryFn: async () => await getSpaceProjects(spaceId),
  });
  const [data, setData] = useState<Partial<Project>>({});
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const importRepo = async () => {
    if (!data.name?.trim()) {
      toast.error("Please enter a name");
      return;
    }

    setLoading(true);

    await createProject({ ...(data as Project), name: data.name.trim() });

    setOpen(false);
    setLoading(false);

    queryClient.invalidateQueries({ queryKey: ["projects", spaceId] });
  };

  const clearSelection = () => {
    setData({});
  };

  const filteredRepos = repos?.filter(
    (repo) =>
      repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="border p-4 rounded-md flex flex-col gap-4">
      <h3 className="mt-0">Projects</h3>
      {projects && projects.length == 0 && <i>No projects</i>}
      {projectsLoading && <i>Fetching projects</i>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project) => (
          <Link
            href={`/app/spaces/${spaceId}/projects/${project.id}`}
            key={project.id}
            className="group"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="h-full transition-all duration-200 hover:shadow-md border-border/50 hover:border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <h3 className="my-0 font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                  </div>
                  <Badge className="text-xs">Active</Badge>
                </div>

                {project.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    {project.updated_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Updated {timeAgo(project.updated_at)}</span>
                      </div>
                    )}
                    {project && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>1</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity gap-0.5"
                  >
                    Open <ArrowRight size={14} className="mt-0.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex items-center gap-1 border rounded-md p-4 justify-center cursor-pointer hover:bg-muted/30 transition">
            Import from GitHub
            <span className="mb-0.5">
              <Github />
            </span>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Import from GitHub</DialogTitle>
          <Steps>
            <Step nextDisabled={!data.repo_name} step={0} key={0}>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {data.repo_name && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Selected: {data.repo_name}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSelection}
                      className="text-xs gap-1"
                    >
                      <X className="size-3 mt-[1px]" />
                      Clear
                    </Button>
                  </div>
                )}

                <div className="border rounded-md *:p-4 *:py-3 [&>*:not(:last-child)]:border-b max-h-64 overflow-y-auto">
                  {isLoading && (
                    <div className="text-center">
                      <span className="spinner"></span>
                    </div>
                  )}
                  {error && (
                    <div className="text-center text-red-600 dark:text-red-400">
                      Error occured while fetching repos
                    </div>
                  )}
                  {filteredRepos &&
                    filteredRepos.length === 0 &&
                    !isLoading && (
                      <div className="!py-12 text-center text-muted-foreground flex flex-col gap-2 items-center">
                        <SearchX size={40} />
                        No repositories found
                      </div>
                    )}
                  {filteredRepos?.sort(sortRepos).map((repo) => (
                    <div
                      key={repo.id}
                      className={cn(
                        "flex justify-between items-center cursor-pointer hover:bg-muted/50",
                        {
                          "bg-primary/10 text-primary":
                            data.repo_name === repo.name,
                        },
                      )}
                      onClick={() => {
                        setData({
                          name: repo.name,
                          description: repo.description,
                          space_id: spaceId,
                          repo_owner: repo.owner.login,
                          repo_name: repo.name,
                          preview_link: repo.html_url,
                        });
                      }}
                    >
                      <label
                        htmlFor={repo.full_name}
                        className="cursor-pointer"
                      >
                        {repo.full_name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </Step>
            <Step
              step={1}
              key={1}
              nextString="Create"
              nextLoading={loading}
              nextAction={importRepo}
            >
              <h4 className="my-0">Project Details</h4>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="name">Name *</label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="description">Description</label>
                  <Textarea
                    id="description"
                    name="description"
                    value={data.description ?? ""}
                    onChange={(e) =>
                      setData({ ...data, description: e.target.value })
                    }
                  />
                </div>
              </div>
            </Step>
          </Steps>
        </DialogContent>
      </Dialog>
    </div>
  );
}

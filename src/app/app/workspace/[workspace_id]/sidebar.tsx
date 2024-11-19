"use client";

import React, {
  ElementRef,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMediaQuery } from "usehooks-ts";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { ChevronsLeft, ChevronsRight, House } from "lucide-react";
import Link from "next/link";
import WorkspaceSettings from "./workspace-settings";
import {
  Panel,
  PanelBody,
  PanelHeader,
  PanelTrigger,
} from "../../../../components/ui/panel";
import { Permission } from "@/db/actions/workspaces/permission";
import { Workspace } from "@/db/actions/workspaces/get-workspaces";
import dir from "@/lib/dir";

const Sidebar = ({
  workspace,
  permission,
}: {
  workspace: Workspace;
  permission: Permission;
}) => {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth: number;
    if (dir() == "ltr") newWidth = e.clientX;
    else newWidth = document.body.clientWidth - e.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty(dir("css"), `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`,
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "240px" : "240px";
      navbarRef.current.style.removeProperty("width");
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "240px" : "calc(100%-240px)",
      );
      navbarRef.current.style.setProperty(dir("css"), isMobile ? "0" : "240px");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty(dir("css"), "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar px-3 z-[15] flex h-screen w-60 flex-col bg-secondary sticky top-0 start-0",
          isResetting &&
            "transition-all duration-300 ease-in-out overflow-y-auto",
          isMobile && "w-0",
          isCollapsed && "px-0 overflow-y-auto",
        )}
        suppressHydrationWarning={true}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "absolute end-2 top-3 size-8 rounded-sm text-muted-foreground opacity-0 transition hover:bg-primary/10 group-hover/sidebar:opacity-100",
            isMobile && "opacity-100",
          )}
          suppressHydrationWarning={true}
        >
          {dir() == "ltr" ? (
            <ChevronsLeft className="size-8 p-1" />
          ) : (
            <ChevronsRight className="size-8 p-1" />
          )}
        </div>
        {permission == "owner" && (
          <Panel>
            <PanelTrigger className="p-4 px-6 cursor-pointer rounded-md bg-primary/20 w-fit mt-6 mb-2">
              L
            </PanelTrigger>
            <PanelBody>
              <PanelHeader>
                <h2 className="my-0">Settings</h2>
              </PanelHeader>
              <WorkspaceSettings workspace={workspace} />
            </PanelBody>
          </Panel>
        )}
        {permission !== "owner" && (
          <div className="p-4 px-6 rounded-md bg-primary/20 w-fit mt-6 mb-2">
            L
          </div>
        )}
        <Link
          href={`/app/workspace/${workspace.id}`}
          className="flex gap-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 items-center py-2 px-3 rounded-md transition"
        >
          <House width={20} /> Home
        </Link>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className={`absolute ${dir() == "ltr" ? "right" : "left"}-0 top-0 h-full w-1 cursor-ew-resize bg-primary/10 opacity-0 transition group-hover/sidebar:opacity-100`}
        ></div>
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          `absolute ${dir("css")}-60 top-0 z-20 w-[calc(100%-240px)]`,
          isResetting && "transition-all duration-300 ease-in-out",
          isMobile && `${dir("css")}-0 w-full`,
        )}
      >
        <nav
          className={cn(
            "w-full bg-transparent px-3 py-2",
            !isCollapsed && "p-0",
          )}
        >
          {isCollapsed && <Open fn={resetWidth} />}
        </nav>
      </div>
    </>
  );
};

function Open({ fn }: { fn: MouseEventHandler<SVGSVGElement> }) {
  return dir() == "ltr" ? (
    <ChevronsRight
      onClick={fn}
      role="button"
      className="size-8 bg-white p-1 rounded-md bg-primary/10 text-muted-foreground"
    />
  ) : (
    <ChevronsLeft
      onClick={fn}
      role="button"
      className="size-8 bg-white p-1 rounded-md bg-primary/10 text-muted-foreground"
    />
  );
}

export default Sidebar;

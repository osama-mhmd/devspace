"use client";

import { merienda } from "@/lib/fonts";
import { ChartPie, LayoutDashboard, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppNavbar() {
  const pathname = usePathname();

  let shouldNotRender = /^\/app\/workspace\/?(.*)$/.test(pathname);
  if (pathname == "/app/workspace/create") shouldNotRender = false;
  if (pathname == "/app/dashboard") shouldNotRender = true;

  return shouldNotRender ? null : (
    <nav className="py-4 bg-muted app-nav">
      <div className="container py-2 px-6 flex items-center justify-between">
        <Link href="/app" className={"font-bold " + merienda}>
          DevSpace App
        </Link>
        <ul className="flex gap-3 py-2 sm:py-0 items-center px-0 list-none *:transition">
          <li className="hover:scale-125 hover:-translate-y-1">
            <Link href="/app/profile">
              <UserCircle />
            </Link>
          </li>
          <li className="hover:scale-125 hover:-translate-y-1">
            <Link href="/app/statistics">
              <ChartPie />
            </Link>
          </li>
          <li className="hover:scale-125 hover:-translate-y-1">
            <Link href="/app/dashboard">
              <LayoutDashboard />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

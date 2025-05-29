"use client";

import { Button } from "../components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Globe, List } from "lucide-react";
import { Session } from "lucia";
import { ThemeToggle } from "@/components/change-theme";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import {
  AvailableLanguageTag,
  languageTag,
  setLanguageTag,
} from "@/paraglide/runtime";
import dir, { Direction } from "@/lib/dir";
import * as m from "@/paraglide/messages";
import { Rocket } from "@/components/icons";
import CallAuthorize from "@/components/authorize";

export default function Nav({
  session,
  lang,
}: {
  session: Session | null;
  lang: AvailableLanguageTag;
}) {
  const pathname = usePathname();
  setLanguageTag(lang);

  const shouldNotRender = /^\/app\/?(.*)$/.test(pathname);

  function changeLanguage(val: AvailableLanguageTag) {
    document.cookie = `lang=${val}; path=/`;
    console.log(val);
    window.location.reload();
  }

  return shouldNotRender ? null : (
    <nav className="flex justify-center px-4">
      <div className="bg-background border sticky top-0 w-full z-20 px-8 py-4 max-w-7xl shadow-2xl mt-4 rounded-full flex items-center justify-between">
        <Link href="/" className="lilita contain-icons">
          DS <Rocket size={25} />
        </Link>
        <ul className="[&>li]:hidden [&>li]:sm:block flex gap-3 py-2 sm:py-0 items-center px-0 list-none">
          <List className="block sm:hidden cursor-pointer" />
          <li>
            <Button asChild variant="link">
              <Link href="/pricing">Pricing</Link>
            </Button>
          </li>
          <li>
            {session && (
              <Button asChild variant="link" arrow="has">
                <Link href="/app" className="contain-icons">
                  {m.app()}
                </Link>
              </Button>
            )}
            {!session && <CallAuthorize variant="link">Login</CallAuthorize>}
          </li>
          <li>
            <ThemeToggle />
          </li>
          <li>
            <Select
              dir={dir() as Direction}
              defaultValue={languageTag()}
              onValueChange={changeLanguage}
            >
              <SelectTrigger className="flex items-center gap-1.5">
                <span className="capitalize">{languageTag()}</span> <Globe />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </li>
        </ul>
      </div>
    </nav>
  );
}

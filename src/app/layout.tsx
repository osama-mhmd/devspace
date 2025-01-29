import { inter, lilita, rubik } from "@/lib/fonts";
import Nav from "@/app/nav";
import { validateRequest } from "@/db/auth";
import { Metadata } from "next";
import { Toaster } from "sonner";
import Footer from "./footer";

import "@/styles/globals.css";
import { ThemeProvider } from "./theme-provider";

import {
  availableLanguageTags,
  languageTag,
  setLanguageTag,
} from "@/paraglide/runtime";
import { cookies } from "next/headers";
import dir from "@/lib/dir";

export const metadata: Metadata = {
  title: {
    template: "%s | DevSpace",
    default: "Homepage | DevSpace",
  },
  description:
    "Everyday you see a new note taking app appears, but they all don't fit you. Don't worry, this app will fit you",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session } = await validateRequest();

  const cookieLang = (await cookies()).get("lang")?.value;

  availableLanguageTags.forEach((tag) => {
    if (tag == cookieLang) {
      setLanguageTag(tag);
    }
  });

  return (
    <html lang={languageTag()} suppressHydrationWarning>
      <body
        className={`${rubik} ${inter} ${lilita} ${dir()} ${languageTag()} font-inter`}
      >
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          defaultTheme="system"
          enableSystem
        >
          <Nav session={session} lang={languageTag()} />
          {children}
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

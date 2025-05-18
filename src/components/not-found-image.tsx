"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

export default function NotFoundImage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Skeleton className="w-[360px] h-60" />;

  return (
    <Image
      src={`/not-found-${resolvedTheme}.svg`}
      alt="not found"
      width={360}
      height={240}
    />
  );
}

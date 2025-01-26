"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function From1To2() {
  const [isLoaded, setLoaded] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!isLoaded) return;

  return (
    <>
      {theme == "dark" && (
        <Image
          width={50}
          height={50}
          className="w-full h-56 object-cover"
          alt="design"
          src="/from-1-to-2.svg"
        />
      )}
      {theme == "light" && (
        <Image
          width={50}
          height={50}
          className="w-full h-56 object-cover"
          alt="design"
          src="/from-1-to-2-dark.svg"
        />
      )}
    </>
  );
}

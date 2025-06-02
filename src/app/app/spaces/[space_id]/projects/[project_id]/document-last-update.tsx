import { timeAgo } from "@/lib/utils";
import React, { useState, useEffect } from "react";

export default function DocumentLastUpdate({
  updated_at,
}: {
  updated_at: Date | null;
}) {
  const [displayTime, setDisplayTime] = useState("");

  useEffect(() => {
    if (!updated_at) {
      setDisplayTime("");
      return;
    }

    setDisplayTime(timeAgo(updated_at));

    const intervalId = setInterval(() => {
      setDisplayTime(timeAgo(updated_at));
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [updated_at]);

  if (!updated_at) return null;

  return <span>Last edited {displayTime}</span>;
}

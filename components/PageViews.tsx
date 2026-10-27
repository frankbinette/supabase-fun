"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Counts this visit through the page-views Edge Function and shows the total.
export default function PageViews({ path }: { path: string }) {
  const [views, setViews] = useState<number>();
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current) return; // React runs effects twice in dev; count once.
    counted.current = true;
    createClient()
      .functions.invoke<{ views: number }>("page-views", { body: { path } })
      .then(({ data }) => setViews(data?.views));
  }, [path]);

  if (views === undefined) return null;
  return <p className="text-muted small">👀 {views.toLocaleString("en-US")} {views === 1 ? "view" : "views"}</p>;
}

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// "N people reading now", using Supabase Realtime Presence across every page of the site.
export default function ReadersBadge() {
  const [readers, setReaders] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel("readers", { config: { presence: { key: crypto.randomUUID() } } });

    channel
      .on("presence", { event: "sync" }, () => setReaders(Object.keys(channel.presenceState()).length))
      .subscribe((status) => {
        if (status === "SUBSCRIBED") channel.track({ online_at: new Date().toISOString() });
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!readers) return null;
  return (
    <span className="badge badge-pill badge-light">
      <span className="text-success">●</span> {readers} {readers === 1 ? "person" : "people"} reading now
    </span>
  );
}

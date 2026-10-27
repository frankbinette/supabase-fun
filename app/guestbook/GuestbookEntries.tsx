"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { formatShortDate } from "@/lib/dates";
import type { GuestbookEntry } from "@/lib/guestbook";
import { createClient } from "@/lib/supabase/client";
import { deleteEntry } from "./actions";

export default function GuestbookEntries({ entries, canDelete }: { entries: GuestbookEntry[]; canDelete: boolean }) {
  const [pending, startTransition] = useTransition();
  const [inserted, setInserted] = useState<GuestbookEntry[]>([]);
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());

  // Live updates from Supabase Realtime, layered on top of the server-rendered entries.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("guestbook")
      .on<GuestbookEntry>(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "guestbook_entries" },
        ({ new: entry }) => setInserted((previous) => [entry, ...previous]),
      )
      .on<GuestbookEntry>(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "guestbook_entries" },
        ({ old }) => {
          if (old.id !== undefined) setDeletedIds((previous) => new Set(previous).add(old.id!));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const visible = useMemo(() => {
    const byId = new Map<number, GuestbookEntry>();
    for (const entry of [...inserted, ...entries]) if (!byId.has(entry.id)) byId.set(entry.id, entry);
    return [...byId.values()]
      .filter((entry) => !deletedIds.has(entry.id))
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [inserted, entries, deletedIds]);

  if (!visible.length) return <p className="text-muted">No entries yet. Be the first!</p>;

  return (
    <ul className="list-unstyled">
      {visible.map((entry) => (
        <li key={entry.id} className="media mb-3">
          <div className="media-body">
            <h5 className="mt-0 mb-1">
              {entry.name} <small className="text-muted">{formatShortDate(new Date(entry.created_at))}</small>
            </h5>
            <p className="mb-1" style={{ whiteSpace: "pre-wrap" }}>{entry.message}</p>
            {canDelete && (
              <button
                className="btn btn-sm btn-outline-danger"
                disabled={pending}
                onClick={() => startTransition(() => deleteEntry(entry.id))}
              >
                Delete
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

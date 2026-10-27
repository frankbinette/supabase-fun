"use client";

import { useTransition } from "react";
import { formatShortDate } from "@/lib/dates";
import type { GuestbookEntry } from "@/lib/guestbook";
import { deleteEntry } from "./actions";

export default function GuestbookEntries({ entries, canDelete }: { entries: GuestbookEntry[]; canDelete: boolean }) {
  const [pending, startTransition] = useTransition();

  if (!entries.length) return <p className="text-muted">No entries yet. Be the first!</p>;

  return (
    <ul className="list-unstyled">
      {entries.map((entry) => (
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

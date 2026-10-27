"use client";

import { useActionState, useEffect, useRef } from "react";
import { signGuestbook, type SignState } from "./actions";

export default function GuestbookForm({ defaultName }: { defaultName: string }) {
  const [state, formAction, pending] = useActionState<SignState, FormData>(signGuestbook, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="mb-4">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" className="form-control" maxLength={60} defaultValue={defaultName} required />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" className="form-control" rows={3} maxLength={500} required />
      </div>
      {state.error && <div className="alert alert-danger">{state.error}</div>}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Signing…" : "Sign the guestbook"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const githubEnabled = process.env.NEXT_PUBLIC_GITHUB_LOGIN === "true";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string>();

  const redirectTo = () => `${window.location.origin}/auth/callback?next=/guestbook`;

  async function sendMagicLink(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError(undefined);
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo() },
    });
    if (error) {
      setError(error.message);
      setStatus("idle");
    } else {
      setStatus("sent");
    }
  }

  async function signInWithGitHub() {
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: redirectTo() },
    });
    if (error) setError(error.message);
  }

  if (status === "sent") {
    return (
      <div className="alert alert-success">
        Check your inbox for a sign-in link. Running locally? Emails land in{" "}
        <a href="http://127.0.0.1:54324" target="_blank" rel="noreferrer">Mailpit</a>.
      </div>
    );
  }

  return (
    <>
      <form onSubmit={sendMagicLink} className="mb-3">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Email me a magic link"}
        </button>
      </form>
      {githubEnabled && (
        <button type="button" className="btn btn-dark" onClick={signInWithGitHub}>
          Sign in with GitHub
        </button>
      )}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </>
  );
}

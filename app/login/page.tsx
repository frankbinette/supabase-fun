import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Title from "@/components/Title";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in · Frank Binette" };

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <>
      <Title title="Sign in" subtitle="Sign in to leave a message in the guestbook. No password needed." />
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <hr className="py-1" />
            {error && <div className="alert alert-warning">{error}</div>}
            <LoginForm />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

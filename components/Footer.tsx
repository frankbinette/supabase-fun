import Link from "next/link";
import ReadersBadge from "./ReadersBadge";

const credit = `©${new Date().getFullYear()} frankbinette. Made for fun with Next.js, Bootstrap, Supabase.`;

export default function Footer({ withNav = false }: { withNav?: boolean }) {
  return (
    <footer className="text-muted">
      <div className="container py-4">
        <hr />
        {withNav ? (
          <div className="row">
            <div className="col">
              <p>
                <Link href="/" className="text-muted">Home</Link>
              </p>
            </div>
            <div className="col-7">
              <p className="text-center">{credit}</p>
              <p className="text-center"><ReadersBadge /></p>
            </div>
            <div className="col">
              <p className="text-right">
                <a href="#" className="text-muted">Top</a>
              </p>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col">
              <p className="text-center">{credit}</p>
              <p className="text-center"><ReadersBadge /></p>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}

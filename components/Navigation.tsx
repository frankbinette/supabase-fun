import Image from "next/image";
import Link from "next/link";

const links = [
  { name: "About", href: "/about" },
  { name: "Notes", href: "/notes" },
  { name: "Guestbook", href: "/guestbook" },
];

export default function Navigation() {
  return (
    <div className="container">
      <nav className="navbar navbar-expand navbar-light rounded" style={{ marginTop: 20, backgroundColor: "#FFFFFF" }}>
        <Link href="/" className="navbar-brand">
          <Image src="/assets/img/fvb-logo-64.png" width={36} height={36} alt="FVB" />
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto">
            {links.map((link) => (
              <li className="nav-item" key={link.href}>
                <Link className="nav-link" href={link.href}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="col-md-12">
        <hr />
      </div>
    </div>
  );
}

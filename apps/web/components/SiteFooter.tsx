import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="ribbon" aria-hidden="true" />
      <div className="wrap site-footer-inner">
        <p className="footer-note">
          India Business One is an independent, open-source citizen project. It is not affiliated with any government body.
          The competent authority makes every decision. Screens show sample data.
        </p>
        <ul className="footer-links">
          <li>
            <a href="https://github.com/harikanthl/IndiaOne">Source code on GitHub</a>
          </li>
          <li>
            <Link href="/credits">Art credits</Link>
          </li>
          <li>
            <a href="https://github.com/harikanthl/IndiaOne/blob/main/CONTRIBUTING.md">Contribute</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

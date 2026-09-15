import Link from "next/link";
import { ArrowLeft } from "@/components/Icon";

/** Themed 404: keeps the site's world and always offers the way back to the work. */
export default function NotFound() {
  return (
    <main className="case not-found">
      <div className="container">
        <h1 className="display case-title">Page not found</h1>
        <p className="lead">This link may be old or mistyped. All of the work is still here.</p>
        <div className="case-actions">
          <Link href="/" className="pill">
            <ArrowLeft />
            Back to all work
          </Link>
        </div>
      </div>
    </main>
  );
}

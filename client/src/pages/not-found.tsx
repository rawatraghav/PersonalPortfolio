import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
          404
        </p>
        <h1 className="mt-3 font-serif text-5xl tracking-tight">Page not found</h1>
        <p className="mt-4 text-muted-foreground">
          That address is not part of this site.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center bg-primary px-5 text-sm font-medium text-primary-foreground"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

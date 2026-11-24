import { FormEvent, useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Clock, Globe, MapPin, Monitor, Smartphone, Tablet } from "lucide-react";
import { Link } from "wouter";
import { analyticsEndpoint } from "@/lib/analytics-endpoint";

type SessionClick = {
  label: string;
  href?: string;
  ts: number;
};

type VisitorLocation = {
  city?: string;
  region?: string;
  country?: string;
  timeZone?: string;
};

type Visit = {
  started: number;
  ended: number;
  pages: string[];
  clicks: SessionClick[];
  location?: VisitorLocation;
};

type Visitor = {
  label: string;
  started: number;
  ended: number;
  referrer?: string;
  viewport?: number;
  location?: VisitorLocation;
  visits: Visit[];
};

type Summary = {
  people: number;
  visits: number;
  clicks: number;
  visitors: Visitor[];
};

function when(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function clock(ts: number) {
  return new Date(ts).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function device(width?: number) {
  if (!width) return "Unknown device";
  if (width < 640) return "Phone";
  if (width < 1024) return "Tablet";
  return "Desktop";
}

function deviceIcon(width?: number): LucideIcon {
  if (!width || width >= 1024) return Monitor;
  if (width < 640) return Smartphone;
  return Tablet;
}

function source(referrer?: string) {
  if (!referrer) return "Direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host === "localhost" || host === "127.0.0.1") return "Direct";
    return host;
  } catch {
    return referrer;
  }
}

function arrival(referrer?: string) {
  const from = source(referrer);
  return from === "Direct" ? "Opened it directly" : `Came from ${from}`;
}

function countryName(code?: string) {
  if (!code) return "";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

function zoneCity(timeZone?: string) {
  return timeZone?.split("/").pop()?.replace(/_/g, " ") || "";
}

function placeText(location?: VisitorLocation) {
  if (!location) return "";
  const country = countryName(location.country);
  if (location.city && country) return `${location.city}, ${country}`;
  if (location.city) return location.city;
  const zone = zoneCity(location.timeZone);
  if (country && zone) return `${country} · ${zone}`;
  if (country) return country;
  return zone;
}

function pageLabel(path: string) {
  const hash = path.includes("#") ? path.slice(path.indexOf("#") + 1) : "";
  if (hash) return hash.charAt(0).toUpperCase() + hash.slice(1);
  const pathname = path.split("?")[0].replace(/\/+$/, "") || "/";
  if (pathname === "/") return "Home";
  const last = pathname.split("/").filter(Boolean).pop() || pathname;
  return last.charAt(0).toUpperCase() + last.slice(1);
}

function clickCount(visitor: Visitor) {
  return visitor.visits.reduce((total, visit) => total + visit.clicks.length, 0);
}

function clickDetail(href?: string) {
  if (!href || href.startsWith("#")) return "";
  return href;
}

function Meta({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children?: string;
}) {
  const showWords = Boolean(children);
  return (
    <span className="inline-flex items-center gap-1.5" title={label}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {showWords && children !== label ? <span className="sr-only">{label}</span> : null}
      {showWords ? <span aria-hidden={children !== label}>{children}</span> : <span className="sr-only">{label}</span>}
    </span>
  );
}

const PASSWORD_KEY = "stats-password";
const PASSWORD_WORKFLOW =
  "https://github.com/rawatraghav/PersonalPortfolio/actions/workflows/stats-password.yml";

function localStatsServer() {
  return location.hostname === "localhost" || location.hostname === "127.0.0.1";
}
const passwordHash = import.meta.env.VITE_STATS_PASSWORD_HASH as string;

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export default function Stats() {
  const [password, setPassword] = useState(() => sessionStorage.getItem(PASSWORD_KEY) || "");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [missing, setMissing] = useState(false);
  const [forgotNotice, setForgotNotice] = useState("");
  const [sendingForgot, setSendingForgot] = useState(false);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => {
    if (!password || !passwordHash) return;
    let cancelled = false;

    sha256(password).then((hash) => {
      if (cancelled || hash !== passwordHash) return;
      setUnlocked(true);
      fetch(analyticsEndpoint(), { headers: { "x-stats-password": password } })
        .then((response) => {
          if (response.status === 401) throw new Error("unauthorized");
          if (!response.ok) throw new Error("missing");
          return response.json();
        })
        .then((data) => {
          if (!cancelled) setSummary(data);
        })
        .catch((reason: Error) => {
          if (cancelled) return;
          if (reason.message === "unauthorized") {
            sessionStorage.removeItem(PASSWORD_KEY);
            setPassword("");
            setUnlocked(false);
            setError("That password does not match.");
            return;
          }
          setMissing(true);
        });
    });

    return () => {
      cancelled = true;
    };
  }, [password]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entered = new FormData(event.currentTarget).get("password");
    const value = typeof entered === "string" ? entered : "";
    if (!passwordHash) return;
    const hash = await sha256(value);
    if (hash !== passwordHash) {
      setError("That password does not match.");
      return;
    }
    sessionStorage.setItem(PASSWORD_KEY, value);
    setError("");
    setPassword(value);
  }

  async function onForgot() {
    setSendingForgot(true);
    setForgotNotice("");
    try {
      const response = await fetch("/api/stats/forgot", { method: "POST" });
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setForgotNotice(data?.message || "The email could not be sent.");
    } catch {
      setForgotNotice("This host cannot send email.");
    } finally {
      setSendingForgot(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
          Analytics
        </p>
        <h1 className="mt-3 font-serif text-5xl tracking-tight">Who visited</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Each person is one browser. A visit is one sitting in that browser, and the
          clicks from that sitting are listed together. A city or country is shown when
          their network gives one. Otherwise their time zone is shown.
        </p>

        {!passwordHash ? (
          <p className="mt-6 text-muted-foreground">
            This page is locked. Set STATS_PASSWORD and rebuild before it can be opened.
          </p>
        ) : !unlocked ? (
          <form onSubmit={onSubmit} className="mt-8 max-w-sm">
            <label htmlFor="stats-password" className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Password
            </label>
            <input
              id="stats-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-3 w-full border border-border bg-background px-3 py-3 text-base outline-none focus:border-primary"
            />
            {error ? <p className="mt-3 text-sm text-primary">{error}</p> : null}
            <div className="mt-4 flex items-center gap-4">
              <button
                type="submit"
                className="inline-flex h-11 items-center bg-primary px-5 text-sm font-medium text-primary-foreground"
              >
                Unlock
              </button>
              {localStatsServer() ? (
                <button
                  type="button"
                  onClick={onForgot}
                  disabled={sendingForgot}
                  className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:opacity-60"
                >
                  Forgot password
                </button>
              ) : (
                <a
                  href={PASSWORD_WORKFLOW}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Forgot password
                </a>
              )}
            </div>
            {localStatsServer() && forgotNotice ? (
              <p className="mt-3 text-sm text-muted-foreground">{forgotNotice}</p>
            ) : null}
            {localStatsServer() ? null : (
              <p className="mt-3 text-sm text-muted-foreground">
                Opens GitHub. Run “Email stats password” while you are logged in, and the
                password is sent to your inbox.
              </p>
            )}
          </form>
        ) : missing ? (
          <p className="mt-8 text-muted-foreground">
            The visit log could not be loaded. Refresh the page and try again.
          </p>
        ) : summary ? (
          <>
            <dl className="mt-10 grid border-y border-border sm:grid-cols-3">
              {[
                ["People", summary.people, "Browsers that opened the site"],
                ["Visits", summary.visits, "Separate sittings by those people"],
                ["Clicks", summary.clicks, "Links and buttons they used"],
              ].map(([label, value, detail], index) => (
                <div
                  key={String(label)}
                  className={`py-6 ${index > 0 ? "border-t border-border sm:border-l sm:border-t-0 sm:pl-6" : "sm:pr-6"}`}
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-2 font-serif text-5xl tracking-tight">{value}</dd>
                  <dd className="mt-2 text-sm text-muted-foreground">{detail}</dd>
                </div>
              ))}
            </dl>

            {summary.visitors.length === 0 ? (
              <p className="mt-10 text-muted-foreground">No one has opened the site yet.</p>
            ) : (
              <ol className="mt-10 space-y-6">
                {summary.visitors.map((visitor, personIndex) => {
                  const clicks = clickCount(visitor);
                  return (
                    <li key={visitor.label} className="border border-border bg-card px-5 py-5 sm:px-6">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                        <h2 className="font-serif text-3xl tracking-tight">Person {personIndex + 1}</h2>
                        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {visitor.visits.length} {visitor.visits.length === 1 ? "visit" : "visits"}
                          {" · "}
                          {clicks} {clicks === 1 ? "click" : "clicks"}
                        </p>
                      </div>
                      <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <Meta icon={deviceIcon(visitor.viewport)} label={device(visitor.viewport)} />
                        {source(visitor.referrer) === "Direct" ? (
                          <span>Direct</span>
                        ) : (
                          <Meta icon={Globe} label={arrival(visitor.referrer)}>
                            {source(visitor.referrer)}
                          </Meta>
                        )}
                        {placeText(visitor.location) ? (
                          <Meta
                            icon={MapPin}
                            label={
                              visitor.location?.city || visitor.location?.country
                                ? placeText(visitor.location)
                                : `Time zone: ${placeText(visitor.location)}`
                            }
                          >
                            {placeText(visitor.location)}
                          </Meta>
                        ) : null}
                        <Meta
                          icon={Clock}
                          label={`${when(visitor.started)}${
                            visitor.ended !== visitor.started ? ` – ${clock(visitor.ended)}` : ""
                          }`}
                        >
                          {`${when(visitor.started)}${
                            visitor.ended !== visitor.started ? ` – ${clock(visitor.ended)}` : ""
                          }`}
                        </Meta>
                      </p>

                      <ol className="mt-6 space-y-6">
                        {visitor.visits.map((visit, visitIndex) => (
                          <li
                            key={`${visitor.label}-${visit.started}`}
                            className="border-l-2 border-primary/70 pl-4"
                          >
                            <p className="font-medium">
                              Visit {visitor.visits.length - visitIndex}
                              <span className="ml-2 font-normal text-muted-foreground">
                                {clock(visit.started)}
                                {visit.ended !== visit.started ? ` – ${clock(visit.ended)}` : ""}
                              </span>
                            </p>
                            <p className="mt-2 text-sm">
                              {visit.pages.length === 0
                                ? "Opened the site"
                                : `Looked at ${visit.pages.map(pageLabel).join(", then ")}`}
                            </p>
                            {placeText(visit.location) &&
                            placeText(visit.location) !== placeText(visitor.location) ? (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {placeText(visit.location)}
                              </p>
                            ) : null}

                            <div className="mt-4 bg-background px-3 py-3">
                              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                Clicks in this visit
                              </p>
                              {visit.clicks.length === 0 ? (
                                <p className="mt-2 text-sm text-muted-foreground">
                                  No clicks during this visit.
                                </p>
                              ) : (
                                <ol className="mt-3 divide-y divide-border">
                                  {visit.clicks.map((click, clickIndex) => (
                                    <li
                                      key={`${click.ts}-${clickIndex}`}
                                      className="flex items-baseline justify-between gap-4 py-2"
                                    >
                                      <span>
                                        <span className="font-medium">{click.label}</span>
                                        {clickDetail(click.href) ? (
                                          <span className="ml-2 break-all font-mono text-[11px] text-muted-foreground">
                                            {clickDetail(click.href)}
                                          </span>
                                        ) : null}
                                      </span>
                                      <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                                        {clock(click.ts)}
                                      </span>
                                    </li>
                                  ))}
                                </ol>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </li>
                  );
                })}
              </ol>
            )}
          </>
        ) : (
          <p className="mt-10 text-muted-foreground">Loading.</p>
        )}

        <Link href="/" className="mt-12 inline-flex text-sm text-primary hover:underline">
          Back home
        </Link>
      </div>
    </div>
  );
}

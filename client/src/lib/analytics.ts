import { analyticsEndpoint } from "./analytics-endpoint";

type AnalyticsEvent = {
  type: "visit" | "click";
  path: string;
  label?: string;
  href?: string;
  referrer?: string;
  visitorId: string;
  sessionId: string;
  ts: number;
  viewport: number;
  timeZone?: string;
};

const VISITOR_KEY = "portfolio-visitor";
const SESSION_KEY = "portfolio-session";

function trackingAllowed() {
  return navigator.doNotTrack !== "1" && !/bot|crawler|spider|headless/i.test(navigator.userAgent);
}

function storedId(storage: Storage, key: string) {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const id = crypto.randomUUID();
  storage.setItem(key, id);
  return id;
}

function timeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

function referrerOrigin() {
  if (!document.referrer) return "";
  try {
    return new URL(document.referrer).origin;
  } catch {
    return "";
  }
}

function labelFor(el: Element) {
  const explicit = el.getAttribute("data-track");
  if (explicit) return explicit.slice(0, 80);
  const href = el.getAttribute("href") || "";
  if (href.startsWith("mailto:")) return "Email";
  if (href.startsWith("tel:")) return "Phone";
  if (href.includes("linkedin.com")) return "LinkedIn";
  if (href.includes("github.com")) return "GitHub";
  if (href.includes("scholar.google")) return "Google Scholar";
  if (href.endsWith(".pdf") || href.includes("Resume")) return "Resume";
  const text = (el.textContent || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\d{2}\s*/, "")
    .slice(0, 80);
  if (text) return text;
  if (href.startsWith("#") && href.length > 1) return href.slice(1);
  return "";
}

function sendLocal(event: AnalyticsEvent) {
  const body = JSON.stringify(event);
  fetch(analyticsEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

function track(type: AnalyticsEvent["type"], extra: { label?: string; href?: string } = {}) {
  const event: AnalyticsEvent = {
    type,
    path: `${location.pathname}${location.hash}`,
    label: extra.label,
    href: extra.href?.slice(0, 300),
    referrer: referrerOrigin(),
    visitorId: storedId(localStorage, VISITOR_KEY),
    sessionId: storedId(sessionStorage, SESSION_KEY),
    ts: Date.now(),
    viewport: window.innerWidth,
    timeZone: timeZone(),
  };
  sendLocal(event);
}

export function initAnalytics() {
  if (!trackingAllowed()) return;
  if (location.pathname.endsWith("/stats")) return;
  const flag = "__portfolioAnalytics";
  if (flag in window) return;
  Object.defineProperty(window, flag, { value: true });
  track("visit");

  document.addEventListener("click", (event) => {
    if (location.pathname.endsWith("/stats")) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const el = target.closest("a, button");
    if (!el) return;
    const label = labelFor(el);
    if (!label) return;
    track("click", { label, href: el.getAttribute("href") || undefined });
  });
}

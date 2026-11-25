import { createHash, timingSafeEqual } from "crypto";
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import type { lookup as LookupIp } from "geoip-lite";

const require = createRequire(import.meta.url);
const { lookup: lookupIp } = require("geoip-lite") as { lookup: typeof LookupIp };

const serverDir = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile() {
  try {
    const text = fs.readFileSync(path.resolve(serverDir, "../.env"), "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    // No local env file. STATS_PASSWORD can still come from the process environment.
  }
}

loadEnvFile();

function passwordMatches(provided: string | undefined) {
  const expected = process.env.STATS_PASSWORD || "";
  if (!expected || !provided) return false;
  const actualHash = createHash("sha256").update(provided).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(actualHash, expectedHash);
}

const dataFile = path.resolve(serverDir, "data", "analytics.jsonl");

type AnalyticsEvent = {
  type: "visit" | "click";
  path?: string;
  label?: string;
  href?: string;
  referrer?: string;
  visitorId?: string;
  sessionId?: string;
  ts?: number;
  viewport?: number;
  location?: VisitorLocation;
};

type VisitorLocation = {
  city?: string;
  region?: string;
  country?: string;
  timeZone?: string;
};

type SessionClick = {
  label: string;
  href?: string;
  ts: number;
};

type SessionSummary = {
  started: number;
  ended: number;
  pages: string[];
  clicks: SessionClick[];
  location?: VisitorLocation;
};

type VisitorSummary = {
  label: string;
  started: number;
  ended: number;
  referrer?: string;
  viewport?: number;
  location?: VisitorLocation;
  visits: SessionSummary[];
};

function readEvents(): AnalyticsEvent[] {
  try {
    return fs
      .readFileSync(dataFile, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as AnalyticsEvent);
  } catch {
    return [];
  }
}

function clip(value: unknown, max: number) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function isPortfolioEvent(event: AnalyticsEvent) {
  const path = event.path || "";
  return path !== "/stats" && !path.endsWith("/stats");
}

function personLabel(id: string) {
  return id.replace(/-/g, "").slice(-4).toUpperCase();
}

function readableLabel(label: string) {
  const cleaned = label.replace(/^\d{2}\s*/, "").trim() || label;
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function normalizeIp(ip: string) {
  return ip.replace(/^::ffff:/, "").trim();
}

function isPrivateIp(ip: string) {
  const value = ip.toLowerCase();
  return (
    !value ||
    value === "127.0.0.1" ||
    value === "::1" ||
    value.startsWith("10.") ||
    value.startsWith("192.168.") ||
    value.startsWith("169.254.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(value) ||
    value.startsWith("fc") ||
    value.startsWith("fd") ||
    value.startsWith("fe80:")
  );
}

function clientIp(req: Request) {
  const socketIp = normalizeIp(req.socket.remoteAddress || "");
  const forwarded = normalizeIp(req.get("x-forwarded-for")?.split(",")[0] || "");
  if (isPrivateIp(socketIp) && forwarded && !isPrivateIp(forwarded)) return forwarded;
  return socketIp;
}

function cleanLocation(input: VisitorLocation | undefined) {
  if (!input) return undefined;
  const location: VisitorLocation = {
    city: input.city || undefined,
    region: input.region || undefined,
    country: input.country || undefined,
    timeZone: input.timeZone || undefined,
  };
  return location.city || location.region || location.country || location.timeZone
    ? location
    : undefined;
}

function locationFor(req: Request, timeZone: string | undefined) {
  const ip = clientIp(req);
  const geo = ip && !isPrivateIp(ip) ? lookupIp(ip) : null;
  return cleanLocation({
    city: geo?.city,
    region: geo?.region,
    country: geo?.country,
    timeZone: timeZone || geo?.timezone,
  });
}

function mergeLocation(current: VisitorLocation | undefined, next: VisitorLocation | undefined) {
  const incoming = cleanLocation(next);
  if (!incoming) return current;
  if (!current) return incoming;
  return cleanLocation({
    city: incoming.city || current.city,
    region: incoming.region || current.region,
    country: incoming.country || current.country,
    timeZone: incoming.timeZone || current.timeZone,
  });
}

function summarize(events: AnalyticsEvent[]) {
  const sessions = new Map<
    string,
    {
      visitorId?: string;
      started: number;
      ended: number;
      referrer?: string;
      viewport?: number;
      location?: VisitorLocation;
      pages: string[];
      clicks: SessionClick[];
    }
  >();

  for (const event of events) {
    if (!isPortfolioEvent(event)) continue;
    const sessionId = event.sessionId || event.visitorId || "unknown";
    const ts = event.ts || 0;
    let session = sessions.get(sessionId);
    if (!session) {
      session = {
        visitorId: event.visitorId,
        started: ts,
        ended: ts,
        referrer: event.referrer,
        viewport: event.viewport,
        location: cleanLocation(event.location),
        pages: [],
        clicks: [],
      };
      sessions.set(sessionId, session);
    }
    if (event.visitorId) session.visitorId = event.visitorId;
    if (ts && ts < session.started) session.started = ts;
    if (ts >= session.ended) {
      session.ended = ts;
      if (event.viewport) session.viewport = event.viewport;
    }
    if (!session.referrer && event.referrer) session.referrer = event.referrer;
    session.location = mergeLocation(session.location, event.location);
    if (event.type === "visit" && event.path && !session.pages.includes(event.path)) {
      session.pages.push(event.path);
    }
    if (event.type === "click") {
      session.clicks.push({
        label: readableLabel(event.label || "Click"),
        href: event.href,
        ts,
      });
    }
  }

  const people = new Map<string, VisitorSummary & { id: string }>();
  for (const [sessionId, session] of sessions) {
    if (session.pages.length === 0 && session.clicks.length === 0) continue;
    const id = session.visitorId || sessionId;
    let person = people.get(id);
    if (!person) {
      person = {
        id,
        label: personLabel(id),
        started: session.started,
        ended: session.ended,
        referrer: session.referrer,
        viewport: session.viewport,
        location: session.location,
        visits: [],
      };
      people.set(id, person);
    }
    if (session.started < person.started) {
      person.started = session.started;
      if (session.referrer) person.referrer = session.referrer;
    }
    if (session.ended >= person.ended) {
      person.ended = session.ended;
      if (session.viewport) person.viewport = session.viewport;
    }
    person.location = mergeLocation(person.location, session.location);
    person.visits.push({
      started: session.started,
      ended: session.ended,
      pages: session.pages,
      clicks: session.clicks.sort((a, b) => a.ts - b.ts),
      location: session.location,
    });
  }

  const visitors = [...people.values()]
    .map(({ id: _id, ...person }) => ({
      ...person,
      visits: person.visits.sort((a, b) => b.started - a.started),
    }))
    .sort((a, b) => b.ended - a.ended);

  const seen = new Map<string, number>();
  for (const person of visitors) {
    const count = seen.get(person.label) || 0;
    seen.set(person.label, count + 1);
    if (count > 0) person.label = `${person.label}-${count + 1}`;
  }

  return {
    people: visitors.length,
    visits: visitors.reduce((total, person) => total + person.visits.length, 0),
    clicks: visitors.reduce(
      (total, person) =>
        total + person.visits.reduce((count, visit) => count + visit.clicks.length, 0),
      0,
    ),
    visitors,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/analytics", (req: Request, res: Response) => {
    const body = req.body ?? {};
    if (body.type !== "visit" && body.type !== "click") {
      res.status(400).json({ message: "Invalid event" });
      return;
    }

    const event: AnalyticsEvent = {
      type: body.type,
      path: clip(body.path, 200),
      label: clip(body.label, 80),
      href: clip(body.href, 300),
      referrer: clip(body.referrer, 200),
      visitorId: clip(body.visitorId, 40),
      sessionId: clip(body.sessionId, 40),
      ts: Date.now(),
      viewport: Number(body.viewport) || undefined,
      location: locationFor(req, clip(body.timeZone, 80)),
    };

    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.appendFileSync(dataFile, `${JSON.stringify(event)}\n`);
    res.status(204).end();
  });

  app.get("/api/analytics", (req: Request, res: Response) => {
    const provided = req.get("x-stats-password");
    if (!passwordMatches(provided)) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    res.json(summarize(readEvents()));
  });

  const ownerEmail = "rawat.raghav3w@gmail.com";
  let lastForgotEmailAt = 0;

  app.post("/api/stats/forgot", async (_req: Request, res: Response) => {
    const password = process.env.STATS_PASSWORD || "";
    if (!password) {
      res.status(503).json({ message: "Email is not configured." });
      return;
    }
    if (Date.now() - lastForgotEmailAt < 10 * 60 * 1000) {
      res.status(429).json({ message: "An email was just sent. Check your inbox." });
      return;
    }

    const apiKey = process.env.RESEND_API_KEY || "";
    if (!apiKey) {
      res.status(503).json({ message: "Email is not configured." });
      return;
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "portfolio-stats",
        },
        body: JSON.stringify({
          from: "Portfolio stats <onboarding@resend.dev>",
          to: [ownerEmail],
          subject: "Portfolio stats password",
          text: `Your portfolio stats password is ${password}`,
        }),
      });
      const payload = (await response.json().catch(() => null)) as { id?: string } | null;
      if (response.status === 429) {
        res.status(429).json({ message: "The email service is busy. Try again in a few minutes." });
        return;
      }
      if (!response.ok || typeof payload?.id !== "string") {
        res.status(502).json({ message: "The email could not be sent." });
        return;
      }
      lastForgotEmailAt = Date.now();
      res.json({ message: `Sent to ${ownerEmail}.` });
    } catch {
      res.status(502).json({ message: "The email could not be sent." });
    }
  });

  return createServer(app);
}

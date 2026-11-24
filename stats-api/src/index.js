const MAX_EVENTS = 2000;
const attempts = new Map();

function clip(value, max) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function passwordMatches(provided, expected) {
  if (!expected || !provided) return false;
  const actual = await sha256(provided);
  const wanted = await sha256(expected);
  if (actual.length !== wanted.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) {
    difference |= actual.charCodeAt(index) ^ wanted.charCodeAt(index);
  }
  return difference === 0;
}

function rateLimited(request) {
  const address = request.headers.get("cf-connecting-ip") || "unknown";
  const now = Date.now();
  const recent = (attempts.get(address) || []).filter((ts) => now - ts < 10 * 60 * 1000);
  if (recent.length >= 8) {
    attempts.set(address, recent);
    return true;
  }
  recent.push(now);
  attempts.set(address, recent);
  return false;
}

function locationFor(request, timeZone) {
  const cf = request.cf || {};
  const location = {
    city: clip(cf.city, 80),
    region: clip(cf.region, 80),
    country: clip(cf.country, 8),
    timeZone: timeZone || clip(cf.timezone, 80),
  };
  return location.city || location.region || location.country || location.timeZone
    ? location
    : undefined;
}

function cleanLocation(input) {
  if (!input || typeof input !== "object") return undefined;
  const location = {
    city: clip(input.city, 80),
    region: clip(input.region, 80),
    country: clip(input.country, 80),
    timeZone: clip(input.timeZone, 80),
  };
  return location.city || location.region || location.country || location.timeZone
    ? location
    : undefined;
}

function mergeLocation(current, next) {
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

function personLabel(id) {
  return id.replace(/-/g, "").slice(-4).toUpperCase();
}

function readableLabel(label) {
  const cleaned = label.replace(/^\d{2}\s*/, "").trim() || label;
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function isPortfolioEvent(event) {
  const path = event.path || "";
  return path !== "/stats" && !path.endsWith("/stats");
}

function summarize(events) {
  const sessions = new Map();

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

  const people = new Map();
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

  const seen = new Map();
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

function eventFrom(body, request) {
  if (body?.type !== "visit" && body?.type !== "click") return null;
  const viewport = Number(body.viewport);
  return {
    type: body.type,
    path: clip(body.path, 200),
    label: clip(body.label, 80),
    href: clip(body.href, 300),
    referrer: clip(body.referrer, 200),
    visitorId: clip(body.visitorId, 40),
    sessionId: clip(body.sessionId, 40),
    ts: Date.now(),
    viewport: Number.isFinite(viewport) && viewport > 0 ? Math.round(viewport) : undefined,
    location: locationFor(request, clip(body.timeZone, 80)),
  };
}

function json(body, status, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-stats-password",
      ...extra,
    },
  });
}

function empty(status) {
  return new Response(null, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-stats-password",
      "Access-Control-Max-Age": "86400",
    },
  });
}

async function readEvents(env) {
  const raw = await env.VISITS.get("events");
  if (!raw) return [];
  try {
    const events = JSON.parse(raw);
    return Array.isArray(events) ? events : [];
  } catch {
    return [];
  }
}

async function storeEvent(env, event) {
  const events = await readEvents(env);
  events.push(event);
  await env.VISITS.put("events", JSON.stringify(events.slice(-MAX_EVENTS)));
}

const OWNER_EMAIL = "rawat.raghav3w@gmail.com";

async function sendPasswordEmail(env) {
  const password = env.STATS_PASSWORD || "";
  if (!password) return json({ message: "Email is not configured." }, 503);

  const lastSent = Number((await env.VISITS.get("forgot-at")) || 0);
  if (Date.now() - lastSent < 10 * 60 * 1000) {
    return json({ message: "An email was just sent. Check your inbox." }, 429);
  }

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: "https://rawatraghav.github.io",
        Referer: "https://rawatraghav.github.io/PersonalPortfolio/stats",
      },
      body: JSON.stringify({
        _subject: "Portfolio stats password",
        _captcha: "false",
        _template: "box",
        password,
      }),
    });
    const payload = await response.json().catch(() => null);
    const providerMessage = typeof payload?.message === "string" ? payload.message : "";
    if (/activat|confirm/i.test(providerMessage)) {
      return json({
        message: `Check ${OWNER_EMAIL} for an activation link, then try Forgot password again.`,
      });
    }
    const success = payload?.success === true || payload?.success === "true";
    if (/rate limit/i.test(providerMessage)) {
      return json({ message: "An email was just sent. Check your inbox." }, 429);
    }
    if (!response.ok || !success) return json({ message: "The email could not be sent." }, 502);
    await env.VISITS.put("forgot-at", String(Date.now()));
    return json({ message: `Sent to ${OWNER_EMAIL}.` });
  } catch {
    return json({ message: "The email could not be sent." }, 502);
  }
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return empty(204);
    if (!env.VISITS || !env.STATS_PASSWORD) return json({ message: "Analytics is not configured." }, 503);

    const path = new URL(request.url).pathname;
    if (request.method === "POST" && path.endsWith("/stats/forgot")) {
      return sendPasswordEmail(env);
    }

    if (request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ message: "Invalid event" }, 400);
      }
      const event = eventFrom(body, request);
      if (!event) return json({ message: "Invalid event" }, 400);
      try {
        await storeEvent(env, event);
      } catch {
        return json({ message: "The visit could not be saved." }, 503);
      }
      return empty(204);
    }

    if (request.method === "GET") {
      const provided = request.headers.get("x-stats-password") || "";
      if (!(await passwordMatches(provided, env.STATS_PASSWORD))) {
        if (rateLimited(request)) return json({ message: "Too many attempts. Wait a few minutes." }, 429);
        return json({ message: "Unauthorized" }, 401);
      }
      try {
        return json(summarize(await readEvents(env)), 200);
      } catch {
        return json({ message: "The visit log could not be loaded." }, 503);
      }
    }

    return json({ message: "Method not allowed" }, 405);
  },
};

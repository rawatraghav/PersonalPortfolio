const PRODUCTION_ORIGIN = "https://portfolio-stats.rawat-raghav3.workers.dev";

function localStatsServer() {
  return location.hostname === "localhost" || location.hostname === "127.0.0.1";
}

export function analyticsEndpoint() {
  if (localStatsServer()) return "/api/analytics";
  return `${PRODUCTION_ORIGIN}/api/analytics`;
}

export function statsForgotEndpoint() {
  if (localStatsServer()) return "/api/stats/forgot";
  return `${PRODUCTION_ORIGIN}/api/stats/forgot`;
}

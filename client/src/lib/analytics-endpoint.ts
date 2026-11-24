const PRODUCTION_ORIGIN = "https://portfolio-stats.rawat-raghav3.workers.dev";

export function analyticsEndpoint() {
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    return "/api/analytics";
  }
  return `${PRODUCTION_ORIGIN}/api/analytics`;
}

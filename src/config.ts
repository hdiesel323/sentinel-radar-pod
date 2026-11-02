import { PodConfig } from "./types.js";

export function loadPodConfig(env?: Record<string, any>): PodConfig {
  const get = (key: string, fallback: string): string => {
    if (env && env[key]) return String(env[key]);
    if (typeof process !== "undefined" && process.env && process.env[key]) {
      return String(process.env[key]);
    }
    return fallback;
  };

  const id = get("POD_ID", "sentinel-radar-pod");
  const name = get("POD_NAME", "Sentinel Radar Pod");
  const role = get("POD_ROLE", "sentinel");
  const lob = get("POD_DOMAIN", get("POD_LOB", "radar"));
  const hubUrl = get("HUB_URL", get("FACTORY_HUB_URL", "https://factory-hub.walterhudson462.workers.dev"));
  const apiKey = get("API_KEY", "");
  const port = parseInt(get("PORT", "5100"), 10);

  let capabilities: string[] = ["proactive_sentinel", "ai_crawler_probe", "security_probe", "target_radar", "drift_detection"];
  const rawCaps = get("POD_CAPABILITIES", "");
  if (rawCaps) {
    try {
      capabilities = JSON.parse(rawCaps);
    } catch {
      capabilities = rawCaps.split(",").map((c) => c.trim()).filter(Boolean);
    }
  }

  return {
    id,
    name,
    role,
    lob,
    capabilities,
    hubUrl,
    apiKey,
    port,
  };
}

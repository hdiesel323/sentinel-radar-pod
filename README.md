# Sentinel Radar Pod

> Proactive Anomaly Detection, AI Crawler Governance & Drift Sentinel on Cloudflare Workers + D1.

The **Sentinel Radar Pod** (`sentinel-radar-pod`) is an autonomous edge sentinel that shifts the agent factory from *reactive* (waiting for human prompts) to *proactive* (hunting for business opportunities, security risks, and search engine policy changes 24/7).

- **Live URL**: [https://sentinel-radar-pod.walterhudson462.workers.dev](https://sentinel-radar-pod.walterhudson462.workers.dev)
- **Domain**: `radar`
- **Role**: `sentinel`
- **Cloudflare D1 Database**: `sentinel-radar-pod-db` (`06e105f6-a90f-4bb8-9520-3a251b359c00`)
- **Direct Mesh Binding**: Cloudflare Worker Service Binding (`env.FACTORY_HUB`)

---

## 🏗️ Architecture

```
 ┌────────────────────────────────────────────────────────┐
 │                      Factory Hub                       │
 │        https://factory-hub.walterhudson462.workers.dev │
 └─────────────┬────────────────────────────▲─────────────┘
               │ sentinel.signal            │ heartbeat
               │ (Proactive Event Envelope) │ task.completed
               ▼                            │
 ┌──────────────────────────────────────────┴─────────────┐
 │         Sentinel Radar Pod (Cloudflare Worker)         │
 │                                                        │
 │  ┌──────────────┐   ┌───────────────┐  ┌─────────────┐ │
 │  │ / (Cockpit)  │   │  Tincan Mesh  │  │ Cron / 15m  │ │
 │  │ Dark Mode UI │   │  Client Node  │  │ Radar Probe │ │
 │  └──────────────┘   └───────┬───────┘  └──────┬──────┘ │
 │                             │                 │        │
 │                     ┌───────▼─────────────────▼──────┐ │
 │                     │    Proactive Probe Engine      │ │
 │                     │  (Robots / SSL / Headers)      │ │
 │                     └───────────────┬────────────────┘ │
 │                                     │                  │
 │                             ┌───────▼───────┐          │
 │                             │ Cloudflare D1 │          │
 │                             │ Target State  │          │
 │                             └───────────────┘          │
 └────────────────────────────────────────────────────────┘
```

---

## 🛰️ Proactive Hunting Capabilities

1. **2026 AI Search Crawler Governance**:
   - Continuously monitors target domains for explicit directives for major AI search engines:
     - `GPTBot` (OpenAI Search)
     - `PerplexityBot` (Perplexity AI)
     - `ClaudeBot` (Anthropic AI)
     - `CCBot` (Common Crawl)
   - Automatically detects missing directives, inadvertent blocking, or robots.txt drift.

2. **RFC 9116 Security.txt Compliance**:
   - Probes `/.well-known/security.txt` across web assets.
   - Validates active `Contact:` channels and future `Expires:` timestamps.

3. **Autonomous Signal Emission**:
   - When an issue or opportunity is found, the Sentinel emits a `sentinel.signal` directly into `pod:intake` on the Factory Hub mesh.
   - The Intake Pod classifies the signal as a `WORK_TASK`, and the PM Pod automatically routes it to specialized execution workers (e.g. `authority-seo-pod`).

---

## 📡 API Reference

### 1. Manual Radar Scan (`POST /api/task`)
Trigger an immediate proactive scan across a specific target list:
```bash
curl -X POST https://sentinel-radar-pod.walterhudson462.workers.dev/api/task \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "radar.scan",
    "spec": {
      "targets": [
        { "url": "https://summit-capital.com", "domain": "summit-capital.com", "type": "ai_crawlers" }
      ]
    }
  }'
```

### 2. Health & Heartbeat (`GET /health`)
Returns live uptime, role, and registration state.

---

## 🧪 Testing & Verification

```bash
# Run unit test suite
npm test

# Type check
npm run check

# Run local development server
npm run dev
```

---

## 📜 License
MIT License. Free to use, adapt, and build upon.

# aleksejs-agent-proxy

Cloudflare Worker that proxies the portfolio's "Ask the Agent" command bar to OpenRouter (Llama 3.3 70B free tier). The OpenRouter API key never touches the browser; rate limiting is per IP via KV.

## Deploy

```bash
cd workers/agent-proxy
npm install

# 1. Get a free OpenRouter key: https://openrouter.ai/keys
# 2. Create a KV namespace for rate-limit state
npx wrangler kv namespace create RATELIMIT
npx wrangler kv namespace create RATELIMIT --preview

# Paste the printed `id` and `preview_id` into wrangler.toml

# 3. Store the OpenRouter key as a secret
npx wrangler secret put OPENROUTER_API_KEY
# (paste your key when prompted)

# 4. Deploy
npx wrangler deploy
```

The worker will be live at `https://aleksejs-agent-proxy.<your-account>.workers.dev`.

## Local development

```bash
cp .dev.vars.example .dev.vars
# put your real key in .dev.vars
npm run dev
# worker runs at http://localhost:8787
```

## Wire the front-end

After deploy, edit the front-end and set `AGENT_ENDPOINT` (in [src/agent.ts](../../src/agent.ts)) to your worker URL — or set it via `localStorage.setItem('agent_endpoint', '…')` for testing.

## Endpoints

- `POST /chat` — body `{ "messages": [{ "role": "user" | "assistant", "content": string }, ...] }`. Returns OpenAI-style SSE. Last message must be `user`.
- `GET /health` — `{ ok: true, model: "..." }`.

## Edit the system prompt

The agent's knowledge of Aleksejs is hardcoded in [src/system-prompt.ts](src/system-prompt.ts). Edit and redeploy whenever the portfolio changes.

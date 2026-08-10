import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function makeRequest(body: unknown, ip = "203.0.113.1") {
  return new Request("http://localhost/api/asistan", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

const originalFetch = global.fetch;
const originalApiKey = process.env.ANTHROPIC_API_KEY;

beforeEach(() => {
  process.env.ANTHROPIC_API_KEY = "test-key";
});

afterEach(() => {
  global.fetch = originalFetch;
  process.env.ANTHROPIC_API_KEY = originalApiKey;
  vi.restoreAllMocks();
});

describe("POST /api/asistan", () => {
  it("returns 400 when the message is missing", async () => {
    const response = await POST(makeRequest({}, "1.1.1.1"));
    expect(response.status).toBe(400);
  });

  it("returns 400 when the message is an empty string", async () => {
    const response = await POST(makeRequest({ message: "   " }, "1.1.1.2"));
    expect(response.status).toBe(400);
  });

  it("returns a friendly 503 error when ANTHROPIC_API_KEY is not configured", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const response = await POST(
      makeRequest({ message: "merhaba" }, "1.1.1.3"),
    );
    expect(response.status).toBe(503);
    const data = await response.json();
    expect(data.error).toBeTruthy();
  });

  it("returns a friendly 502 error when the upstream API call fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down"));
    const response = await POST(
      makeRequest({ message: "merhaba" }, "1.1.1.4"),
    );
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toBeTruthy();
  });

  it("returns a friendly 502 error when the upstream API responds with a non-OK status", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response("upstream error", { status: 500 }),
    );
    const response = await POST(
      makeRequest({ message: "merhaba" }, "1.1.1.5"),
    );
    expect(response.status).toBe(502);
  });

  it("returns the assistant reply on success", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          content: [{ type: "text", text: "Merhaba, size nasıl yardımcı olabilirim?" }],
        }),
        { status: 200 },
      ),
    );
    const response = await POST(
      makeRequest({ message: "merhaba" }, "1.1.1.6"),
    );
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.reply).toBe("Merhaba, size nasıl yardımcı olabilirim?");
  });

  it("never leaks the API key in an error response", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down"));
    const response = await POST(
      makeRequest({ message: "merhaba" }, "1.1.1.7"),
    );
    const text = await response.text();
    expect(text).not.toContain("test-key");
  });

  it("enforces a per-client rate limit", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ content: [{ type: "text", text: "ok" }] }), {
        status: 200,
      }),
    );
    const ip = "9.9.9.9";
    let lastResponse: Response | undefined;
    for (let i = 0; i < 10; i += 1) {
      lastResponse = await POST(makeRequest({ message: `soru ${i}` }, ip));
    }
    expect(lastResponse?.status).toBe(429);
  });
});

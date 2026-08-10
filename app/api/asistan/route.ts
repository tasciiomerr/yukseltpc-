import { NextResponse } from "next/server";
import { buildContextText, findRelevantProducts } from "@/lib/assistant/retrieval";
import { checkRateLimit } from "@/lib/assistant/rateLimit";
import { buildSystemPrompt } from "@/lib/assistant/systemPrompt";

export const runtime = "nodejs";

const ANTHROPIC_MODEL = "claude-sonnet-5";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MAX_HISTORY_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 1000;

const GENERIC_ERROR_MESSAGE =
  "Şu anda yanıt veremiyorum, birazdan tekrar dener misin?";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function getClientKey(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "local";
}

function isValidHistory(value: unknown): value is ChatMessage[] {
  if (!Array.isArray(value)) return false;
  return value.every(
    (item) =>
      item &&
      typeof item === "object" &&
      (item.role === "user" || item.role === "assistant") &&
      typeof item.content === "string",
  );
}

export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  const rateLimit = checkRateLimit(clientKey);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error:
          "Kısa sürede çok fazla mesaj gönderdin, birkaç saniye sonra tekrar dener misin?",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Geçersiz istek." },
      { status: 400 },
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    typeof (body as { message?: unknown }).message !== "string" ||
    (body as { message: string }).message.trim().length === 0
  ) {
    return NextResponse.json(
      { error: "Bir mesaj yazmalısın." },
      { status: 400 },
    );
  }

  const message = (body as { message: string }).message
    .trim()
    .slice(0, MAX_MESSAGE_LENGTH);

  const historyRaw = (body as { history?: unknown }).history ?? [];
  const history = isValidHistory(historyRaw)
    ? historyRaw.slice(-MAX_HISTORY_MESSAGES)
    : [];

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY tanımlı değil.");
    return NextResponse.json({ error: GENERIC_ERROR_MESSAGE }, { status: 503 });
  }

  const matches = findRelevantProducts(message);
  const contextText = buildContextText(matches);
  const systemPrompt = buildSystemPrompt(contextText);

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [...history, { role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      console.error(
        `Asistan API hatası: ${response.status} ${await response.text()}`,
      );
      return NextResponse.json(
        { error: GENERIC_ERROR_MESSAGE },
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      content?: { type: string; text?: string }[];
    };

    const reply = data.content
      ?.filter((block) => block.type === "text")
      .map((block) => block.text ?? "")
      .join("")
      .trim();

    if (!reply) {
      return NextResponse.json(
        { error: GENERIC_ERROR_MESSAGE },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Asistan isteği başarısız:", error);
    return NextResponse.json({ error: GENERIC_ERROR_MESSAGE }, { status: 502 });
  }
}

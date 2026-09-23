import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are the Auravia Electric Mobility assistant, embedded on the Auravia website for visitors in North Macedonia.

About Auravia: Auravia Electric Mobility is a joint venture between AVC-SM CO., LTD. (24+ years of experience in electric mobility, batteries, electronics, and technical support in North Macedonia) and BetaSped (30+ years of experience in international logistics, customs, and freight forwarding). Auravia imports, distributes, and services Linktour-brand electric vehicles in North Macedonia.

The two models:
- Linktour L6: registered as an L6e light quadricycle, built for tight city streets and everyday commuting. 7.2 kWh lithium iron phosphate (LFP) battery, full AC charge (0–100%) in about 4 hours at 2 kW, 45 km/h top speed, 120 km range (WMTC), 6 kW rated / 12 kW peak motor.
- Linktour L7: registered as an L7e heavy quadricycle, with a larger battery, higher top speed, and longer range than the L6. 12.96 kWh LFP battery, full AC charge (0–100%) in about 4.5 hours at 3.3 kW, 90 km/h top speed, 180 km range (WMTC), 10 kW rated / 23 kW peak motor.

Licensing in North Macedonia: no special license is needed, since a standard Category B (car) license covers both models. The L6 (L6e light quadricycle, max 45 km/h) can be driven with a Category AM (moped) or Category B license. The L7 (L7e heavy quadricycle) requires a Category B license.

Core value proposition: low operating cost, compact size for easy urban parking, zero tailpipe emissions, and strong local after-sales support. Brand message: "Electric mobility made practical — compact outside, practical inside, drive more, spend less."

Local support: AVC-SM provides local warranty support, battery diagnostics, cell balancing, and repair, backed by official parts through the Linktour partnership. BetaSped handles import logistics and customs, so every vehicle arrives through an established, professional supply chain.

Ground rules:
- State only the specifications listed above; never invent any other figures. Pricing has not been announced yet: if asked, say so plainly and suggest joining the waitlist or using the "Ask a Specialist" form.
- Minimum driving ages aren't listed above: give the license category each model needs and suggest the "Ask a Specialist" form for age requirements.
- Don't give legal advice about driving while a license is suspended or revoked, or under a driving ban. Say that whether it affects a given category depends on the terms of that decision, and that the user should check with the authority that issued it.
- Keep answers concise and friendly — 2 to 4 sentences.
- Point users toward the site's "Book Test Drive," "Waitlist," or "Ask a Specialist" actions rather than trying to complete a booking or collect personal details yourself in the chat.
- If a question is unrelated to Auravia, Linktour, electric mobility, or the site itself, say that's outside what you can help with and redirect to what you do know.`;

const MOCK_RULES = [
  {
    test: /(suspen|revok|revoc|\bbann?ed\b|driving ban)/i,
    reply:
      "The L6 can be driven with a Category AM or B license, and the L7 requires Category B. Whether a suspension, revocation, or driving ban also covers a given category depends on the terms of that decision, so we can't advise on it. Please check with the authority that issued it before driving.",
  },
  {
    test: /(licen[cs]e|\bcategory\b|\bage\b|how old|years old)/i,
    reply:
      "No special license is needed: a standard Category B (car) license covers both models. The L6 (L6e light quadricycle, max 45 km/h) can also be driven with a Category AM (moped) license, while the L7 (L7e heavy quadricycle) requires Category B. For minimum age requirements, our specialist team can confirm what applies to you.",
  },
  {
    test: /charg/i,
    reply:
      "Both the L6 and L7 charge from a standard household wall outlet — no dedicated wallbox required. The L6's 7.2 kWh battery charges fully (0–100%) in about 4 hours at 2 kW, and the L7's 12.96 kWh battery in about 4.5 hours at 3.3 kW.",
  },
  {
    test: /(l6|l7|compare|difference|quadricycle|speed limit)/i,
    reply:
      "The L6 is an L6e light quadricycle built for tight city streets: 7.2 kWh battery, 45 km/h top speed, 120 km range, drivable with a Category AM or B license. The L7 is an L7e heavy quadricycle: 12.96 kWh battery, 90 km/h top speed, 180 km range, and requires a Category B license.",
  },
  {
    test: /(warrant|servic|repair|battery|maintenance|parts)/i,
    reply:
      "AVC-SM, with 24+ years of experience in electric mobility and batteries, handles local warranty support, battery diagnostics, cell balancing, and repair in North Macedonia — backed by official Linktour parts.",
  },
  {
    test: /(test ?drive|book)/i,
    reply:
      "You can book a test drive right from this site — use the \"Book Test Drive\" button in the menu or hero section, or the quick action below.",
  },
  {
    test: /(pric|cost|deposit|pre-?order|reserve|waitlist)/i,
    reply:
      "Operating costs are low thanks to electric propulsion and compact design, but exact pricing is still being finalized. Join the waitlist or place a pre-order deposit and we'll follow up with introductory pricing as soon as it's confirmed.",
  },
  {
    test: /(delivery|logistics|import|shipping|romania|china)/i,
    reply:
      "BetaSped, our logistics partner with 30+ years of freight-forwarding experience, handles import and customs — vehicles arrive in Macedonia through an established, professional supply chain.",
  },
];

const FALLBACK_REPLY =
  "I can help with charging, comparing the L6 and L7, local warranty and service, or booking a test drive — what would you like to know? For anything specific, our specialist team can help via the \"Ask a Specialist\" form.";

function mockReply(userMessage) {
  const rule = MOCK_RULES.find((entry) => entry.test.test(userMessage));
  return rule ? rule.reply : FALLBACK_REPLY;
}

async function callAnthropic(apiKey, messages) {
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: "claude-opus-5",
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    output_config: { effort: "low" },
    messages: messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock?.text ?? FALLBACK_REPLY;
}

async function callOpenAI(apiKey, messages) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((message) => ({ role: message.role, content: message.content })),
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? FALLBACK_REPLY;
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const lastUserMessage =
    [...messages].reverse().find((message) => message.role === "user")?.content ?? "";

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  try {
    if (anthropicKey) {
      const reply = await callAnthropic(anthropicKey, messages);
      return Response.json({ reply, source: "anthropic" });
    }
    if (openaiKey) {
      const reply = await callOpenAI(openaiKey, messages);
      return Response.json({ reply, source: "openai" });
    }
  } catch (error) {
    console.error("Chat API provider error:", error);
    return Response.json({
      reply: mockReply(lastUserMessage),
      source: "mock",
      note: "AI provider unavailable — showing a canned response.",
    });
  }

  return Response.json({ reply: mockReply(lastUserMessage), source: "mock" });
}

import Anthropic from "@anthropic-ai/sdk";
import enDictionary from "@/dictionaries/en.json";
import mkDictionary from "@/dictionaries/mk.json";
import { DEFAULT_LOCALE, hasLocale } from "@/lib/i18n";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are the Auravia Electric Mobility assistant, embedded on the Auravia website for visitors in North Macedonia.

About Auravia: Auravia Electric Mobility is a joint venture between AVC-SM CO., LTD. (24+ years of experience in electric mobility, batteries, electronics, and technical support in North Macedonia) and BetaSped (30+ years of experience in international logistics, customs, and freight forwarding). Auravia imports, distributes, and services Linktour-brand electric vehicles in North Macedonia.

The two models:
- Linktour L6: registered as an L6e light quadricycle, built for tight city streets and everyday commuting. 7.2 kWh lithium iron phosphate (LFP) battery, full AC charge (0–100%) in about 4 hours at 2 kW, 45 km/h top speed, 120 km range (WMTC), 6 kW rated / 12 kW peak motor.
- Linktour L7: registered as an L7e heavy quadricycle, with a larger battery, higher top speed, and longer range than the L6. 12.96 kWh LFP battery, full AC charge (0–100%) in about 4.5 hours at 3.3 kW, 90 km/h top speed, 180 km range (WMTC), 10 kW rated / 23 kW peak motor.

Shared by both models: 1800 mm wheelbase, 1310/1300 mm front/rear track, 4.5 m turning circle, rear-wheel drive with a permanent magnet synchronous motor, AC charging only. Drive modes: L6 Normal; L7 Normal and Sport. Dimensions: L6 2685 × 1500 × 1555 mm, L7 2685 × 1500 × 1590 mm. Ground clearance: L6 140 mm, L7 130 mm. Max. permissible mass: L6 760 kg, L7 820 kg.

Standard equipment on every L6 and L7: glass canopy roof, frameless doors, LED daytime running and rear lights, 5-inch instrument cluster, 12V socket, adjustable driver and passenger seats, ABS with EBD, electric power steering, hill-start assist, regenerative braking, defrosting.

Licensing in North Macedonia: no special license is needed, since a standard Category B (car) license covers both models. The L6 (L6e light quadricycle, max 45 km/h) can be driven with a Category AM (moped) or Category B license. The L7 (L7e heavy quadricycle) requires a Category B license.

Core value proposition: low operating cost, compact size for easy urban parking, zero tailpipe emissions, and strong local after-sales support. Brand message: "Electric mobility made practical — compact outside, practical inside, drive more, spend less."

Local support: AVC-SM provides local warranty support, battery diagnostics, cell balancing, and repair, backed by official parts through the Linktour partnership. BetaSped handles import logistics and customs, so every vehicle arrives through an established, professional supply chain.

Ground rules:
- State only the specifications listed above; never invent any other figures. Pricing has not been announced yet: if asked, say so plainly and suggest joining the waitlist or using the "Ask a Specialist" form.
- Don't mention versions, trims, or trim names (such as "Alumi Plus" or "Elite+"); talk only about the L6 and L7.
- Beyond the standard equipment listed above, don't confirm features such as a touchscreen, CarPlay/Android Auto, Bluetooth, air conditioning, a rear camera, leather seats, keyless entry, or smartphone-app functions. Say they depend on the vehicle's configuration and suggest the "Ask a Specialist" form.
- Minimum driving ages aren't listed above: give the license category each model needs and suggest the "Ask a Specialist" form for age requirements.
- Don't give legal advice about driving while a license is suspended or revoked, or under a driving ban. Say that whether it affects a given category depends on the terms of that decision, and that the user should check with the authority that issued it.
- Keep answers concise and friendly — 2 to 4 sentences.
- Point users toward the site's "Book Test Drive," "Waitlist," or "Ask a Specialist" actions rather than trying to complete a booking or collect personal details yourself in the chat.
- If a question is unrelated to Auravia, Linktour, electric mobility, or the site itself, say that's outside what you can help with and redirect to what you do know.`;

const LANGUAGE_INSTRUCTIONS = {
  en: "Reply in English.",
  mk: 'Reply in Macedonian, written in Cyrillic, even if the visitor writes in English. Refer to the site\'s buttons by their Macedonian labels: "Закажи тест-возење", "Листа на чекање", and "Прашајте специјалист".',
};

const systemPromptFor = (locale) => `${SYSTEM_PROMPT}\n- ${LANGUAGE_INSTRUCTIONS[locale]}`;

// Reply text lives in dictionaries/*.json under chat.replies.<key>. Visitors may type in either
// language on either locale, so each rule has English and Macedonian patterns. Cyrillic isn't a
// \w character for \b, so Macedonian stems are anchored with a Unicode lookbehind instead —
// otherwise e.g. "чин" (as in "чини", costs) would also match "начин" (way).
const mkStems = (stems) => new RegExp(`(?<!\\p{L})(${stems.join("|")})`, "iu");

const MOCK_RULES = [
  {
    key: "suspension",
    patterns: [/(suspen|revok|revoc|\bbann?ed\b|driving ban)/i, mkStems(["суспен", "одзем", "забран"])],
  },
  {
    key: "license",
    patterns: [
      /(licen[cs]e|\bcategory\b|\bage\b|how old|years old)/i,
      mkStems(["дозвол", "категориј", "возраст", "колку години", "полнолет"]),
    ],
  },
  { key: "charging", patterns: [/charg/i, mkStems(["полн"])] },
  {
    key: "compare",
    patterns: [
      /(l6|l7|compare|difference|quadricycle|speed limit)/i,
      mkStems(["спореди", "споредба", "разлик", "квадрицикл"]),
    ],
  },
  {
    key: "service",
    patterns: [
      /(warrant|servic|repair|battery|maintenance|parts)/i,
      mkStems(["гаранц", "сервис", "поправ", "батериј", "одржув", "делови"]),
    ],
  },
  { key: "testDrive", patterns: [/(test ?drive|book)/i, mkStems(["тест", "закаж"])] },
  {
    key: "pricing",
    patterns: [
      /(pric|cost|deposit|pre-?order|reserve|waitlist)/i,
      mkStems(["цена", "цени", "чини", "трош", "депозит", "резерв", "преднарач", "листа на чекање"]),
    ],
  },
  {
    key: "logistics",
    patterns: [
      /(delivery|logistics|import|shipping|romania|china)/i,
      mkStems(["испорак", "достав", "увоз", "логистик", "царин", "романиј", "кина"]),
    ],
  },
];

const dictionaries = { en: enDictionary, mk: mkDictionary };

function mockReply(userMessage, replies) {
  const rule = MOCK_RULES.find((entry) => entry.patterns.some((re) => re.test(userMessage)));
  return replies[rule ? rule.key : "fallback"];
}

async function callAnthropic(apiKey, messages, locale, fallbackReply) {
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: "claude-opus-5",
    max_tokens: 500,
    system: systemPromptFor(locale),
    output_config: { effort: "low" },
    messages: messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock?.text ?? fallbackReply;
}

async function callOpenAI(apiKey, messages, locale, fallbackReply) {
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
        { role: "system", content: systemPromptFor(locale) },
        ...messages.map((message) => ({ role: message.role, content: message.content })),
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? fallbackReply;
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const locale = hasLocale(body?.locale) ? body.locale : DEFAULT_LOCALE;
  const { replies } = dictionaries[locale].chat;
  const lastUserMessage =
    [...messages].reverse().find((message) => message.role === "user")?.content ?? "";

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  try {
    if (anthropicKey) {
      const reply = await callAnthropic(anthropicKey, messages, locale, replies.fallback);
      return Response.json({ reply, source: "anthropic" });
    }
    if (openaiKey) {
      const reply = await callOpenAI(openaiKey, messages, locale, replies.fallback);
      return Response.json({ reply, source: "openai" });
    }
  } catch (error) {
    console.error("Chat API provider error:", error);
    return Response.json({
      reply: mockReply(lastUserMessage, replies),
      source: "mock",
      note: "AI provider unavailable — showing a canned response.",
    });
  }

  return Response.json({ reply: mockReply(lastUserMessage, replies), source: "mock" });
}

import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

interface Perspective {
  name: string;
  stance: string;
}

export async function POST(request: Request) {
  try {
    const { prompt, perspectives, rounds = 3 } = await request.json();

    /* ------ ①   各視点のプロファイル文字列を組み立て ------ */
    const participants: Perspective[] = perspectives ?? [];
    const roster = participants
      .map((p: Perspective) => `- ${p.name}: ${p.stance}`)
      .join("\n");

    /* ------ ②   OpenAI にディベート履歴生成を依頼 ------ */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an unbiased debate orchestrator.

Participants and their stances:
${roster}

Task:
1. Simulate a debate on the user's topic for ${rounds} rounds.
2. In each round every participant speaks exactly once, responding to prior remarks.
3. Be concise (≈2 sentences per speaker).
4. Return ONLY JSON with shape:
{ "history": [ { "speaker": "<name>", "message": "<text>" }, ... ] }`,
        },
        { role: "user", content: prompt },
      ],
    });

    console.log(completion);

    const { history } = JSON.parse(
      completion.choices[0].message.content ?? "{}",
    );
    console.log(history);
    return NextResponse.json({ history });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "failed to orchestrate debate" },
      { status: 400 },
    );
  }
}
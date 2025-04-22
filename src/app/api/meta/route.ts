import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" }, // JSON Mode
      messages: [
        {
          role: "system",
          content:
            'Respond ONLY with JSON: { "perspectives": [ { "name": "X", "stance": "Y" }, ... ] }',
        },
        { role: "user", content: prompt },
      ],
    });

    const { perspectives } = JSON.parse(
      completion.choices[0].message.content ?? "{}",
    );
    return NextResponse.json({ perspectives });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "failed to extract perspectives" },
      { status: 400 },
    );
  }
}
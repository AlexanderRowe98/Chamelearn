import OpenAI from "openai";

const openai = new OpenAI();

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          "role": "system",
          "content": [
            {
              "type": "text",
              "text": "Detect the language of the following text. Return only ISO 639."
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": message
            }
          ]
        }
      ]
    });

    console.log('uno', JSON.stringify(completion));

    const detectedLanguage = completion.choices[0].message.content;

    try {
      let systemMessage = `You are a nice foreign penpal to the user. Reply in language '${detectedLanguage}' and keep the conversation going. Ask questions about the users response or themselves. Also reply the exact same text in a separate message in 'en'. Separate the two responses with |||`;

      // OpenAI chat completion request
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            "role": "system",
            "content": [
              {
                "type": "text",
                "text": systemMessage
              }
            ]
          },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": message
              }
            ]
          }
        ]
      });

      console.log('dos', JSON.stringify(completion));

      const responses = completion.choices[0].message.content?.split('|||') ?? [];

      console.log('responses', responses);

      return NextResponse.json({ detectedResponse: responses[0] ?? '', preferredResponse: responses[1] ?? ''  }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Error processing your request." }, { status: 500 });
    }
  } catch (error) {
    console.error("Translation failed:", JSON.stringify(error));
    return NextResponse.json(
      { error: "Translation failed. Please try again." },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json(
    { message: "This endpoint only supports POST requests." },
    { status: 405 }
  );
}

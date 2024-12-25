import { translateText } from "@/utils/awsTranslate";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, sourceLang, targetLang } = await req.json();

    if (!text || !sourceLang || !targetLang) {
      return NextResponse.json(
        { error: "Missing required fields: text, sourceLang, or targetLang." },
        { status: 400 }
      );
    }

    const translatedText = await translateText(text, sourceLang, targetLang);

    return NextResponse.json({ translatedText }, { status: 200 });
  } catch (error) {
    console.error("Translation failed:", error);
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

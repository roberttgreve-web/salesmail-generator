import { NextRequest, NextResponse } from "next/server";
import { adjustEmail } from "@/lib/bedrock";

export async function POST(req: NextRequest) {
  try {
    const { emailText, instruction } = await req.json();

    if (!emailText || !instruction) {
      return NextResponse.json(
        { error: "emailText und instruction sind erforderlich." },
        { status: 400 }
      );
    }

    const adjusted = await adjustEmail(emailText, instruction);
    return NextResponse.json({ text: adjusted });
  } catch (err) {
    console.error("Bedrock error:", err);
    return NextResponse.json(
      { error: "KI-Anpassung fehlgeschlagen. Bitte erneut versuchen." },
      { status: 500 }
    );
  }
}

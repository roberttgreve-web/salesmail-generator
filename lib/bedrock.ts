import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const MODEL_ID =
  process.env.BEDROCK_MODEL_ID ||
  "anthropic.claude-3-5-haiku-20241022-v1:0";

export async function adjustEmail(
  currentEmail: string,
  instruction: string
): Promise<string> {
  const systemPrompt = `Du bist ein Assistent, der B2B-Angebots-E-Mails für DEIN ERSTER TAG anpasst. DEIN ERSTER TAG ist ein Unternehmen, das Ausbildungs- und Berufsmedien für Schulen produziert.

Regeln, die immer gelten:
- Verwende "Medium"/"Medien" statt "Film" oder "Video" für das produzierte Content-Stück
- Behalte Links unverändert
- Ändere NUR was der Nutzer verlangt, alles andere bleibt identisch
- Gib NUR den überarbeiteten E-Mail-Text zurück (ohne Betreff, ohne Erklärung)`;

  const userMessage = `Hier ist die aktuelle E-Mail:\n\n${currentEmail}\n\nBitte passe die E-Mail wie folgt an: ${instruction}`;

  const body = JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body,
  });

  const response = await client.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));
  return result.content[0].text as string;
}

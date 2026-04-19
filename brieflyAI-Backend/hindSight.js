import { HindsightClient } from '@vectorize-io/hindsight-client';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- CONFIG ---
const hindsight = new HindsightClient({
  baseUrl: 'https://api.hindsight.vectorize.io',
  apiKey: 'hsk_367a9a4a08b3e0490bb42bf0bd834962_6e030e4b7962c7c7'
});



const genAI = new GoogleGenerativeAI('AIzaSyBPvdcTHm8WoBiy0D6Sh6nDbXMpRQHCCTY');

// pick model
export const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });


// --- FUNCTION 1: Store Memory ---
export async function retainFromTranscript({
  userId,
  meetingId,
  transcript,
}) {
  const bank = userId || "default";

  const prompt = `
Extract the following from this conversation:

1. Concerns raised
2. Promises made
3. Key discussion points

Return STRICT JSON:
{
  "concerns": [],
  "promises": [],
  "points": []
}

Conversation:
${transcript}
`;

  // --- GEMINI CALL ---
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  let data;

  try {
    // Gemini sometimes wraps JSON → extract safely
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    const clean = text.slice(jsonStart, jsonEnd + 1);

    data = JSON.parse(clean);
  } catch (err) {
    console.error("Gemini JSON parse failed:", text);
    return { success: false };
  }

  const memories = [];

  memories.push({
    content: `Meeting snippet: ${transcript.slice(0, 500)}`,
    context: "raw",
  });
  (data.concerns || []).forEach((c) => {
    memories.push({
      content: `Concern: ${c}`,
      context: "concern",
    });
  });

  (data.promises || []).forEach((p) => {
    memories.push({
      content: `Promise: ${p}`,
      context: "promise",
    });
  });

  (data.points || []).forEach((p) => {
    memories.push({
      content: `Discussed: ${p}`,
      context: "discussion",
    });
  });

  if (memories.length === 0) {
    return { success: false, stored: 0 };
  }

  await hindsight.retainBatch(
    bank,
    memories.map((m) => ({
      content: m.content,
      context: m.context,
      metadata: {
        meetingId,
        timestamp: new Date().toISOString(),
      },
    }))
  );

  return {
    success: true,
    stored: memories.length,
  };
}


// --- FUNCTION 2: Retrieve Context ---
export async function askMemoryAgent({
  userId,
  userQuestion,
}) {
  let focus = 'all';

  if (userQuestion?.toLowerCase().includes("recent")) {
    focus = "recent";
  }

  const bank = userId || "default";

  let query = "";

  if (focus === "recent") {
    query = `
Focus on the most recent meeting interactions.

Answer clearly and concisely.

Question: ${userQuestion}
`;
  } else {
    query = `
Use all relevant past meeting interactions.

Answer clearly and concisely.

Question: ${userQuestion}
`;
  }

  const res = await hindsight.reflect(bank, query);
  console.log(res);
  return res.text;
}


// --- TEST CALL ---
// await retainFromTranscript({
//   userId: 'abhiram',
//   meetingId: '286329832603',
//   transcript: `Hello, and we are Team Ravenclaw 3301. I feel great after winning this hackathon. I'm receiving 350 USD. We had a great team, a great frontend team. I would like to emphasize on front-end team again and again, and a good back-end team too.`
// });
// await askMemoryAgent({userId:'abhiram', userQuestion:'what all gpu were mentioned in my last meet?'});
import express from "express";
import cors from 'cors'
const app = express();

const PORT = 3000;
import  {runRecordingFlow } from './botflow.js'  
import  {askMemoryAgent, model } from './hindSight.js'  
import  {getTranscript } from './localdb/schema.js'
import { connectDB } from "./localdb/db.js";
import { User } from "./localdb/schema.js";
// Middleware
app.use(cors())
app.use(express.json());
await connectDB();
// Routes
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Example POST route
app.post("/api/startBot", async (req, res) => {

  const data = req.body;
  if(!data.meetingUrl || !data.userId || !data.title) return res.json({
    message:"MeetingUrl, title or userId is missing"
  })
  const result = await runRecordingFlow(data.meetingUrl, data.userId, data.title);
  if(!result.success) return res.json({message:"Something went wrong in Recording or Hindsight thingggggg!!!!!"});
  res.json({
    message: "Success"
  });
});

app.post("/api/chat", async (req, res) => {

  const data = req.body;
  if(!data.userId || !data.userQuestion || !data.meetingUrl) return res.json({
    message:"Prompt, MeetingUrl or userId is missing"
  })
  //get the accurate response using prev contxt 
  const result_1 = await askMemoryAgent(data.userId, data.userQuestion);
  const result_2 = await getTranscript(data.userId, data.meetingUrl);
  const prompt = `You are an assistant that answers questions about a meeting.

You are given two sources:
1. Hindsight Context (may be incomplete or uncertain): 
${result_1}

2. Raw Meeting Transcript (ground truth but noisy):
${result_2}

User Query:
${data.userQuestion}

Instructions:
- Prioritize Hindsight Context if it clearly answers the question.
- If Hindsight Context is incomplete, vague, or says it cannot determine the answer, use the Raw Transcript to infer the answer.
- If both sources conflict, trust the Raw Transcript.
- Keep the response concise (3–5 sentences max).
- Answer directly. Do not mention “hindsight” or “transcript” in the response.
- If the answer cannot be found in either source, say you don’t have enough information.

Output:
Provide a clear, direct answer to the user’s query.`;
  
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  let response;

//   try {
//     // Gemini sometimes wraps JSON → extract safely
//     const jsonStart = text.indexOf('{');
//     const jsonEnd = text.lastIndexOf('}');
//     const clean = text.slice(jsonStart, jsonEnd + 1);

//     response = JSON.parse(clean);
//   } catch (err) {
//     console.error("Gemini JSON parse failed:", text);
//     return { success: false };
//   }
  


  if(!result_1) return res.json({message:"Something went wrong in retrieving from Hindsight!!!!!"});
  res.json({
    text: text,
    success:true
  });
});

app.get("/meetings", async(req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
  
      const user = await User.findOne(
        { userId },
        { meetings: 1, _id: 0 } // return only meetings
      );
  
      if (!user) {
        return res.json({ meetings: [] });
      }
  
      res.json({ meetings: user.meetings });
    // res.json({ status: "ok" });
  });

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


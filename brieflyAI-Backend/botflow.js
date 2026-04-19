const BASE_URL = 'https://ap-northeast-1.recall.ai/api/v1';
const API_KEY = '808ca732a387818e625d7f695e6cf685d7639132';
console.log(API_KEY);
import { transcribeAudio } from './getTranscript.js';
import { retainFromTranscript } from './hindSight.js';
import { addMeeting } from './localdb/schema.js';
// helpers
const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const headers = {
  'accept': 'application/json',
  'content-type': 'application/json',
  'Authorization': API_KEY
};

// --- STEP 1: Create Bot ---
async function createBot(meetingUrl) {
  const res = await fetch(`${BASE_URL}/bot/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      meeting_url: meetingUrl,
      bot_name: 'Briefly.AI',
    //   recording_config: {
    //     transcript: {
    //       provider: {
    //         recallai_streaming: {
    //           mode:'prioritize_low_latency' // or "realtime" / "batch" depending on your use case
    //         }
    //       }
    //     }
    //   }
    })
  });

  const data = await res.json();
  return data;
}

// --- STEP 2: Start Recording ---
async function startRecording(botId) {
  const res = await fetch(`${BASE_URL}/bot/${botId}/start_recording/`, {
    method: 'POST',
    headers
  });

  return res.json();
}

// --- STEP 3: Stop Recording ---
async function stopRecording(botId) {
  const res = await fetch(`${BASE_URL}/bot/${botId}/stop_recording/`, {
    method: 'POST',
    headers
  });

  return res.json();
}

// --- STEP 4: Get Recording ---
async function getRecording(recordingId) {
  const res = await fetch(`${BASE_URL}/recording/${recordingId}/`, {
    method: 'GET',
    headers
  });

  return res.json();
}

// --- STEP 5: Get Transcript ---
// async function getTranscript(recordingData) {
//   // depends on Recall response structure
//   // usually transcripts are inside recording object

//   if (recordingData.transcript) {
//     return recordingData.transcript;
//   }

//   // fallback
//   return recordingData;
// }

// --- MAIN FLOW ---
export async function runRecordingFlow(meetingUrl, userId, title) {
  try {

    console.log("Creating bot...");
    const bot = await createBot(meetingUrl);
    console.log(bot);
    const botId = bot.id;
    console.log("Bot ID:", botId);


    console.log("Starting recording...");
    const startRes = await startRecording(botId);
    
    console.log(startRes);

    console.log("Recording for 70 seconds...");
    await sleep(60000); // ~1 min


    console.log("Stopping recording...");
    const stopRes = await stopRecording(botId);
    console.log("Stopped recording...");
    console.log(stopRes);

    const recordingId = stopRes?.recordings[0]?.id;
    console.log(recordingId);
    // Extract recording ID
    // const recordingId = stopRes.recording_id || stopRes.id;

    console.log("Recording ID:", recordingId);

    console.log("waiting for recording to be processed...");
    await sleep(30000);
    
    //get recording data
    const recording = await getRecording(recordingId);
    console.log(JSON.stringify(recording, null, 2));

    //video_url of the video
    const video_url = recording?.media_shortcuts?.video_mixed?.data?.download_url;


    //video to transcript
    const transcript = await transcribeAudio(video_url);
    console.log("Transcript:", transcript);

    // push in to local db
    console.log("Pushing to local db...")
    await addMeeting(userId, meetingUrl, transcript, title);
    //push this shit to hindsight
    console.log("Pushing to hindsight...");
    const hindsightRes = await retainFromTranscript({userId:userId, meetingId:recordingId, transcript:transcript});
    console.log("Hindsight Response:", hindsightRes);

    return hindsightRes;

  } catch (err) {
    console.error("Error in recording flow:", err);
  }
}
// runRecordingFlow('meet.google.com/yji-yaaa-nxy', 'abhiram');
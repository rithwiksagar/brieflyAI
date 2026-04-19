import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    meetingUrl: {
      type: String,
      required: true,
    },
    transcript: {
      type: String,
      required: true,
    },
    title: {
        type: String,
        required: true, // or optional if you prefer
    }
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    meetings: [meetingSchema], // array of objects
    
  },
  { timestamps: true }
);

export async function addMeeting(userId, meetingUrl, transcript, title) {
    await User.updateOne(
      { userId },
      {
        $push: {
          meetings: { meetingUrl, transcript, title },
        },
      },
      { upsert: true }
    );
  }
  export async function getTranscript(userId, meetingUrl) {
    const user = await User.findOne(
      {
        userId,
        "meetings.meetingUrl": meetingUrl,
      },
      {
        meetings: { $elemMatch: { meetingUrl } }, // only return matched meeting
      }
    );
  
    if (!user || user.meetings.length === 0) {
      return null;
    }
  
    return user.meetings[0].transcript;
  }
export const User = mongoose.model("User", userSchema);
import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect('mongodb+srv://db:abhiram@cluster0.ezwat.mongodb.net/.', {
      dbName: "meetingsDB", // optional (can also include in URI)
    });

    isConnected = conn.connections[0].readyState === 1;

    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}
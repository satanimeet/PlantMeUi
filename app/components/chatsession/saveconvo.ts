// supabaseHelpers.ts
import { supabase } from "../lib/supabaseClient";

export async function saveConversation(
  sessionId: string,
  question: string,
  answer: string,
  audioUrl?: string,
  imageUrl?: string
) {
  const { error } = await supabase.from("messages").insert([
    {
      session_id: sessionId,
      sender: "user",
      content: question,
      type: imageUrl ? "image" : audioUrl ? "audio" : "text",
      audio_url: audioUrl || null,
      image_url: imageUrl || null,
    },
    {
      session_id: sessionId,
      sender: "bot",
      content: answer,
      type: "text",
    },
  ]);

  if (error) console.error("Error saving conversation:", error);
}

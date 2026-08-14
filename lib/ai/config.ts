import { google } from "@ai-sdk/google";

// Gemini model used by the Book Finder AI chat.
// API key is read server-side from GOOGLE_GENERATIVE_AI_API_KEY.
export const chatModel = google("gemini-3-flash-preview");

// System instructions for the Book Finder AI assistant.
export const bookFinderSystemPrompt =
  "You are an AI book discovery assistant. Help users discover books based on their reading preferences, including genre, mood, themes, authors, and tropes. Ask useful follow-up questions when the user's preferences are unclear. Give concise, helpful recommendations.";
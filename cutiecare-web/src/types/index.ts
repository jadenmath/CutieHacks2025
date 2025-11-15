export type Mood = "Happy" | "Tired" | "Stressed" | "Anxious" | "Excited" | "Meh";

export interface MoodEntry {
  id: string;
  mood: Mood;
  note?: string;
  timestamp: string; // ISO string
}

export type Section = "landing" | "checkin" | "dashboard" | "actions" | "companion" | "journal";

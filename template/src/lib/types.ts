export interface VoiceEntry {
  id: string;
  user_id: string;
  audio_url: string | null;
  transcript_raw: string;
  transcript_user: string;
  language_detected: string;
  language_rendered: string;
  tags_model: string[];
  tags_user: string[];
  category: string | null;
  created_at: string;
  updated_at: string;
  emotion_score_score: number | null;
  embedding: number[] | null;
}

export interface DetectedGoal {
  task_text: string;
  due_date: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  category: string | null;
  confidence: number;
  source_entry_id: string;
}

export interface ProcessedResult {
  summary: string;
  tagFrequencies: Record<string, number>;
  detectedGoals: DetectedGoal[];
} 